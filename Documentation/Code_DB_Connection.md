
# Database Connection (Supabase)
```javascript
// src/supabase.js
import { createClient } from "@supabase/supabase-js"

// Initialize environment variables securely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create the unified database connection client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
