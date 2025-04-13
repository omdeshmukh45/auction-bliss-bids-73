import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createProduct } from "@/services/productService";
import { Product } from "@/services/productService";
import { ImageIcon, Plus } from "lucide-react";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (product: Product) => void;
}

const AddProductDialog = ({ open, onOpenChange, onSuccess }: AddProductDialogProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const uploadImage = async (): Promise<string | undefined> => {
    if (!imageFile) return undefined;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "auctionbliss");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dyg1mffxi/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      return data.secure_url;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Image upload failed",
        description: error.message || "There was a problem uploading your image.",
        variant: "destructive",
      });
      return undefined;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageFile(null);
    setImageUrl(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price) {
      setFormError("Product name and price are required");
      return;
    }
    
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setFormError("Price must be a valid positive number");
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Prepare form data
      const productData = {
        title: name,
        description,
        price: Number(price),
        imageUrl: imageFile ? await uploadImage() : undefined
      };
      
      // Create the product
      const result = await createProduct(productData);
      
      if (result.success && result.data) {
        toast({
          title: "Product created",
          description: "Your product has been added successfully."
        });
        
        // Reset form and close dialog
        resetForm();
        onOpenChange(false);
        
        // Notify parent component
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setFormError(result.error || "Failed to create product");
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      setFormError(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product to sell on AuctionBliss
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Product Image</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Label htmlFor="image" className="cursor-pointer bg-muted rounded-md p-2 flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="max-h-32 max-w-full" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                </div>
              )}
            </Label>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                Loading ...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
