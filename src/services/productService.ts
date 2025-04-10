import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  owner_id: string;
  created_at: string;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw error;
  }
}

// Get products by owner (the missing function)
export async function getUserProducts(): Promise<Product[]> {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    // Then call the getProductsByOwner function
    return await getProductsByOwner(user.id);
  } catch (error) {
    console.error("Error in getUserProducts:", error);
    throw error;
  }
}

// Get products by owner
export async function getProductsByOwner(ownerId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching owner products:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getProductsByOwner:", error);
    throw error;
  }
}

// Get a product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      console.error("Error fetching product:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw error;
  }
}

// Create a new product
export async function createProduct(product: {
  owner_id?: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
}): Promise<Product> {
  try {
    // Get the current user if owner_id is not provided
    if (!product.owner_id) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      product.owner_id = user.id;
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating product:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
}

// Update a product
export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "created_at" | "owner_id">>): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating product:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting product:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
}

// Upload a product image to storage
export async function uploadProductImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);
    
    if (error) {
      console.error("Error uploading image:", error);
      throw new Error(error.message);
    }
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error in uploadProductImage:", error);
    throw error;
  }
}
