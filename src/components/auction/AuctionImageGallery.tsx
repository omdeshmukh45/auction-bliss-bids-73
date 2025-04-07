
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Watch, Laptop, GemIcon, Car, Box } from "lucide-react";

interface AuctionImageGalleryProps {
  images?: string[];
  title: string;
  category?: string;
}

const AuctionImageGallery = ({ images, title, category }: AuctionImageGalleryProps) => {
  const hasImages = images && images.length > 0;

  // Get placeholder icon based on category
  const getPlaceholderIcon = () => {
    if (!category) return <Box className="h-24 w-24 text-muted-foreground" />;

    const categoryLower = category.toLowerCase();
    if (categoryLower.includes("watch")) {
      return <Watch className="h-24 w-24 text-muted-foreground" />;
    } else if (categoryLower.includes("laptop") || categoryLower.includes("electronics")) {
      return <Laptop className="h-24 w-24 text-muted-foreground" />;
    } else if (categoryLower.includes("jewelry")) {
      return <GemIcon className="h-24 w-24 text-muted-foreground" />;
    } else if (categoryLower.includes("vehicle") || categoryLower.includes("car")) {
      return <Car className="h-24 w-24 text-muted-foreground" />;
    } else {
      return <Box className="h-24 w-24 text-muted-foreground" />;
    }
  };

  return (
    <div className="mb-4">
      {hasImages ? (
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image: string, i: number) => (
              <CarouselItem key={i}>
                <div className="relative rounded-lg overflow-hidden bg-muted h-[400px] md:h-[500px]">
                  <img
                    src={image}
                    alt={`${title} - Image ${i+1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-muted h-[400px] md:h-[500px] flex flex-col items-center justify-center">
          {getPlaceholderIcon()}
          <p className="mt-4 text-muted-foreground">No images available</p>
        </div>
      )}
      {hasImages && (
        <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
          {images.map((image: string, index: number) => (
            <div
              key={index}
              className="relative min-w-[80px] h-20 rounded-md overflow-hidden border-2 border-muted"
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionImageGallery;
