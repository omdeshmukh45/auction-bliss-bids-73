
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
  id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  owner_id: string;
  created_at?: string;
}

// Add the missing ProductFormData interface
export interface ProductFormData {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
}
