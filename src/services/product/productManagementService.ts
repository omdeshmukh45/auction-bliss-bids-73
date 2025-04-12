
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFormData } from "./types";

// Create a new product
export async function createProduct(productData: ProductFormData): Promise<{ 
  success: boolean;
  data?: Product;
  error?: string; 
}> {
  try {
    const { data: userData } = await supabase.auth.getSession();
    
    if (!userData.session) {
      return { success: false, error: "User not authenticated" };
    }
    
    const userId = userData.session.user.id;
    
    const { data, error } = await supabase
      .from("products")
      .insert({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        image_url: productData.imageUrl,
        owner_id: userId,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating product:", error);
      return { success: false, error: "Failed to create product" };
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in createProduct:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

// Update a product
export async function updateProduct(
  productId: string, 
  updates: Partial<ProductFormData>
): Promise<{ 
  success: boolean;
  data?: Product;
  error?: string; 
}> {
  try {
    const { data: userData } = await supabase.auth.getSession();
    
    if (!userData.session) {
      return { success: false, error: "User not authenticated" };
    }
    
    const userId = userData.session.user.id;
    
    // First check if the product belongs to the user
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("owner_id", userId)
      .maybeSingle();
    
    if (fetchError || !product) {
      return { 
        success: false, 
        error: "Product not found or you don't have permission to update it" 
      };
    }
    
    // Perform the update
    const { data, error } = await supabase
      .from("products")
      .update({
        title: updates.title !== undefined ? updates.title : product.title,
        description: updates.description !== undefined ? updates.description : product.description,
        price: updates.price !== undefined ? updates.price : product.price,
        image_url: updates.imageUrl !== undefined ? updates.imageUrl : product.image_url,
      })
      .eq("id", productId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating product:", error);
      return { success: false, error: "Failed to update product" };
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in updateProduct:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

// Delete a product
export async function deleteProduct(productId: string): Promise<{ 
  success: boolean; 
  error?: string; 
}> {
  try {
    const { data: userData } = await supabase.auth.getSession();
    
    if (!userData.session) {
      return { success: false, error: "User not authenticated" };
    }
    
    const userId = userData.session.user.id;
    
    // First check if the product belongs to the user
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("owner_id", userId)
      .maybeSingle();
    
    if (fetchError || !product) {
      return { 
        success: false, 
        error: "Product not found or you don't have permission to delete it" 
      };
    }
    
    // Perform the delete
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    
    if (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: "Failed to delete product" };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteProduct:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}
