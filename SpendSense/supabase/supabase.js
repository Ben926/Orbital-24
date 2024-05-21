import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://lbcjnerzlslcgertxpqw.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiY2puZXJ6bHNsY2dlcnR4cHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyNjc4MTYsImV4cCI6MjAzMTg0MzgxNn0.fmz-jYawbkJDNKMlyq0VVR5gpbOvvFx-2yBau29kOoo"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;