
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// User profile interface for type safety
interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  created_at: string | null;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
}

// Authentication state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
  error: string | null;
  loading: boolean;
}

// Initialize state
let authState: AuthState = {
  isAuthenticated: false,
  user: null,
  profile: null,
  error: null,
  loading: true,
};

// Subscribers to auth changes
const subscribers: ((state: AuthState) => void)[] = [];

// Subscribe to auth changes
export function subscribeToAuthChanges(callback: (state: AuthState) => void) {
  subscribers.push(callback);
  // Immediately notify subscriber of current state
  callback({ ...authState });

  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
}

// Notify all subscribers of state change
function notifySubscribers() {
  for (const subscriber of subscribers) {
    subscriber({ ...authState });
  }
}

// Initialize auth state on app start
export async function initializeAuth() {
  try {
    authState = { ...authState, loading: true };
    notifySubscribers();

    // Check for existing session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      authState = {
        ...authState,
        isAuthenticated: false,
        loading: false,
        error: error.message,
      };
      notifySubscribers();
      return;
    }

    if (data?.session) {
      const user = data.session.user;
      // Get user profile
      const profile = await getUserProfile(user.id);
      
      authState = {
        isAuthenticated: true,
        user,
        profile,
        error: null,
        loading: false,
      };

      console.info("Auth state changed: User logged in");
    } else {
      authState = {
        isAuthenticated: false,
        user: null,
        profile: null,
        error: null,
        loading: false,
      };
      console.info("Auth state changed: User logged out");
    }

    notifySubscribers();

    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.id);

      if (event === "SIGNED_IN" && session) {
        const user = session.user;
        const profile = await getUserProfile(user.id);
        
        authState = {
          isAuthenticated: true,
          user,
          profile,
          error: null,
          loading: false,
        };
        console.info("Auth state changed: User logged in");
      } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        authState = {
          isAuthenticated: false,
          user: null,
          profile: null,
          error: null,
          loading: false,
        };
        console.info("Auth state changed: User logged out");
      } else if (event === "USER_UPDATED" && session) {
        const user = session.user;
        const profile = await getUserProfile(user.id);
        
        authState = {
          ...authState,
          user,
          profile,
        };
        console.info("Auth state changed: User updated");
      }

      notifySubscribers();
    });
  } catch (error: any) {
    console.error("Error initializing auth:", error);
    authState = {
      ...authState,
      loading: false,
      error: error.message,
    };
    notifySubscribers();
  }
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Create a properly typed profile object with optional fields
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      created_at: data.created_at,
      phone: data.phone || null,
      address: data.address || null,
      avatar: data.avatar || null
    };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    if (!authState.user) {
      throw new Error("User must be logged in to update profile");
    }

    const userId = authState.user.id;

    // Log the activity using the RPC function
    await supabase.rpc("insert_user_activity_log", {
      p_user_id: userId,
      p_activity_type: "profile_update",
      p_details: profileData as any,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    });

    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    // Update local state
    if (authState.profile) {
      authState = {
        ...authState,
        profile: {
          ...authState.profile,
          ...data,
        },
      };
      notifySubscribers();
    }

    return data;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return authState.isAuthenticated;
}

// Get current user
export function getCurrentUser(): User | null {
  return authState.user;
}

// Get current user profile
export function getCurrentUserProfile(): UserProfile | null {
  return authState.profile;
}

// Login with email and password
export async function loginWithEmail(email: string, password: string): Promise<void> {
  try {
    authState = { ...authState, loading: true, error: null };
    notifySubscribers();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      authState = { ...authState, loading: false, error: error.message };
      notifySubscribers();
      throw error;
    }

    // Auth state will be updated by the onAuthStateChange listener
  } catch (error: any) {
    console.error("Login error:", error);
    authState = { ...authState, loading: false, error: error.message };
    notifySubscribers();
    throw error;
  }
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, name: string): Promise<void> {
  try {
    authState = { ...authState, loading: true, error: null };
    notifySubscribers();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "user",
        },
      },
    });

    if (error) {
      authState = { ...authState, loading: false, error: error.message };
      notifySubscribers();
      throw error;
    }

    // Auth state will be updated by the onAuthStateChange listener
  } catch (error: any) {
    console.error("Signup error:", error);
    authState = { ...authState, loading: false, error: error.message };
    notifySubscribers();
    throw error;
  }
}

// Logout
export async function logout(): Promise<void> {
  try {
    authState = { ...authState, loading: true, error: null };
    notifySubscribers();

    const { error } = await supabase.auth.signOut();

    if (error) {
      authState = { ...authState, loading: false, error: error.message };
      notifySubscribers();
      throw error;
    }

    // Auth state will be updated by the onAuthStateChange listener
  } catch (error: any) {
    console.error("Logout error:", error);
    authState = { ...authState, loading: false, error: error.message };
    notifySubscribers();
    throw error;
  }
}
