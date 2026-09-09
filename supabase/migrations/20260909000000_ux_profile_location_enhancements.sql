-- ============================================================
-- MIGRATION ÉTAPE 20 : ENRICHISSEMENT DES PROFILS & GÉOLOCALISATION
-- ============================================================

-- 1. Ajout des colonnes de géolocalisation et de réservation dans `restaurants`
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS formatted_address TEXT,
  ADD COLUMN IF NOT EXISTS google_place_id TEXT,
  ADD COLUMN IF NOT EXISTS accepts_reservations BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS max_party_size INTEGER NOT NULL DEFAULT 10 CHECK (max_party_size > 0),
  ADD COLUMN IF NOT EXISTS reservation_instructions TEXT;

-- 2. Création automatique des buckets Supabase Storage s'ils n'existent pas
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('restaurant-assets', 'restaurant-assets', true),
  ('avatars', 'avatars', true),
  ('menu-photos', 'menu-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Politiques de sécurité Storage pour `restaurant-assets` (Logos, Couvertures)
CREATE POLICY "restaurant-assets: lecture publique"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-assets');

CREATE POLICY "restaurant-assets: upload par utilisateurs authentifiés"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'restaurant-assets' AND auth.role() = 'authenticated');

CREATE POLICY "restaurant-assets: suppression par utilisateurs authentifiés"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'restaurant-assets' AND auth.role() = 'authenticated');

-- 4. Politiques de sécurité Storage pour `avatars` (Photos de profil)
CREATE POLICY "avatars: lecture publique"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars: upload par utilisateur authentifié"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "avatars: suppression par utilisateur authentifié"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- 5. Politiques de sécurité Storage pour `menu-photos` (Images et PDF de menus)
CREATE POLICY "menu-photos: lecture publique"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-photos');

CREATE POLICY "menu-photos: upload par utilisateur authentifié"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-photos' AND auth.role() = 'authenticated');

CREATE POLICY "menu-photos: suppression par utilisateur authentifié"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-photos' AND auth.role() = 'authenticated');
