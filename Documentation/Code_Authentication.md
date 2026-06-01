
# Authentication & Role Management
```javascript
// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // 1. Fetch initial session from DB
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchUserRole(session.user);
    });

    // 2. Listen for real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserRole(session.user);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (user) => {
    setUser(user);
    // Role-based access control logic
    if (user.email === "admin@servease.com") {
      setRole("admin");
    } else {
      // Fetch role from profiles table
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setRole(data?.role || "customer");
    }
  };
}
```
