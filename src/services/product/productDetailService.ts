
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./types";

export interface ProductDetailService {
  getProductById: (id: string) => Promise<Product | null>;
}

// Get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

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
