
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFilter } from "./types";

export interface ProductListService {
  getProducts: (filter?: ProductFilter) => Promise<Product[]>;
  getUserProducts: () => Promise<Product[]>;
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
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("owner_id", user.id);

    if (error) {
      console.error("Error fetching user products:", error);
      throw error;
    }

    return products || [];
  } catch (error) {
    console.error("Error in getUserProducts:", error);
    throw error;
  }
}
