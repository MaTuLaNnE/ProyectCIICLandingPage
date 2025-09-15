const { createClient } = supabase

const supabaseUrl = "https://xsysdcvyryzxldlyrbfo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzeXNkY3Z5cnl6eGxkbHlyYmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MjY0NTIsImV4cCI6MjA3MzMwMjQ1Mn0.xTCWftzODlXrfpTXLadrQ78K8b0SlxcLZ_ddTWH5Lfg"

window.supabase = createClient(supabaseUrl, supabaseAnonKey)
