
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

// Upload product image to storage
export async function uploadProductImage(file: File): Promise<string> {
  try {
    const { data: userData } = await supabase.auth.getSession();
    const user = userData.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError, data } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadProductImage:", error);
    throw error;
  }
}
