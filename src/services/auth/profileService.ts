
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Profile } from "./types";

// Get the current user's profile
export async function getProfile(): Promise<UserProfile | null> {
  try {
    const { data: userData } = await supabase.auth.getSession();
    const user = userData.session?.user;
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getProfile:", error);
    return null;
  }
}

// Alias for getProfile to maintain backward compatibility
export const getUserProfile = getProfile;

// Update a user's profile
export async function updateProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return null;
  }
}

// Alias for updateProfile to maintain backward compatibility
export const updateUserProfile = updateProfile;
