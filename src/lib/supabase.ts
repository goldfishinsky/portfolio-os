
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owhqrvhsxmpmrecxavug.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aHFydmhzeG1wbXJlY3hhdnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODEwMDksImV4cCI6MjA3NjY1NzAwOX0.HRQyxMOhO3krQJ9y7pcZjJvSl1NrTkrUYRLM5WQorwQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
