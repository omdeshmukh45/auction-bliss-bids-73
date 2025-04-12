
import { supabase } from "@/integrations/supabase/client";

export interface ProductImageService {
  uploadProductImage: (file: File) => Promise<string>;
}

// Upload product image
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
