const SUPABASE_URL = 'https://idhamypkvekfwmofewqc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_mmW8Bo_-QtfV_P2w4js6bg_1FjdmrQq';

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log('Supabase client creado:', window.supabaseClient);