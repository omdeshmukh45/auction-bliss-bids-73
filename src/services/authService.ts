import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
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

    if (data.user) {
      // Create a user profile in the profiles table
      await createUserProfile(data.user.id, {
        email: data.user.email || email,
      });
    }

    return data;
  } catch (error: any) {
    console.error("Error in signUp:", error.message);
    throw error;
  }
};

// Function to create user profile
const createUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    const { error } = await supabase.from("profiles").insert([
      {
        id: userId,
        ...profileData,
      },
    ]);

    if (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in createUserProfile:", error);
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
      await supabase.rpc("log_user_activity", {
        p_user_id: data.user.id,
        p_activity_type: "login" as string,
        p_resource_id: null,
        p_resource_type: "auth" as string,
        p_details: { method: "email" }
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
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      console.error("Error requesting password reset:", error.message);
      throw new Error(error.message);
    }

    return data;
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
      await supabase.rpc("log_user_activity", {
        p_user_id: data.user.id,
        p_activity_type: "update_password" as string,
        p_resource_id: null,
        p_resource_type: "auth" as string,
        p_details: { method: "reset" }
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
        const { data, error } = await supabase.auth.admin.getUserById(userId);
        if (error) throw error;
        return data.user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};
