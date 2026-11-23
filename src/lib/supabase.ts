import {createClient} from '@supabase/supabase-js';
const endpoint=import.meta.env.VITE_INQUIRY_ENDPOINT;
export const supabase=endpoint&&import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?createClient(new URL(endpoint).origin,import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY):null;
