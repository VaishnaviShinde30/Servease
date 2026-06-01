import { createClient } from '@supabase/supabase-js'

let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
let supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

if (!supabaseUrl) {
  supabaseUrl = 'https://dummy123.supabase.co';
}
if (!supabaseAnonKey) {
  supabaseAnonKey = 'dummy-key-1234567890';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
