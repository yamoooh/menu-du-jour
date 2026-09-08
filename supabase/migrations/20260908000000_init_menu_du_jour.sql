-- ============================================================
-- MIGRATION : 20260908000000_init_menu_du_jour
-- Projet    : Menu du Jour (PWA)
-- Date      : 2026-09-08
-- Description : Schéma initial complet — tables, enums,
--   contraintes, index, fonctions, triggers, RLS policies.
-- Choix validés :
--   - Pas de contrainte SQL reservation_date >= CURRENT_DATE
--   - Slug auto-généré via trigger (unaccent + suffixe numérique)
--   - Plusieurs restaurants par gestionnaire autorisés
--   - Notifications gérées par Edge Functions (pas de triggers SQL)
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM (
  'client',
  'restaurant_manager',
  'admin'
);

CREATE TYPE menu_status AS ENUM (
  'draft',
  'published'
);

CREATE TYPE menu_item_category AS ENUM (
  'entree',
  'plat',
  'dessert',
  'boisson',
  'formule',
  'autre'
);

CREATE TYPE reservation_status AS ENUM (
  'pending',
  'confirmed',
  'rejected',
  'cancelled',
  'completed',
  'no_show'
);

CREATE TYPE subscription_status AS ENUM (
  'trialing',
  'active',
  'expired',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

CREATE TYPE notification_type AS ENUM (
  'new_menu',
  'reservation_confirmed',
  'reservation_rejected',
  'reservation_cancelled',
  'reservation_completed',
  'subscription_expiring',
  'subscription_expired',
  'system'
);

-- ============================================================
-- FONCTION GÉNÉRIQUE : updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE : profiles
-- Extension de auth.users (1:1). Créée automatiquement par trigger.
-- ============================================================
CREATE TABLE profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        user_role   NOT NULL DEFAULT 'client',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger : création automatique du profil lors de l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'client'
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FONCTIONS HELPER (SECURITY DEFINER)
-- Déclarées tôt pour être utilisables dans les contraintes/policies
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_restaurant_owner(p_restaurant_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE id = p_restaurant_id AND owner_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_subscription_active(p_restaurant_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE restaurant_id = p_restaurant_id
    AND (
      (status = 'trialing' AND trial_end_at > NOW())
      OR
      (status = 'active'   AND current_period_end > NOW())
    )
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- TABLE : restaurants
-- Appartient à un restaurant_manager (owner_id).
-- Un manager peut posséder plusieurs restaurants.
-- ============================================================
CREATE TABLE restaurants (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  description     TEXT,
  phone           TEXT,
  email           TEXT,
  address         TEXT,
  city            TEXT,
  country         TEXT        NOT NULL DEFAULT 'Côte d''Ivoire',
  latitude        DECIMAL(10, 8),
  longitude       DECIMAL(11, 8),
  capacity        INTEGER     NOT NULL DEFAULT 20 CHECK (capacity > 0),
  cover_image_url TEXT,
  logo_url        TEXT,
  cuisine_type    TEXT,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  is_verified     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index recherche et filtrage
CREATE INDEX idx_restaurants_owner
  ON restaurants(owner_id);

CREATE INDEX idx_restaurants_city
  ON restaurants(city);

CREATE INDEX idx_restaurants_active
  ON restaurants(is_active)
  WHERE is_active = TRUE;

CREATE INDEX idx_restaurants_name_trgm
  ON restaurants USING GIN(name gin_trgm_ops);

CREATE INDEX idx_restaurants_location
  ON restaurants(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================
-- FONCTION + TRIGGER : génération automatique du slug
-- Utilise unaccent + regexp pour produire un slug URL-safe.
-- Ajoute un suffixe numérique (-2, -3…) si doublon.
-- ============================================================
CREATE OR REPLACE FUNCTION generate_restaurant_slug(
  p_name TEXT,
  p_id   UUID DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_base_slug TEXT;
  v_slug      TEXT;
  v_counter   INTEGER := 2;
BEGIN
  -- 1. Supprimer les accents
  v_base_slug := lower(unaccent(p_name));
  -- 2. Remplacer tout caractère non alphanumérique par un tiret
  v_base_slug := regexp_replace(v_base_slug, '[^a-z0-9]+', '-', 'g');
  -- 3. Supprimer les tirets en début/fin
  v_base_slug := trim(both '-' from v_base_slug);
  -- 4. Limiter à 80 caractères
  v_base_slug := left(v_base_slug, 80);

  v_slug := v_base_slug;

  -- 5. Boucler jusqu'à trouver un slug unique
  WHILE EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE slug = v_slug
      AND (p_id IS NULL OR id != p_id)
  ) LOOP
    v_slug    := v_base_slug || '-' || v_counter;
    v_counter := v_counter + 1;
  END LOOP;

  RETURN v_slug;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_restaurant_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Générer si slug absent ou si le nom change sans modification manuelle du slug
  IF TG_OP = 'INSERT' THEN
    IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
      NEW.slug := generate_restaurant_slug(NEW.name, NULL);
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.name != OLD.name AND NEW.slug = OLD.slug THEN
      NEW.slug := generate_restaurant_slug(NEW.name, NEW.id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restaurants_auto_slug
  BEFORE INSERT OR UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION handle_restaurant_slug();

-- ============================================================
-- TABLE : restaurant_hours
-- Horaires d'ouverture. Un enregistrement par jour (0=Lun … 6=Dim).
-- ============================================================
CREATE TABLE restaurant_hours (
  id            UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID     NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week   SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_closed     BOOLEAN  NOT NULL DEFAULT FALSE,
  open_time     TIME,
  close_time    TIME,
  UNIQUE(restaurant_id, day_of_week),
  CONSTRAINT valid_hours CHECK (
    is_closed = TRUE
    OR (
      open_time  IS NOT NULL
      AND close_time IS NOT NULL
      AND open_time < close_time
    )
  )
);

CREATE INDEX idx_restaurant_hours_restaurant
  ON restaurant_hours(restaurant_id);

-- ============================================================
-- TABLE : menus
-- Un menu par restaurant par date. Un seul menu publié par jour.
-- ============================================================
CREATE TABLE menus (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title         TEXT        NOT NULL,
  description   TEXT,
  menu_date     DATE        NOT NULL,
  status        menu_status NOT NULL DEFAULT 'draft',
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contrainte métier : 1 seul menu publié par restaurant par date
CREATE UNIQUE INDEX idx_one_published_menu_per_day
  ON menus(restaurant_id, menu_date)
  WHERE status = 'published';

CREATE INDEX idx_menus_restaurant
  ON menus(restaurant_id);

CREATE INDEX idx_menus_date
  ON menus(menu_date DESC);

CREATE INDEX idx_menus_published
  ON menus(status)
  WHERE status = 'published';

CREATE INDEX idx_menus_restaurant_date
  ON menus(restaurant_id, menu_date DESC);

CREATE TRIGGER menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger : horodatage automatique de la publication
CREATE OR REPLACE FUNCTION set_menu_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published'
     AND (OLD.status IS DISTINCT FROM 'published')
  THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER menus_set_published_at
  BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION set_menu_published_at();

-- ============================================================
-- TABLE : menu_items
-- Plats d'un menu. restaurant_id dénormalisé pour RLS sans jointure.
-- ============================================================
CREATE TABLE menu_items (
  id            UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id       UUID               NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  restaurant_id UUID               NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT               NOT NULL,
  description   TEXT,
  price         DECIMAL(10, 2)     NOT NULL CHECK (price >= 0),
  category      menu_item_category NOT NULL DEFAULT 'plat',
  accompaniment TEXT,
  display_order SMALLINT           NOT NULL DEFAULT 0,
  is_available  BOOLEAN            NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_menu_items_menu
  ON menu_items(menu_id, display_order);

CREATE INDEX idx_menu_items_restaurant
  ON menu_items(restaurant_id);

-- ============================================================
-- TABLE : menu_photos
-- Photos d'un menu stockées dans Supabase Storage.
-- storage_path : chemin relatif dans le bucket "menu-photos".
-- ============================================================
CREATE TABLE menu_photos (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id       UUID        NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  restaurant_id UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  storage_path  TEXT        NOT NULL,
  alt_text      TEXT,
  display_order SMALLINT    NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_photos_menu
  ON menu_photos(menu_id, display_order);

CREATE INDEX idx_menu_photos_restaurant
  ON menu_photos(restaurant_id);

-- ============================================================
-- TABLE : restaurant_followers
-- Suivi d'un restaurant par un client. Doublon impossible (UNIQUE).
-- ============================================================
CREATE TABLE restaurant_followers (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  client_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(restaurant_id, client_id)
);

CREATE INDEX idx_followers_restaurant
  ON restaurant_followers(restaurant_id);

CREATE INDEX idx_followers_client
  ON restaurant_followers(client_id);

-- ============================================================
-- TABLE : reservations
-- Cycle de vie : pending → confirmed | rejected | cancelled → completed | no_show
-- Pas de contrainte SQL sur reservation_date >= CURRENT_DATE
-- (validation gérée côté application pour ne pas bloquer les mises à jour)
-- ============================================================
CREATE TABLE reservations (
  id               UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id    UUID               NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  client_id        UUID               NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  menu_id          UUID               REFERENCES menus(id) ON DELETE SET NULL,
  reservation_date DATE               NOT NULL,
  reservation_time TIME               NOT NULL,
  party_size       SMALLINT           NOT NULL CHECK (party_size BETWEEN 1 AND 100),
  customer_name    TEXT               NOT NULL,
  customer_phone   TEXT               NOT NULL,
  message          TEXT,
  status           reservation_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  confirmed_at     TIMESTAMPTZ,
  cancelled_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  CONSTRAINT rejection_reason_required CHECK (
    status != 'rejected' OR rejection_reason IS NOT NULL
  )
);

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger : horodatages automatiques de confirmation et annulation
CREATE OR REPLACE FUNCTION handle_reservation_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    NEW.confirmed_at = NOW();
  END IF;
  IF NEW.status IN ('cancelled', 'no_show')
     AND OLD.status NOT IN ('cancelled', 'no_show')
  THEN
    NEW.cancelled_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_status_timestamps
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION handle_reservation_status_change();

CREATE INDEX idx_reservations_restaurant
  ON reservations(restaurant_id, reservation_date DESC);

CREATE INDEX idx_reservations_client
  ON reservations(client_id);

CREATE INDEX idx_reservations_date
  ON reservations(reservation_date);

CREATE INDEX idx_reservations_status
  ON reservations(status);

-- ============================================================
-- TABLE : notifications
-- Notifications in-app. Logique d'envoi gérée par Edge Functions.
-- ============================================================
CREATE TABLE notifications (
  id         UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID              NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      TEXT              NOT NULL,
  body       TEXT              NOT NULL,
  data       JSONB             NOT NULL DEFAULT '{}',
  is_read    BOOLEAN           NOT NULL DEFAULT FALSE,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user
  ON notifications(user_id, created_at DESC);

CREATE INDEX idx_notifications_unread
  ON notifications(user_id, is_read)
  WHERE is_read = FALSE;

-- ============================================================
-- TABLE : push_subscriptions
-- Souscriptions Web Push par utilisateur et par appareil.
-- ============================================================
CREATE TABLE push_subscriptions (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint   TEXT        NOT NULL,
  p256dh     TEXT        NOT NULL,
  auth       TEXT        NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

CREATE TRIGGER push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_push_subscriptions_user
  ON push_subscriptions(user_id);

-- ============================================================
-- TABLE : subscriptions
-- Abonnement professionnel (1:1 avec restaurant).
-- Créé automatiquement à la création du restaurant.
-- ============================================================
CREATE TABLE subscriptions (
  id                   UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id        UUID                NOT NULL UNIQUE REFERENCES restaurants(id) ON DELETE CASCADE,
  status               subscription_status NOT NULL DEFAULT 'trialing',
  trial_start_at       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  trial_end_at         TIMESTAMPTZ         NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  created_at           TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_subscriptions_restaurant
  ON subscriptions(restaurant_id);

CREATE INDEX idx_subscriptions_status
  ON subscriptions(status);

-- Trigger : création automatique de la subscription à la création du restaurant
CREATE OR REPLACE FUNCTION handle_new_restaurant()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (restaurant_id)
  VALUES (NEW.id)
  ON CONFLICT (restaurant_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_restaurant_created
  AFTER INSERT ON restaurants
  FOR EACH ROW EXECUTE FUNCTION handle_new_restaurant();

-- ============================================================
-- TABLE : payments
-- Historique des paiements LeekPay. Insertions via service_role uniquement.
-- provider_transaction_ref UNIQUE → idempotence webhook.
-- ============================================================
CREATE TABLE payments (
  id                       UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id            UUID           NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  subscription_id          UUID           REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount                   INTEGER        NOT NULL CHECK (amount > 0),
  currency                 TEXT           NOT NULL DEFAULT 'XOF',
  provider                 TEXT           NOT NULL DEFAULT 'leekpay',
  provider_transaction_ref TEXT           UNIQUE,
  status                   payment_status NOT NULL DEFAULT 'pending',
  paid_at                  TIMESTAMPTZ,
  metadata                 JSONB          NOT NULL DEFAULT '{}',
  created_at               TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_payments_restaurant
  ON payments(restaurant_id, created_at DESC);

CREATE INDEX idx_payments_subscription
  ON payments(subscription_id);

CREATE INDEX idx_payments_status
  ON payments(status);

CREATE INDEX idx_payments_provider_ref
  ON payments(provider_transaction_ref)
  WHERE provider_transaction_ref IS NOT NULL;

-- ============================================================
-- ROW LEVEL SECURITY — ACTIVATION
-- ============================================================
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants          ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_hours     ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus                ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_photos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments             ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES : profiles
-- ============================================================
CREATE POLICY "profiles: lecture soi-même ou admin"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles: modification soi-même"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- RLS POLICIES : restaurants
-- ============================================================
CREATE POLICY "restaurants: lecture publique des restaurants actifs"
  ON restaurants FOR SELECT
  USING (is_active = TRUE OR owner_id = auth.uid() OR is_admin());

CREATE POLICY "restaurants: création par restaurant_manager"
  ON restaurants FOR INSERT
  WITH CHECK (
    owner_id = auth.uid()
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'restaurant_manager'
  );

CREATE POLICY "restaurants: modification par propriétaire ou admin"
  ON restaurants FOR UPDATE
  USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "restaurants: suppression par admin uniquement"
  ON restaurants FOR DELETE
  USING (is_admin());

-- ============================================================
-- RLS POLICIES : restaurant_hours
-- ============================================================
CREATE POLICY "hours: lecture publique"
  ON restaurant_hours FOR SELECT
  USING (TRUE);

CREATE POLICY "hours: création par propriétaire"
  ON restaurant_hours FOR INSERT
  WITH CHECK (is_restaurant_owner(restaurant_id));

CREATE POLICY "hours: modification par propriétaire ou admin"
  ON restaurant_hours FOR UPDATE
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

CREATE POLICY "hours: suppression par propriétaire ou admin"
  ON restaurant_hours FOR DELETE
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

-- ============================================================
-- RLS POLICIES : menus
-- ============================================================
CREATE POLICY "menus: lecture des menus publiés + propriétaire + admin"
  ON menus FOR SELECT
  USING (
    status = 'published'
    OR is_restaurant_owner(restaurant_id)
    OR is_admin()
  );

CREATE POLICY "menus: création (abonnement actif requis)"
  ON menus FOR INSERT
  WITH CHECK (
    is_restaurant_owner(restaurant_id)
    AND is_subscription_active(restaurant_id)
  );

CREATE POLICY "menus: modification par propriétaire ou admin"
  ON menus FOR UPDATE
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

CREATE POLICY "menus: suppression par propriétaire ou admin"
  ON menus FOR DELETE
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

-- ============================================================
-- RLS POLICIES : menu_items
-- ============================================================
CREATE POLICY "menu_items: lecture (menu publié ou propriétaire)"
  ON menu_items FOR SELECT
  USING (
    is_restaurant_owner(restaurant_id)
    OR is_admin()
    OR EXISTS (
      SELECT 1 FROM menus WHERE id = menu_id AND status = 'published'
    )
  );

CREATE POLICY "menu_items: création par propriétaire"
  ON menu_items FOR INSERT
  WITH CHECK (is_restaurant_owner(restaurant_id));

CREATE POLICY "menu_items: modification par propriétaire ou admin"
  ON menu_items FOR UPDATE
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

CREATE POLICY "menu_items: suppression par propriétaire ou admin"
  ON menu_items FOR DELETE
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

-- ============================================================
-- RLS POLICIES : menu_photos
-- ============================================================
CREATE POLICY "menu_photos: lecture (menu publié ou propriétaire)"
  ON menu_photos FOR SELECT
  USING (
    is_restaurant_owner(restaurant_id)
    OR is_admin()
    OR EXISTS (
      SELECT 1 FROM menus WHERE id = menu_id AND status = 'published'
    )
  );

CREATE POLICY "menu_photos: création par propriétaire"
  ON menu_photos FOR INSERT
  WITH CHECK (is_restaurant_owner(restaurant_id));

CREATE POLICY "menu_photos: suppression par propriétaire ou admin"
  ON menu_photos FOR DELETE
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

-- ============================================================
-- RLS POLICIES : restaurant_followers
-- ============================================================
CREATE POLICY "followers: lecture publique"
  ON restaurant_followers FOR SELECT
  USING (TRUE);

CREATE POLICY "followers: suivi par le client lui-même"
  ON restaurant_followers FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "followers: unfollow par le client ou admin"
  ON restaurant_followers FOR DELETE
  USING (client_id = auth.uid() OR is_admin());

-- ============================================================
-- RLS POLICIES : reservations
-- ============================================================
CREATE POLICY "reservations: lecture par client, propriétaire ou admin"
  ON reservations FOR SELECT
  USING (
    client_id = auth.uid()
    OR is_restaurant_owner(restaurant_id)
    OR is_admin()
  );

CREATE POLICY "reservations: création par client authentifié"
  ON reservations FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "reservations: modification (client si pending, propriétaire, admin)"
  ON reservations FOR UPDATE
  USING (
    is_restaurant_owner(restaurant_id)
    OR is_admin()
    OR (client_id = auth.uid() AND status = 'pending')
  );

-- ============================================================
-- RLS POLICIES : notifications
-- ============================================================
CREATE POLICY "notifications: lecture soi-même ou admin"
  ON notifications FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "notifications: marquer comme lue (soi-même)"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- INSERT via service_role uniquement (Edge Functions) — pas de policy utilisateur

-- ============================================================
-- RLS POLICIES : push_subscriptions
-- ============================================================
CREATE POLICY "push: lecture soi-même"
  ON push_subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "push: inscription soi-même"
  ON push_subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "push: mise à jour soi-même"
  ON push_subscriptions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "push: suppression soi-même"
  ON push_subscriptions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- RLS POLICIES : subscriptions
-- ============================================================
CREATE POLICY "subscriptions: lecture par propriétaire ou admin"
  ON subscriptions FOR SELECT
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

CREATE POLICY "subscriptions: mise à jour par admin uniquement"
  ON subscriptions FOR UPDATE
  USING (is_admin());

-- ============================================================
-- RLS POLICIES : payments
-- ============================================================
CREATE POLICY "payments: lecture par propriétaire ou admin"
  ON payments FOR SELECT
  USING (is_restaurant_owner(restaurant_id) OR is_admin());

-- INSERT uniquement via service_role (webhook LeekPay → Edge Function)
-- Pas de policy INSERT pour les utilisateurs normaux
