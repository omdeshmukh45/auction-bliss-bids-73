
import { supabase } from "@/integrations/supabase/client";
import { User, Session, AuthError } from "@supabase/supabase-js";

// Type definition for user profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  phone?: string;
  address?: string;
  avatar?: string;
  joinDate?: string;
}

// Type definition for authentication state
export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Type for login/register response
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  success: boolean;
  message?: string;
}

// Get current user (synchronous, from stored session)
export function getCurrentUser(): User | null {
  return supabase.auth.getUser().then(({ data }) => data.user);
}

// Get user profile by ID
export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }

    return data as UserProfile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
}

// Login user with email and password
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error);
      return {
        user: null,
        session: null,
        success: false,
        message: error.message
      };
    }

    // Log the login activity
    if (data.user) {
      await supabase.rpc("log_user_activity", {
        p_user_id: data.user.id,
        p_activity_type: "login",
        p_details: { method: "email" }
      });
    }

    return {
      user: data.user,
      session: data.session,
      success: true
    };
  } catch (error: any) {
    console.error("Error in loginUser:", error);
    return {
      user: null,
      session: null,
      success: false,
      message: error.message || "Unknown error occurred"
    };
  }
}

// Register a new user
export async function registerUser(email: string, password: string, name: string, role: string = 'user'): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      console.error("Error registering user:", error);
      return {
        user: null,
        session: null,
        success: false,
        message: error.message
      };
    }

    // Log the registration activity
    if (data.user) {
      await supabase.rpc("log_user_activity", {
        p_user_id: data.user.id,
        p_activity_type: "register",
        p_details: { method: "email" }
      });
    }

    return {
      user: data.user,
      session: data.session,
      success: true
    };
  } catch (error: any) {
    console.error("Error in registerUser:", error);
    return {
      user: null,
      session: null,
      success: false,
      message: error.message || "Unknown error occurred"
    };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    
    if (user) {
      // Log the logout activity
      await supabase.rpc("log_user_activity", {
        p_user_id: user.id,
        p_activity_type: "logout",
        p_details: {}
      });
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in logoutUser:", error);
    throw error;
  }
}

// Set up auth state change listener
export function setupAuthListener(callback: (state: AuthState) => void): () => void {
  // Initial auth state
  const initialState: AuthState = {
    user: null,
    session: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
  };

  // Initial load
  supabase.auth.getSession().then(({ data }) => {
    const newState = { ...initialState, isLoading: false };
    if (data.session) {
      newState.session = data.session;
      newState.user = data.session.user;
      newState.isAuthenticated = true;
      
      // Get user profile
      getUserProfile(data.session.user.id)
        .then(profile => {
          callback({
            ...newState,
            profile,
          });
        })
        .catch(err => {
          console.error("Error fetching profile:", err);
          callback(newState);
        });
    } else {
      callback(newState);
    }
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      // Don't update on token refresh
      if (event === "TOKEN_REFRESHED") return;
      
      // Update on sign in, sign out
      let newState: AuthState = {
        user: session?.user || null,
        session: session,
        profile: null,
        isAuthenticated: !!session,
        isLoading: false,
      };
      
      // Get user profile on sign in
      if (session?.user) {
        try {
          const profile = await getUserProfile(session.user.id);
          newState.profile = profile;
          
          // Log user activity if user just signed in
          if (event === "SIGNED_IN") {
            await supabase.rpc("log_user_activity", {
              p_user_id: session.user.id,
              p_activity_type: "session_start",
              p_details: {}
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
      
      callback(newState);
    }
  );

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  try {
    // Only allow updating specific fields
    const validUpdates: any = {};
    if (updates.name) validUpdates.name = updates.name;
    if (updates.email) validUpdates.email = updates.email;
    if (updates.phone) validUpdates.phone = updates.phone;
    if (updates.address) validUpdates.address = updates.address;
    
    const { data, error } = await supabase
      .from("profiles")
      .update(validUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    // Log the profile update
    await supabase.rpc("log_user_activity", {
      p_user_id: userId,
      p_activity_type: "update_profile",
      p_details: updates
    });

    return data as UserProfile;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
}
