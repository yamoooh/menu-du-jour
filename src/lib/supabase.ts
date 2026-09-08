import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const DEFAULT_SUPABASE_URL = 'https://neqnbrhmacperiinpstp.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lcW5icmhtYWNwZXJpaW5wc3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjMzOTgsImV4cCI6MjEwNDQzOTM5OH0.V1ZasmSAJOpMyofZsuK9pYY_kdzUlOrvct_NYKEjP0Y'

export const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL
export const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Client Supabase unique et toujours correctement initialisé pour le frontend
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
