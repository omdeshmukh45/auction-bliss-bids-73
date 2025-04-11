
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  role?: string;
  // Add other profile fields as necessary
}

// Function to set up authentication state listener
export const setupAuthListener = (
  callback: (authState: {
    user: User | null;
    session: any | null;
    profile: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }) => void
) => {
  let isLoading = true;

  supabase.auth.getSession().then(({ data: { session } }) => {
    const user = session?.user;

    if (user) {
      getUserProfile(user.id)
        .then((profile) => {
          isLoading = false;
          callback({
            user,
            session,
            profile: profile || null,
            isAuthenticated: true,
            isLoading,
          });
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          isLoading = false;
          callback({
            user,
            session,
            profile: null,
            isAuthenticated: true,
            isLoading,
          });
        });
    } else {
      isLoading = false;
      callback({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
        isLoading,
      });
    }
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      const user = session?.user;

      if (user) {
        try {
          const profile = await getUserProfile(user.id);
          callback({
            user,
            session,
            profile: profile || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          callback({
            user,
            session,
            profile: null,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        callback({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
};

// Function to get user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};

// Function to update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    return data as UserProfile;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};

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

// Function to get user by ID (Admin only)
export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        // Note: This requires admin-level access which should be used cautiously
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Not authenticated");
        
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
            
        if (error) throw error;
        return userData.user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};

// Add missing exported functions
export const loginUser = async (email: string, password: string) => {
  try {
    const result = await signIn(email, password);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const registerUser = async (email: string, password: string, name: string, role: string) => {
  try {
    const result = await signUp(email, password);
    
    if (result.user?.id) {
      // Update the profile with additional information
      await updateUserProfile(result.user.id, { 
        name, 
        role,
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
    
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut();
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Export signIn and signOut with alias names for backward compatibility
export { signIn as signInWithEmail };
export { signOut as signOutUser };
