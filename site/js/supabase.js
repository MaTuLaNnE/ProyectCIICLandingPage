const { createClient } = supabase

const supabaseUrl = "https://idhamypkvekfwmofewqc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaGFteXBrdmVrZndtb2Zld3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTA0OTgsImV4cCI6MjA5MDM4NjQ5OH0.yXZkoTU33EZEtpD3XwLvrx_65Kw0IXuRevRssOdDnzM"

window.supabase = createClient(supabaseUrl, supabaseAnonKey)
