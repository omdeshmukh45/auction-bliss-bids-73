
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "./authService";

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  owner_id: string;
  created_at?: string;
}

export interface ProductFilter {
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: "price" | "title" | "created_at";
  sortOrder?: "asc" | "desc";
}

// Get all products with filtering
export async function getProducts(filter?: ProductFilter): Promise<Product[]> {
  try {
    let query = supabase.from("products").select("*");

    // Apply filters if provided
    if (filter) {
      if (filter.minPrice !== undefined) {
        query = query.gte("price", filter.minPrice);
      }

      if (filter.maxPrice !== undefined) {
        query = query.lte("price", filter.maxPrice);
      }

      if (filter.searchTerm) {
        query = query.ilike("title", `%${filter.searchTerm}%`);
      }

      if (filter.sortBy) {
        query = query.order(filter.sortBy, {
          ascending: filter.sortOrder === "asc",
        });
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
}

// Get products owned by the current user
export async function getUserProducts(): Promise<Product[]> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("owner_id", user.id);

    if (error) {
      console.error("Error fetching user products:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserProducts:", error);
    throw error;
  }
}

// Get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getProductById:", error);
    return null;
  }
}

// Create a new product
export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        ...product,
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
      p_details: { title: product.title, price: product.price } as any
    });

    return data;
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
}

// Update an existing product
export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "owner_id" | "created_at">>): Promise<Product> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // First verify this is the user's product
    const { data: product } = await supabase
      .from("products")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!product || product.owner_id !== user.id) {
      throw new Error("You can only update your own products");
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
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
      p_resource_id: id,
      p_resource_type: "product",
      p_details: updates as any
    });

    return data;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // First verify this is the user's product
    const { data: product } = await supabase
      .from("products")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!product || product.owner_id !== user.id) {
      throw new Error("You can only delete your own products");
    }

    // Log the product deletion activity before deleting the product
    await supabase.rpc("log_product_activity", {
      p_user_id: user.id,
      p_activity_type: "delete_product",
      p_resource_id: id,
      p_resource_type: "product",
      p_details: { product_id: id } as any
    });

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
}

// Upload product image
export async function uploadProductImage(file: File): Promise<string> {
  try {
    const user = getCurrentUser();
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
