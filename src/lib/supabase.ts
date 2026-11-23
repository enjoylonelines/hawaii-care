import {createClient} from '@supabase/supabase-js';
const endpoint=process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT;
export const supabase=endpoint&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?createClient(new URL(endpoint).origin,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY):null;
