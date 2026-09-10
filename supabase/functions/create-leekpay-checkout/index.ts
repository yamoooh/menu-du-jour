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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const leekpaySecretKey = Deno.env.get('LEEKPAY_SECRET_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Variables d environnement Supabase manquantes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!leekpaySecretKey) {
      console.error('Erreur : LEEKPAY_SECRET_KEY non configurée dans Supabase secrets')
      return new Response(
        JSON.stringify({ error: 'Clé secrète LeekPay (LEEKPAY_SECRET_KEY) non configurée dans les secrets Supabase' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Authentifier l'utilisateur via le token JWT Authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'En-tête Authorization manquant' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Utilisateur non authentifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const bodyJson = await req.json().catch(() => ({}))
    const { restaurant_id, plan_type } = bodyJson

    if (!restaurant_id) {
      return new Response(
        JSON.stringify({ error: 'restaurant_id obligatoire dans le body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const requestedPlan = plan_type ? String(plan_type).toLowerCase() : 'monthly'
    if (requestedPlan !== 'monthly' && requestedPlan !== 'annual') {
      return new Response(
        JSON.stringify({ error: `Formule d abonnement invalide: '${plan_type}'. Seules 'monthly' (5000 FCFA) et 'annual' (50000 FCFA) sont autorisées.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const isAnnual = requestedPlan === 'annual'
    const amount = isAnnual ? 50000 : 5000
    const planDurationLabel = isAnnual ? '365 jours (Pass Annuel)' : '30 jours (Pass Mensuel)'

    // Vérifier la propriété du restaurant côté serveur
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const { data: restaurant, error: restError } = await supabaseAdmin
      .from('restaurants')
      .select('id, name, owner_id')
      .eq('id', restaurant_id)
      .single()

    if (restError || !restaurant) {
      return new Response(
        JSON.stringify({ error: 'Restaurant introuvable' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire du restaurant ou un admin global
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isOwner = restaurant.owner_id === user.id

    if (!isOwner && !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Seul le propriétaire ou un administrateur peut renouveler l abonnement de ce restaurant' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Origine pour URLs de retour
    const origin = req.headers.get('origin') || 'https://menu-du-jour-phi.vercel.app'
    const successUrl = `${origin}/espace-restaurant?payment=pending`
    const cancelUrl = `${origin}/espace-restaurant?payment=cancelled`

    // Payload officiel de création de Checkout LeekPay
    const checkoutPayload = {
      amount,
      currency: 'XOF',
      description: `Abonnement ${planDurationLabel} Menu du Jour - ${restaurant.name}`,
      metadata: {
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        user_id: user.id,
        plan_type: isAnnual ? 'annual' : 'monthly',
        days: isAnnual ? 365 : 30,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      return_url: successUrl,
    }

    // Appel à l'API REST officielle LeekPay (POST /v1/checkouts)
    let leekpayRes = await fetch('https://api.leekpay.me/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${leekpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutPayload),
    })

    // Fallback d'endpoint si /checkouts retourne 404 (variante /checkout)
    if (leekpayRes.status === 404) {
      leekpayRes = await fetch('https://api.leekpay.me/v1/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${leekpaySecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutPayload),
      })
    }

    const resData = await leekpayRes.json()

    if (!leekpayRes.ok) {
      console.error('Erreur API LeekPay Checkout:', resData)
      return new Response(
        JSON.stringify({ error: resData.message || resData.error || 'Erreur lors de la création de la session de paiement LeekPay' }),
        { status: leekpayRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // URL de paiement générée par LeekPay
    const checkoutUrl = resData.checkout_url || resData.url || resData.payment_url || resData.data?.checkout_url || resData.data?.url

    if (!checkoutUrl) {
      console.error('Réponse LeekPay invalide (URL manquante):', resData)
      return new Response(
        JSON.stringify({ error: 'URL de paiement introuvable dans la réponse LeekPay' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkout_url: checkoutUrl,
        checkout_id: resData.id || resData.checkout_id || resData.data?.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    console.error('Exception Edge Function create-leekpay-checkout:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Erreur serveur lors de la création du checkout' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
