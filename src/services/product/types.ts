
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  owner_id: string;
  created_at?: string;
}

export interface ProductData {
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  owner_id: string;
}

export interface ProductFilter {
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: "price" | "title" | "created_at";
  sortOrder?: "asc" | "desc";
}

// No interface re-exports here, they're defined in their respective service files
