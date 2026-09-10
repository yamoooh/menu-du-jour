-- ============================================================
-- MIGRATION ÉTAPE 8 : ABONNEMENTS RESTAURANTS ET FLUX LEEKPAY
-- ============================================================

-- 1. Fonction de confirmation de paiement et prolongation d'abonnement (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION confirm_payment_subscription(
  p_restaurant_id UUID,
  p_amount INTEGER DEFAULT 5000,
  p_provider_ref TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  v_sub RECORD;
  v_payment_id UUID;
  v_now TIMESTAMPTZ := NOW();
  v_new_end TIMESTAMPTZ;
  v_new_start TIMESTAMPTZ;
  v_plan_type TEXT := COALESCE(p_metadata->>'plan_type', CASE WHEN p_amount = 50000 THEN 'annual' ELSE 'monthly' END);
  v_days INTEGER;
BEGIN
  -- 0. Validation stricte du couple (montant, formule)
  IF v_plan_type = 'annual' AND p_amount = 50000 THEN
    v_days := 365;
  ELSIF v_plan_type = 'monthly' AND p_amount = 5000 THEN
    v_days := 30;
  ELSE
    RAISE EXCEPTION 'Combinaison montant/formule invalide : plan=%, amount=% XOF (Seules monthly+5000 XOF et annual+50000 XOF sont valides)', v_plan_type, p_amount;
  END IF;

  -- 1. Idempotence 1 : Si la référence de transaction provider a déjà été crédité avec succès
  IF p_provider_ref IS NOT NULL AND p_provider_ref != '' THEN
    SELECT id INTO v_payment_id
    FROM public.payments
    WHERE provider_transaction_ref = p_provider_ref AND status = 'completed';

    IF v_payment_id IS NOT NULL THEN
      RETURN jsonb_build_object(
        'success', true,
        'message', 'Paiement déjà traité (idempotent)',
        'payment_id', v_payment_id
      );
    END IF;
  END IF;

  -- 1b. Idempotence 2 : Si le checkout_id a déjà été crédité avec succès
  IF (p_metadata->>'checkout_id') IS NOT NULL AND (p_metadata->>'checkout_id') != '' THEN
    SELECT id INTO v_payment_id
    FROM public.payments
    WHERE metadata->>'checkout_id' = (p_metadata->>'checkout_id') AND status = 'completed';

    IF v_payment_id IS NOT NULL THEN
      RETURN jsonb_build_object(
        'success', true,
        'message', 'Checkout déjà traité (idempotent)',
        'payment_id', v_payment_id
      );
    END IF;
  END IF;

  -- 2. Récupérer l'abonnement du restaurant
  SELECT * INTO v_sub
  FROM public.subscriptions
  WHERE restaurant_id = p_restaurant_id;

  IF v_sub.id IS NULL THEN
    INSERT INTO public.subscriptions (restaurant_id, status, trial_start_at, trial_end_at)
    VALUES (p_restaurant_id, 'expired', v_now - INTERVAL '1 day', v_now - INTERVAL '1 day')
    RETURNING * INTO v_sub;
  END IF;

  -- 3. Calcul de la nouvelle date d'expiration (préservation des jours restants d'un abonnement actif ou d'un essai gratuit)
  IF v_sub.status = 'active' AND v_sub.current_period_end IS NOT NULL AND v_sub.current_period_end > v_now THEN
    -- Abonnement actif en cours : la prolongation s'ajoute à la fin de la période actuelle (aucun jour perdu)
    v_new_start := v_sub.current_period_start;
    v_new_end := v_sub.current_period_end + (v_days || ' days')::INTERVAL;
  ELSIF v_sub.status = 'trialing' AND v_sub.trial_end_at IS NOT NULL AND v_sub.trial_end_at > v_now THEN
    -- Essai gratuit en cours : la période payante s'ajoute à la fin de la période d'essai (aucun jour d'essai perdu)
    v_new_start := v_now;
    v_new_end := v_sub.trial_end_at + (v_days || ' days')::INTERVAL;
  ELSE
    -- Abonnement expiré ou inactif : démarrage immédiat aujourd'hui
    v_new_start := v_now;
    v_new_end := v_now + (v_days || ' days')::INTERVAL;
  END IF;

  -- 4. Mettre à jour l'abonnement
  UPDATE public.subscriptions
  SET status = 'active',
      current_period_start = COALESCE(v_new_start, v_now),
      current_period_end = v_new_end,
      updated_at = v_now
  WHERE restaurant_id = p_restaurant_id;

  -- 5. Enregistrer le paiement
  INSERT INTO public.payments (
    restaurant_id,
    subscription_id,
    amount,
    currency,
    provider,
    provider_transaction_ref,
    status,
    paid_at,
    metadata
  )
  VALUES (
    p_restaurant_id,
    v_sub.id,
    p_amount,
    'XOF',
    'leekpay',
    p_provider_ref,
    'completed',
    v_now,
    p_metadata
  )
  RETURNING id INTO v_payment_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', format('Abonnement activé/prolongé de %s jours avec succès', v_days),
    'payment_id', v_payment_id,
    'plan_type', v_plan_type,
    'current_period_end', v_new_end
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Sécurisation RLS pour UPDATE sur les menus (requiert abonnement actif)
DROP POLICY IF EXISTS "menus: modification" ON public.menus;
CREATE POLICY "menus: modification"
  ON public.menus FOR UPDATE
  USING (
    is_restaurant_owner(restaurant_id) 
    AND is_subscription_active(restaurant_id)
    OR is_admin()
  );

-- 3. Sécurisation RLS pour INSERT/UPDATE sur les éléments de menu (requiert abonnement actif)
DROP POLICY IF EXISTS "menu_items: creation" ON public.menu_items;
CREATE POLICY "menu_items: creation"
  ON public.menu_items FOR INSERT
  WITH CHECK (
    is_restaurant_owner(restaurant_id) 
    AND is_subscription_active(restaurant_id)
    OR is_admin()
  );

DROP POLICY IF EXISTS "menu_items: modification" ON public.menu_items;
CREATE POLICY "menu_items: modification"
  ON public.menu_items FOR UPDATE
  USING (
    is_restaurant_owner(restaurant_id) 
    AND is_subscription_active(restaurant_id)
    OR is_admin()
  );
