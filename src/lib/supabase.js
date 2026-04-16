import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigError = (!url || !anonKey)
  ? 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in the Vercel project env and redeploy.'
  : null

if (supabaseConfigError) console.error(supabaseConfigError)

export const supabase = supabaseConfigError
  ? null
  : createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
