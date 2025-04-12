
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./types";

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    return null;
  }
}

export async function updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return null;
  }
}
