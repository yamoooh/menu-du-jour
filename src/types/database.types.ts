// Types TypeScript pour la future base de données Supabase.
// Ce fichier sera complété ou généré automatiquement (via supabase gen types typescript)
// dès que les tables métier auront été définies.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: Record<string, unknown>
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
    CompositeTypes: Record<string, unknown>
  }
}
