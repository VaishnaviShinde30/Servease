import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserRole(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserRole(session.user);
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (user) => {
    try {
      setUser(user);

      // STRICT ADMIN REQUIREMENT: Hardcode admin email
      if (user.email === 'vaishnavishinde7494@gmail.com') {
        setRole('admin');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching role:', error.message);
      // Dummy logic for fallback/testing without real supabase DB connection
      const localRole = localStorage.getItem(`role_${user.id}`);
      if (localRole) {
        setRole(localRole);
      } else if (user.email === 'admin@servease.com') {
        setRole('admin');
      } else if (user.email.includes('shop')) {
        setRole('shopkeeper');
      } else {
        setRole('user');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, name, selectedRole) => {
    // STRICT ADMIN REQUIREMENT: Prevent 'admin' creation through signup
    if (selectedRole === 'admin') {
      throw new Error('Access Denied: Cannot create admin accounts through signup.');
    }

    // Check if the user is trying to signup using the predefined admin email
    if (email === 'vaishnavishinde7494@gmail.com') {
      throw new Error('Access Denied: This email is reserved for system admin.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    if (data?.user) {
      // Set fallback role in case DB insert fails or RLS blocks fetch
      localStorage.setItem(`role_${data.user.id}`, selectedRole);
      
      // Insert into users table
      try {
        const { error: dbError } = await supabase.from('users').insert([
          { id: data.user.id, email, name, role: selectedRole }
        ]);
        if (dbError) console.error('DB Insert Error (Handled by Local Storage):', dbError);
      } catch (err) {
        console.error('DB Catch (Handled by Local Storage):', err);
      }
    }
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
