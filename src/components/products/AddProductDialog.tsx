
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { createProduct, Product } from "@/services/product";
import { useAuth } from "@/context/AuthContext";
import { uploadProductImage } from "@/services/storageService";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
}

const AddProductDialog = ({ open, onClose, onProductAdded }: AddProductDialogProps) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title || !price) {
      toast({
        title: "Missing information",
        description: "Please provide a title and price for your product.",
        variant: "destructive",
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to add a product.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      if (image) {
        imageUrl = await uploadProductImage(image);
      }
      
      const priceValue = parseFloat(price);
      
      if (isNaN(priceValue)) {
        throw new Error("Invalid price format");
      }
      
      const newProduct = await createProduct({
        title,
        price: priceValue,
        description,
        image_url: imageUrl,
        owner_id: profile.id
      });
      
      toast({
        title: "Product added",
        description: "Your product has been added successfully.",
      });
      
      onProductAdded(newProduct);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="object-cover w-full h-32 rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
