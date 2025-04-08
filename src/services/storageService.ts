
import { supabase } from "@/integrations/supabase/client";

// Create storage bucket if it doesn't exist
export async function initializeStorage() {
  try {
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error("Error creating storage bucket:", error);
    } else {
      console.log("Storage bucket created or already exists:", data);
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
}
