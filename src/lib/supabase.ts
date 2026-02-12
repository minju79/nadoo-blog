import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for public access (reading posts, submitting forms)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (creating posts via API)
// Only use this in API routes or Server Actions, never in client components!
export const supabaseAdmin = (serviceRoleKey: string) => {
    return createClient(supabaseUrl, serviceRoleKey);
};
