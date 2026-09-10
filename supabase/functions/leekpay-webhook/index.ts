import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-leekpay-signature, x-leekpay-event, x-leekpay-delivery',
}

// Convertir un Uint8Array en chaîne Hexadécimale
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Vérification de la signature HMAC SHA-256 avec la clé publique pk_live LeekPay sur le raw body
async function verifyLeekPaySignature(
  rawBody: string,
  signatureHeader: string | null,
  publicKey: string
): Promise<boolean> {
  if (!signatureHeader || !publicKey) return false
  const cleanSig = signatureHeader.replace(/^sha256=/, '').trim().toLowerCase()

  try {
    const encoder = new TextEncoder()
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(publicKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(rawBody))
    const computedSig = bytesToHex(new Uint8Array(signatureBuffer))
    return computedSig === cleanSig
  } catch (err) {
    console.error('Erreur lors de la vérification HMAC SHA-256 LeekPay:', err)
    return false
  }
}

serve(async (req) => {
  // Gérer le pré-vol CORS (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Variables d environnement Supabase manquantes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1. Contrôle obligatoire de la présence de la clé publique LeekPay serveur (LEEKPAY_PUBLIC_KEY)
    const leekpayPublicKey = Deno.env.get('LEEKPAY_PUBLIC_KEY')
    if (!leekpayPublicKey) {
      console.error('Erreur de sécurité : LEEKPAY_PUBLIC_KEY non configurée dans Supabase secrets')
      return new Response(
        JSON.stringify({ error: 'Accès non autorisé : LEEKPAY_PUBLIC_KEY manquante dans Supabase secrets' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Contrôle obligatoire de la présence de l'en-tête X-LeekPay-Signature
    const signatureHeader = req.headers.get('x-leekpay-signature') || req.headers.get('x-signature')
    if (!signatureHeader) {
      console.warn('Requête rejetée : En-tête X-LeekPay-Signature absent')
      return new Response(
        JSON.stringify({ error: 'Accès non autorisé : En-tête X-LeekPay-Signature absent' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Lecture du corps brut (raw body) AVANT toute analyse JSON
    const rawBody = await req.text()

    // 4. Vérification HMAC SHA-256 stricte : Rejet HTTP 401 si la signature est invalide
    const isSignatureValid = await verifyLeekPaySignature(rawBody, signatureHeader, leekpayPublicKey)
    if (!isSignatureValid) {
      console.warn('Requête rejetée : Signature HMAC SHA-256 LeekPay invalide')
      return new Response(
        JSON.stringify({ error: 'Accès non autorisé : Signature HMAC SHA-256 LeekPay invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 5. Analyse du JSON après validation de signature
    let body: any = {}
    try {
      body = JSON.parse(rawBody)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Payload JSON invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 6. Validation stricte de l'événement (payment.completed)
    const eventHeader = req.headers.get('x-leekpay-event')
    const eventType = eventHeader || body.event
    if (eventType !== 'payment.completed') {
      console.log(`Événement ${eventType} ignoré : Seul payment.completed est crédité.`)
      return new Response(
        JSON.stringify({ message: `Événement ${eventType} ignoré`, success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 7. Extraction des données et vérifications de sécurité avant crédit
    const data = body.data || {}
    const transactionId = data.transaction_id || body.transaction_id
    const checkoutId = data.checkout_id || body.checkout_id
    const amount = Number(data.amount || body.amount)
    const currency = data.currency || body.currency
    const status = data.status || body.status
    const restaurantId = data.metadata?.restaurant_id || body.metadata?.restaurant_id || body.restaurant_id

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'data.transaction_id obligatoire dans le webhook LeekPay' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!restaurantId) {
      return new Response(
        JSON.stringify({ error: 'data.metadata.restaurant_id obligatoire dans le webhook LeekPay' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (currency !== 'XOF') {
      return new Response(
        JSON.stringify({ error: `Devise invalide : ${currency} (XOF attendu)` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extraction et validation de plan_type transmis via metadata
    const rawPlan = data.metadata?.plan_type || body.metadata?.plan_type || (amount === 50000 ? 'annual' : amount === 5000 ? 'monthly' : null)
    const planType = rawPlan ? String(rawPlan).toLowerCase() : null

    // Contrôle strict d'adéquation entre la formule et le montant payé
    if (planType === 'monthly' && amount !== 5000) {
      console.error(`Paiement rejeté : Formule 'monthly' requiert exactement 5000 XOF (montant reçu : ${amount} XOF)`)
      return new Response(
        JSON.stringify({ error: `Incohérence paiement : La formule mensuelle 'monthly' nécessite exactement 5000 XOF (reçu ${amount} XOF)` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (planType === 'annual' && amount !== 50000) {
      console.error(`Paiement rejeté : Formule 'annual' requiert exactement 50000 XOF (montant reçu : ${amount} XOF)`)
      return new Response(
        JSON.stringify({ error: `Incohérence paiement : La formule annuelle 'annual' nécessite exactement 50000 XOF (reçu ${amount} XOF)` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (planType !== 'monthly' && planType !== 'annual') {
      return new Response(
        JSON.stringify({ error: `Formule d abonnement invalide ou non reconnue : '${rawPlan}' avec montant ${amount} XOF` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 8. Vérification stricte du statut réussi : Seul le statut "paid" est crédité
    if (status !== 'paid') {
      console.log(`Paiement non finalisé (statut : ${status}). Aucune prolongation d abonnement.`)
      return new Response(
        JSON.stringify({ message: `Paiement avec statut '${status}' non crédité (seul 'paid' est valide)`, success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 9. Validation de l'abonnement et idempotence via la RPC PostgreSQL sécurisée
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('confirm_payment_subscription', {
      p_restaurant_id: restaurantId,
      p_amount: amount,
      p_provider_ref: transactionId,
      p_metadata: {
        event: eventType,
        checkout_id: checkoutId,
        plan_type: planType,
        payment_method: data.payment_method,
        customer: data.customer,
        paid_at: data.paid_at || new Date().toISOString(),
        delivery_id: req.headers.get('x-leekpay-delivery'),
      },
    })

    if (rpcError) {
      console.error('Erreur RPC confirm_payment_subscription:', rpcError)
      return new Response(
        JSON.stringify({ error: rpcError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, result: rpcResult }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    console.error('Exception Webhook LeekPay:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Erreur interne Webhook' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
