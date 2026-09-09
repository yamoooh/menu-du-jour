import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Optionnel : Vérification de la clé secrète LeekPay si configurée dans les secrets Deno Supabase
    const webhookSecret = Deno.env.get('LEEKPAY_WEBHOOK_SECRET')
    if (webhookSecret) {
      const incomingSecret = req.headers.get('x-leekpay-secret') || req.headers.get('x-leekpay-signature') || req.headers.get('authorization')
      if (!incomingSecret || !incomingSecret.includes(webhookSecret)) {
        console.warn('Tentative d appel non autorisée au Webhook LeekPay (secret invalide ou absent)')
        return new Response(
          JSON.stringify({ error: 'Signature ou secret Webhook LeekPay invalide' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else {
      console.log('Indication : LEEKPAY_WEBHOOK_SECRET non configuré dans les secrets Supabase. Traitement direct du payload.')
    }

    const body = await req.json()

    // LeekPay webhook payload schema:
    // { event: "payment.success" | "payment.completed", restaurant_id: "...", provider_ref: "...", amount: 5000, metadata: {} }
    const { event, restaurant_id, provider_ref, amount = 5000, metadata = {} } = body

    if (!restaurant_id) {
      return new Response(
        JSON.stringify({ error: 'restaurant_id obligatoire dans le webhook LeekPay' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Appeler la fonction RPC sécurisée
    const { data, error } = await supabaseAdmin.rpc('confirm_payment_subscription', {
      p_restaurant_id: restaurant_id,
      p_amount: Number(amount) || 5000,
      p_provider_ref: provider_ref || `LEEK-${Date.now()}`,
      p_metadata: {
        event: event || 'payment.completed',
        received_at: new Date().toISOString(),
        ...metadata,
      },
    })

    if (error) {
      console.error('Erreur RPC confirm_payment_subscription:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, result: data }),
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
