
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductData } from "./types";

export interface ProductManagementService {
  createProduct: (productData: ProductData) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<ProductData>) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<void>;
}

// Create a new product
export const createProduct = async (productData: ProductData): Promise<Product> => {
  try {
    const { data: userData } = await supabase.auth.getSession();
    const user = userData.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        ...productData,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from product creation");
    }

    // Log the product creation activity
    await supabase.rpc("log_product_activity", {
      p_user_id: user.id,
      p_activity_type: "create_product",
      p_resource_id: data.id,
      p_resource_type: "product",
      p_details: JSON.stringify({})
    });

    return data;
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (productId: string, updates: Partial<ProductData>): Promise<Product> => {
  try {
    const { data: userData } = await supabase.auth.getSession();
    const user = userData.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // First verify this is the user's product
    const { data: product } = await supabase
      .from("products")
      .select("owner_id")
      .eq("id", productId)
      .single();

    if (!product || product.owner_id !== user.id) {
      throw new Error("You can only update your own products");
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from product update");
    }

    // Log the product update activity
    await supabase.rpc("log_product_activity", {
      p_user_id: user.id,
      p_activity_type: "update_product",
      p_resource_id: productId,
      p_resource_type: "product",
      p_details: JSON.stringify({})
    });

    return data;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getSession();
    const user = userData.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // First verify this is the user's product
    const { data: product } = await supabase
      .from("products")
      .select("owner_id")
      .eq("id", productId)
      .single();

    if (!product || product.owner_id !== user.id) {
      throw new Error("You can only delete your own products");
    }

    // Log the product deletion activity before deleting the product
    await supabase.rpc("log_product_activity", {
      p_user_id: user.id,
      p_activity_type: "delete_product",
      p_resource_id: productId,
      p_resource_type: "product",
      p_details: JSON.stringify({})
    });

    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
};
