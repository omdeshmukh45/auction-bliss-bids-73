
import { supabase } from "@/integrations/supabase/client";
import { AuthError, SignUpResponse, SignInResponse } from "./types";

export async function signUp(
  email: string,
  password: string,
  metadata: { name: string; role?: string }
): Promise<SignUpResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Log signup activity
    if (data.user) {
      await supabase.rpc("log_product_activity", {
        p_user_id: data.user.id,
        p_activity_type: "user_signup",
        p_resource_id: data.user.id,
        p_resource_type: "user",
        p_details: { email: email }
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Log signin activity
    if (data.user) {
      await supabase.rpc("log_product_activity", {
        p_user_id: data.user.id,
        p_activity_type: "user_signin",
        p_resource_id: data.user.id,
        p_resource_type: "user",
        p_details: { email: email }
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function resetPassword(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function updatePassword(
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Update password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
