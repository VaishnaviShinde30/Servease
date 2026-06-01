
const fs = require("fs");
const path = require("path");

const docPath = path.join(__dirname, "Documentation");
if (!fs.existsSync(docPath)) fs.mkdirSync(docPath);

const dbCode = `
# Database Connection (Supabase)
\`\`\`javascript
// src/supabase.js
import { createClient } from "@supabase/supabase-js"

// Initialize environment variables securely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create the unified database connection client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
\`\`\`
`;

const authCode = `
# Authentication & Role Management
\`\`\`javascript
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
\`\`\`
`;

const searchCode = `
# Smart Search & Recommendation Algorithm
\`\`\`javascript
// src/pages/UserDashboard.jsx
const getRecommendations = () => {
  // 1. Initial Filtering (Type, Search Query, Price Limits, Minimum Rating)
  const filteredShops = shopsWithDistance.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || shop.type === selectedType;
    const matchesPrice = filterPrice === "all" 
      ? true 
      : filterPrice === "low" ? shop.price < 500
      : filterPrice === "medium" ? (shop.price >= 500 && shop.price <= 1000)
      : shop.price > 1000;
    const matchesRating = shop.rating >= filterRating;

    return matchesSearch && matchesType && matchesPrice && matchesRating;
  });

  if (filteredShops.length === 0) return [];

  // 2. Normalization for Smart Recommendation Scoring
  const maxP = Math.max(...filteredShops.map(s => s.price));
  const maxD = Math.max(...filteredShops.map(s => s.distance || 0));

  // 3. Weighted Scoring System
  const scoredShops = filteredShops.map(shop => {
    // Normalize values between 0 and 1
    const normDistance = shop.distance ? (shop.distance / maxD) : 0;
    const normPrice = shop.price ? (shop.price / maxP) : 0;
    const normRating = shop.rating / 5;

    // Recommendation Formula: Highest Score wins
    // Weights: Distance (40%), Price (30%), Rating (30%)
    const score = ((1 - normDistance) * 0.4) + ((1 - normPrice) * 0.3) + (normRating * 0.3);

    return { ...shop, score };
  });

  // 4. Sort and return the highest scored shops
  return scoredShops.sort((a, b) => b.score - a.score);
};
\`\`\`
`;

const fullDoc = `
# Servease: Full Project Documentation

This file contains all code required for your demonstration. 
Open this file in VS Code and press "Ctrl + Shift + V" (or right click -> Open Preview) to see it perfectly formatted.

${dbCode}
---
${authCode}
---
${searchCode}
`;

fs.writeFileSync(path.join(docPath, "Code_DB_Connection.md"), dbCode);
fs.writeFileSync(path.join(docPath, "Code_Authentication.md"), authCode);
fs.writeFileSync(path.join(docPath, "Code_Search_Algorithm.md"), searchCode);
fs.writeFileSync(path.join(docPath, "Full_Code_Documentation.md"), fullDoc);

console.log("Docs generated.");

