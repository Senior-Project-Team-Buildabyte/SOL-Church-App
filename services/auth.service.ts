import { supabase } from '../lib/supabase';

export const authService = {
  
  // Sign in with email and password
  // signIn: async (email: string, password: string) => {
  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  //   if (error) throw error;
  //   return data;
  // },

  signUpWithEmail: async (email: string, password: string) => {
    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      throw error;
    }
    return data;
  },

  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getSession();
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'exp+solchurchapp://',
    });
    if (error) throw error;
  },

  // Update user password
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

};