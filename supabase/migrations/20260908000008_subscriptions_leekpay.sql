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
BEGIN
  -- 1. Vérification d'idempotence si une référence de transaction est fournie
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

  -- 2. Récupérer l'abonnement du restaurant
  SELECT * INTO v_sub
  FROM public.subscriptions
  WHERE restaurant_id = p_restaurant_id;

  IF v_sub.id IS NULL THEN
    INSERT INTO public.subscriptions (restaurant_id, status, trial_start_at, trial_end_at)
    VALUES (p_restaurant_id, 'expired', v_now - INTERVAL '1 day', v_now - INTERVAL '1 day')
    RETURNING * INTO v_sub;
  END IF;

  -- 3. Calcul de la nouvelle date d'expiration (+30 jours)
  IF (v_sub.status = 'active' AND v_sub.current_period_end > v_now) OR
     (v_sub.status = 'trialing' AND v_sub.trial_end_at > v_now) THEN
    
    IF v_sub.status = 'active' AND v_sub.current_period_end IS NOT NULL THEN
      v_new_start := v_sub.current_period_start;
      v_new_end := v_sub.current_period_end + INTERVAL '30 days';
    ELSE
      v_new_start := v_now;
      v_new_end := v_sub.trial_end_at + INTERVAL '30 days';
    END IF;
  ELSE
    v_new_start := v_now;
    v_new_end := v_now + INTERVAL '30 days';
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
    'message', 'Abonnement activé/prolongé de 30 jours avec succès',
    'payment_id', v_payment_id,
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
