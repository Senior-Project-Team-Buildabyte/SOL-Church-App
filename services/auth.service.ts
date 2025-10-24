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

  signUpWithEmail: async (email: string, password: string, captchaToken: string | undefined) => {
    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { captchaToken: captchaToken ?? undefined }
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
  resetPassword: async (email: string, captchaToken: string | undefined, ) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'exp+solchurchapp://expo-development-client/?url=http%3A%2F%2F100.64.10.238%3A8081/&path=%5Bauth%5D%2Fupdate-password',
      // redirectTo: 'exp+solchurchapp://',
      captchaToken: captchaToken ?? undefined,
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

  getRoleForUser: async(userId : string | null) => {
    var role = null;

    if(userId){
      const { data } = await supabase
      .from("user_role")
      .select(`role_id`)
      .eq('user_id', userId);
      role = data![0].role_id;
    }
    return role ?? 3;
  }

};