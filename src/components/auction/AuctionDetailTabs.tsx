
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  MapPin, 
  Calendar, 
  Eye, 
  Truck, 
  Banknote, 
  User 
} from "lucide-react";

interface AuctionDetailTabsProps {
  auction: {
    description: string;
    condition?: string;
    location?: string;
    category?: string;
    views?: number;
    shippingOptions?: string[];
    paymentMethods?: string[];
    seller?: {
      name: string;
      rating: number;
      since: string;
      items: number;
    };
  };
}

const AuctionDetailTabs = ({ auction }: AuctionDetailTabsProps) => {
  return (
    <Tabs defaultValue="description" className="mt-8">
      <TabsList className="mb-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="details">Item Details</TabsTrigger>
        <TabsTrigger value="shipping">Shipping & Payment</TabsTrigger>
        <TabsTrigger value="seller">Seller Info</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="p-4 border rounded-md">
        <h3 className="text-lg font-semibold mb-3">Product Description</h3>
        <p className="text-muted-foreground whitespace-pre-line">
          {auction.description}
        </p>
      </TabsContent>

      <TabsContent value="details" className="p-4 border rounded-md">
        <h3 className="text-lg font-semibold mb-3">Item Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2 items-center">
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Condition</p>
              <p className="font-medium">{auction.condition}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Item Location</p>
              <p className="font-medium">{auction.location}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{auction.category}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-primary/10 p-2 rounded-full">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Item Views</p>
              <p className="font-medium">{auction.views}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="p-4 border rounded-md">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5" /> Shipping Options
            </h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              {auction.shippingOptions?.map((option: string, index: number) => (
                <li key={index}>{option}</li>
              )) || <li>Information not available</li>}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Banknote className="h-5 w-5" /> Payment Methods
            </h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              {auction.paymentMethods?.map((method: string, index: number) => (
                <li key={index}>{method}</li>
              )) || <li>Information not available</li>}
            </ul>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">
              <strong>Note:</strong> The winning bidder is responsible for
              shipping costs unless otherwise stated. Please contact the seller
              after winning the auction to arrange payment and shipping details.
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="seller" className="p-4 border rounded-md">
        {auction.seller ? (
          <>
            <div className="flex items-start gap-4">
              <div className="bg-muted p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{auction.seller.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(auction.seller.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {auction.seller.rating} rating
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Member since {auction.seller.since}
                </p>
                <p className="text-sm text-muted-foreground">
                  {auction.seller.items} items sold
                </p>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <Button variant="outline" size="sm">
                Contact Seller
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Please only contact the seller for specific questions about this
                item. For general questions, contact AuctionBliss support.
              </p>
            </div>
          </>
        ) : (
          <p>Seller information not available</p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AuctionDetailTabs;
