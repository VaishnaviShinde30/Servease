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
      if (_event === 'PASSWORD_RECOVERY') {
        window.location.href = '/update-password';
        return;
      }
      
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

  const saveLoggedUserToDemo = (user, role) => {
    const existingDemoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const userExists = existingDemoUsers.some(u => u.email === user.email || u.id === user.id);
    if (!userExists) {
      const newUserRecord = {
        id: user.id,
        name: user.user_metadata?.name || user.email.split('@')[0],
        email: user.email,
        role: role,
        suspended: false
      };
      localStorage.setItem('demo_users', JSON.stringify([...existingDemoUsers, newUserRecord]));
    }
  };

  const fetchUserRole = async (user) => {
    try {
      setUser(user);

      // STRICT ADMIN REQUIREMENT: Hardcode admin email
      if (user.email === 'vaishnavishinde7494@gmail.com') {
        setRole('admin');
        saveLoggedUserToDemo(user, 'admin');
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
        saveLoggedUserToDemo(user, data.role);
      }
    } catch (error) {
      console.error('Error fetching role:', error.message);
      // Dummy logic for fallback/testing without real supabase DB connection
      const localRole = localStorage.getItem(`role_${user.id}`);
      let finalRole = 'user';
      if (localRole) {
        finalRole = localRole;
      } else if (user.email === 'admin@servease.com') {
        finalRole = 'admin';
      } else if (user.email.includes('shop')) {
        finalRole = 'shopkeeper';
      } else {
        finalRole = 'user';
      }
      setRole(finalRole);
      saveLoggedUserToDemo(user, finalRole);
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
      
      // Save user to demo_users for Admin Dashboard
      const existingDemoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const newUser = {
        id: data.user.id,
        name: name,
        email: email,
        role: selectedRole,
        suspended: false
      };
      localStorage.setItem('demo_users', JSON.stringify([...existingDemoUsers, newUser]));

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

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password',
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, signup, logout, resetPassword, updatePassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
