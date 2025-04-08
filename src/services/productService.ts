
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
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

// Get products owned by the current user
export async function getUserProducts(): Promise<Product[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching user products:", error);
    throw new Error(error.message);
  }
  
  return data || [];
}

// Get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
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
}

// Create a new product
export async function createProduct(product: Omit<Product, 'id' | 'owner_id' | 'created_at'>): Promise<Product> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      owner_id: user.id
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// Update an existing product
export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'owner_id' | 'created_at'>>): Promise<Product> {
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
}

// Delete a product
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting product:", error);
    throw new Error(error.message);
  }
}

// Upload a product image
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `product-images/${fileName}`;
  
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
}
