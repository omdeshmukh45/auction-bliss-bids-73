
import { supabase } from "@/integrations/supabase/client";

// Function to handle user sign-up
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      throw new Error(error.message);
    }

    // With our Supabase trigger, profile creation is automatic
    return data;
  } catch (error: any) {
    console.error("Error in signUp:", error.message);
    throw error;
  }
};

// Function to handle user sign-in
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      throw new Error(error.message);
    }

    if (data.user) {
      // Using the RPC function we created in SQL
      await supabase.rpc("log_user_activity", {
        p_user_id: data.user.id,
        p_activity_type: "login"
      });
    }

    return data;
  } catch (error: any) {
    console.error("Error in signIn:", error.message);
    throw error;
  }
};

// Function to handle user sign-out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("Error in signOut:", error.message);
    throw error;
  }
};

// Function to handle password reset request
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      console.error("Error requesting password reset:", error.message);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in resetPassword:", error.message);
    throw error;
  }
};

// Function to handle password update
export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error.message);
      throw new Error(error.message);
    }

    if (data.user) {
      // Using the RPC function we created in SQL
      await supabase.rpc("log_user_activity", {
        p_user_id: data.user.id,
        p_activity_type: "update_password"
      });
    }

    return data;
  } catch (error: any) {
    console.error("Error in updatePassword:", error.message);
    throw error;
  }
};
