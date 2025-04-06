
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Heart, Watch, Laptop, Car, Box, Jewelry } from "lucide-react";
import { formatPriceDisplay } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";

interface AuctionCardProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  timeLeft: string;
  bids: number;
  isHot?: boolean;
  isNew?: boolean;
  location?: string;
  category?: string;
}

const AuctionCard = ({
  id,
  title,
  image,
  currentBid,
  timeLeft,
  bids,
  isHot = false,
  isNew = false,
  location,
  category,
}: AuctionCardProps) => {
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would add to a persistent cart/saved items
    toast({
      title: "Item saved",
      description: `${title} has been added to your saved items.`,
    });
  };

  // Get placeholder image based on category
  const getPlaceholderIcon = () => {
    if (!category) return <Box className="h-12 w-12 text-muted-foreground" />;

    const categoryLower = category.toLowerCase();
    if (categoryLower.includes("watch")) {
      return <Watch className="h-12 w-12 text-muted-foreground" />;
    } else if (categoryLower.includes("laptop") || categoryLower.includes("electronics")) {
      return <Laptop className="h-12 w-12 text-muted-foreground" />;
    } else if (categoryLower.includes("jewelry")) {
      return <Jewelry className="h-12 w-12 text-muted-foreground" />;
    } else if (categoryLower.includes("vehicle") || categoryLower.includes("car")) {
      return <Car className="h-12 w-12 text-muted-foreground" />;
    } else {
      return <Box className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <div className="auction-card group">
      <div className="relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-48 w-full bg-muted flex items-center justify-center">
            {getPlaceholderIcon()}
            <span className="sr-only">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 rounded-full"
            onClick={handleAddToCart}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to saved items</span>
          </Button>
        </div>
        {isHot && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            Hot
          </Badge>
        )}
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">
            New
          </Badge>
        )}
      </div>
      <div className="p-4">
        <Link to={`/auction/${id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Current Bid:</p>
            <p className="text-lg font-bold text-auction-purple">
              {formatPriceDisplay(currentBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{bids} bids</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
          <Link to={`/auction/${id}`}>
            <Button size="sm" variant="outline">
              Bid Now
            </Button>
          </Link>
        </div>
        {location && (
          <div className="mt-2 text-sm text-muted-foreground">
            Location: {location}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionCard;
