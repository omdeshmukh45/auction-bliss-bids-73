
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { formatPriceDisplay } from "@/utils/currency";
import { Link } from "react-router-dom";
import { Clock, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const initialSavedItems = [
  {
    id: "auction1",
    title: "Vintage Rolex Submariner Watch 1968",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    currentBid: 12500,
    timeLeft: "2 days, 4 hours",
    bids: 28,
    location: "New York, USA",
  },
  {
    id: "auction2",
    title: "Original Abstract Painting by Maria Gonzalez",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    currentBid: 4200,
    timeLeft: "1 day, 8 hours",
    bids: 15,
    location: "Miami, Florida",
  },
  {
    id: "auction3",
    title: "First Edition Signed Harry Potter Collection",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    currentBid: 8750,
    timeLeft: "4 days, 12 hours",
    bids: 32,
    location: "London, UK",
  },
];

const Cart = () => {
  const { toast } = useToast();
  const [savedItems, setSavedItems] = useState(initialSavedItems);

  const handleRemoveItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your saved items.",
    });
  };

  return (
    <Layout>
      <div className="auction-container py-8">
        <h1 className="auction-heading mb-8">Saved Items</h1>

        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {savedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">
                          <Link
                            to={`/auction/${item.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h2>
                        <p className="text-muted-foreground mb-2">
                          Location: {item.location}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                          <Clock className="h-4 w-4" />
                          <span>{item.timeLeft}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Bid:</p>
                        <p className="text-lg font-bold text-auction-purple">
                          {formatPriceDisplay(item.currentBid)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.bids} bids
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Link to={`/auction/${item.id}`}>
                          <Button>Bid Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-center">No Saved Items</CardTitle>
              <CardDescription className="text-center">
                You haven't saved any auction items yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Link to="/auctions">
                <Button>Browse Auctions</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
