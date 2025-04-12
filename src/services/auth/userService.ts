
import { supabase } from "@/integrations/supabase/client";
import { updateProfile } from "./profileService";

// Change user name
export async function changeName(newName: string) {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    return await updateProfile(user.id, { name: newName });
  } catch (error) {
    console.error("Error changing name:", error);
    throw error;
  }
}
