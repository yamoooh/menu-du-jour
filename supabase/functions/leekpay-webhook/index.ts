import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-leekpay-signature, x-leekpay-event, x-leekpay-delivery',
}

// Convertir Uint8Array en chaîne Hex
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Vérification de signature HMAC SHA-256 selon la spécification officielle LeekPay
async function verifyLeekPaySignature(
  rawBody: string,
  signatureHeader: string | null,
  secretKey: string
): Promise<boolean> {
  if (!signatureHeader || !secretKey) return false
  const cleanSig = signatureHeader.replace(/^sha256=/, '').trim().toLowerCase()

  try {
    const encoder = new TextEncoder()
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(rawBody))
    const computedSig = bytesToHex(new Uint8Array(signatureBuffer))
    return computedSig === cleanSig
  } catch (err) {
    console.error('Erreur vérification HMAC SHA-256 LeekPay:', err)
    return false
  }
}

serve(async (req) => {
  // Gérer CORS preflight
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

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Lire le corps brut pour le calcul de la signature HMAC
    const rawBody = await req.text()
    let body: any = {}
    try {
      body = JSON.parse(rawBody)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Payload JSON invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // En-têtes officiels LeekPay Webhook
    const signatureHeader = req.headers.get('x-leekpay-signature') || req.headers.get('x-signature')
    const eventHeader = req.headers.get('x-leekpay-event')
    const deliveryHeader = req.headers.get('x-leekpay-delivery')

    // Secret du Webhook LeekPay (configuré via `supabase secrets set LEEKPAY_WEBHOOK_SECRET=...` ou LEEKPAY_PUBLIC_KEY)
    const webhookSecret = Deno.env.get('LEEKPAY_WEBHOOK_SECRET') || Deno.env.get('LEEKPAY_PUBLIC_KEY')
    if (webhookSecret) {
      const isValid = await verifyLeekPaySignature(rawBody, signatureHeader, webhookSecret)
      if (!isValid) {
        console.warn('Tentative d appel non autorisée au Webhook LeekPay (Signature HMAC invalide)')
        return new Response(
          JSON.stringify({ error: 'Signature HMAC SHA-256 LeekPay invalide (X-LeekPay-Signature)' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else {
      console.log('Notice: LEEKPAY_WEBHOOK_SECRET / LEEKPAY_PUBLIC_KEY non configuré dans les secrets Supabase. Signature non vérifiée.')
    }

    // Structure du Payload officiel LeekPay Webhook
    const eventType = eventHeader || body.event || 'payment.completed'
    const payloadData = body.data || body

    const restaurant_id =
      payloadData.metadata?.restaurant_id ||
      payloadData.restaurant_id ||
      body.restaurant_id ||
      body.metadata?.restaurant_id

    const provider_ref =
      payloadData.transaction_id ||
      payloadData.checkout_id ||
      payloadData.provider_ref ||
      body.provider_ref ||
      deliveryHeader ||
      `LEEK-${Date.now()}`

    const amount = Number(payloadData.amount || body.amount || 5000)
    const paymentStatus = (payloadData.status || body.status || 'completed').toString().toLowerCase()

    if (!restaurant_id) {
      return new Response(
        JSON.stringify({ error: 'restaurant_id obligatoire dans metadata.restaurant_id ou dans le webhook' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier que le statut correspond bien à un paiement réussi
    const validPaidStatuses = ['completed', 'success', 'paid', 'successful', 'payment.completed', 'payment.success']
    const isPaid = validPaidStatuses.includes(paymentStatus) || validPaidStatuses.includes(eventType.toLowerCase())

    if (!isPaid) {
      console.log(`Paiement LeekPay non finalisé (statut: ${paymentStatus}, événement: ${eventType}). Aucune prolongation d abonnement.`)
      return new Response(
        JSON.stringify({ message: 'Événement reçu mais paiement non finalisé, aucune action effectuée', status: paymentStatus }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Appeler la RPC PostgreSQL confirm_payment_subscription (sécurisée en SECURITY DEFINER)
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('confirm_payment_subscription', {
      p_restaurant_id: restaurant_id,
      p_amount: amount,
      p_provider_ref: provider_ref,
      p_metadata: {
        event: eventType,
        delivery_id: deliveryHeader,
        checkout_id: payloadData.checkout_id,
        payment_method: payloadData.payment_method,
        customer: payloadData.customer,
        received_at: new Date().toISOString(),
        ...payloadData.metadata,
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
