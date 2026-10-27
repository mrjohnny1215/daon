import { createClient } from '@supabase/supabase-js'

export const databaseUrl = import.meta.env.VITE_SUPABASE_URL
export const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = databaseUrl && publicKey ? createClient(databaseUrl, publicKey) : null
