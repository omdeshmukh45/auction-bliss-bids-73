
import { uploadProductImage } from "@/services/storageService";

export interface ProductImageService {
  uploadProductImage: (file: File) => Promise<string>;
}

// Re-export the uploadProductImage function from storageService
export { uploadProductImage };
