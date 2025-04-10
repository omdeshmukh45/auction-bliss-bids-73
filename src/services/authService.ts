
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  joined?: string;
  phone?: string;
  address?: string;
  joinDate?: string; // For backward compatibility
}

// Sign up a new user
export async function registerUser(name: string, email: string, password: string, role: 'farmer' | 'vendor' = 'vendor'): Promise<{ success: boolean; message?: string; user?: User }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      console.error("Sign up error:", error.message);
      return { success: false, message: error.message };
    }

    // Create an audit log entry for registration
    if (data.user) {
      await logUserActivity(data.user.id, 'registration', {
        email: email,
        role: role
      });
    }

    return { success: true, user: data.user || undefined };
  } catch (error: any) {
    console.error("Unexpected sign up error:", error.message);
    return { success: false, message: "An unexpected error occurred during sign up" };
  }
}

// Log in an existing user
export async function loginUser(email: string, password: string): Promise<{ success: boolean; message?: string; session?: Session }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Login error:", error.message);
      return { success: false, message: error.message };
    }

    // Create an audit log entry for login
    if (data.user) {
      await logUserActivity(data.user.id, 'login');
    }

    return { success: true, session: data.session };
  } catch (error: any) {
    console.error("Unexpected login error:", error.message);
    return { success: false, message: "An unexpected error occurred during login" };
  }
}

// Log out the current user
export async function logoutUser(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await logUserActivity(user.id, 'logout');
  }
  await supabase.auth.signOut();
}

// Get the current user profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (!profile) return null;
  
  // Convert to UserProfile format
  return {
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    role: profile.role,
    phone: profile.phone,
    address: profile.address,
    avatar: profile.avatar,
    joined: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    joinDate: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };
}

// Update user profile with audit logging
export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("No authenticated user found");
  }
  
  // Get the current profile for comparison
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  // Don't update id, email, or joinDate fields
  const { id, email, joinDate, joined, ...updateData } = profileData;
  
  try {
    // Start transaction by updating profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating profile:", error);
      throw new Error(error.message);
    }
    
    // Log the profile changes
    const changes: Record<string, { old: any, new: any }> = {};
    for (const key in updateData) {
      if (updateData[key] !== currentProfile[key]) {
        changes[key] = {
          old: currentProfile[key],
          new: updateData[key]
        };
      }
    }
    
    // Only log if there were actual changes
    if (Object.keys(changes).length > 0) {
      await logUserActivity(user.id, 'profile_update', { changes });
    }
    
    // Return the updated profile in the expected format
    return await getCurrentUserProfile() as UserProfile;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
}

// Log user activity for audit purposes
export async function logUserActivity(
  userId: string,
  activityType: 'registration' | 'login' | 'logout' | 'profile_update' | 'other',
  details?: any
): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        activity_type: activityType,
        details: details || {},
        ip_address: 'client-side', // IP collection should be done server-side for security
        user_agent: navigator.userAgent
      });
    
    if (error) {
      console.error("Error logging user activity:", error);
      // Don't throw here, as this is non-critical logging
    }
  } catch (error) {
    console.error("Error in logUserActivity:", error);
    // Don't throw here, as this is non-critical logging
  }
}

// Subscribe to auth state changes
export function subscribeToAuthChanges(callback: (isLoggedIn: boolean) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    const isLoggedIn = !!session;
    callback(isLoggedIn);
  });
  
  return () => {
    subscription.unsubscribe();
  };
}

// Check if user is authenticated
export async function isUserAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}
