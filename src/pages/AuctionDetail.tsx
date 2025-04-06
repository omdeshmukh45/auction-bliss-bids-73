
import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatPriceDisplay } from "@/utils/currency";
import {
  Clock,
  Eye,
  Heart,
  Share2,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Package,
  Truck,
  Banknote,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample auction data (in a real app, this would come from an API)
const auctionData = {
  auction1: {
    id: "auction1",
    title: "Vintage Rolex Submariner Watch 1968",
    images: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    ],
    description:
      "This is a beautiful vintage Rolex Submariner from 1968. The watch is in excellent condition considering its age. The movement has been recently serviced by a certified Rolex technician and is working perfectly. The case shows normal signs of wear for a watch of this age, but has been well maintained. The dial is original and in excellent condition with no fading or damage. This is a rare opportunity to own a piece of horological history.",
    currentBid: 12500,
    nextMinimumBid: 12750,
    startingBid: 10000,
    timeLeft: "2 days, 4 hours",
    bids: 28,
    views: 342,
    location: "New York, USA",
    seller: {
      name: "LuxuryVintageWatches",
      rating: 4.9,
      since: "2018",
      items: 87,
    },
    category: "Jewelry & Watches",
    condition: "Excellent",
    shippingOptions: ["Insured Shipping", "Local Pickup"],
    paymentMethods: ["Credit Card", "Bank Transfer", "Escrow"],
    bidHistory: [
      { bidder: "Watch_Collector_42", amount: 12500, time: "2 days ago" },
      { bidder: "VintageHunter", amount: 12250, time: "2 days ago" },
      { bidder: "HorologicalExpert", amount: 12000, time: "3 days ago" },
      { bidder: "TimePiece88", amount: 11750, time: "3 days ago" },
      { bidder: "LuxuryBuyer", amount: 11500, time: "4 days ago" },
      { bidder: "WatchEnthusiast", amount: 11250, time: "4 days ago" },
      { bidder: "CollectorItems", amount: 11000, time: "5 days ago" },
      { bidder: "RareFinds", amount: 10500, time: "5 days ago" },
      { bidder: "VintageSeeker", amount: 10250, time: "6 days ago" },
      { bidder: "TimelessTreasures", amount: 10000, time: "6 days ago" },
    ],
  },
  // Add more auctions as needed
};

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [isWatching, setIsWatching] = useState(false);

  // In a real app, we would fetch the auction data based on the ID
  // For demo purposes, we're using the sample data
  const auction = auctionData.auction1; // In real app: auctionData[id]

  const handlePlaceBid = () => {
    if (!bidAmount) {
      toast({
        title: "Bid amount required",
        description: "Please enter a bid amount.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < auction.nextMinimumBid) {
      toast({
        title: "Invalid bid amount",
        description: `Your bid must be at least ${formatPriceDisplay(auction.nextMinimumBid)}.`,
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would send this to an API
    toast({
      title: "Bid placed successfully!",
      description: `You've placed a bid of ${formatPriceDisplay(amount)} on ${auction.title}.`,
      variant: "default",
    });

    // Reset bid amount
    setBidAmount("");
  };

  const toggleWatchlist = () => {
    setIsWatching(!isWatching);
    toast({
      title: isWatching ? "Removed from saved items" : "Added to saved items",
      description: isWatching
        ? "Item removed from your saved items"
        : "You'll receive notifications about this auction",
      variant: "default",
    });
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog or copy link to clipboard
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        toast({
          title: "Link copied!",
          description: "Auction link copied to clipboard.",
          variant: "default",
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the link. Please try again.",
          variant: "destructive",
        });
      }
    );
  };

  if (!auction) {
    return (
      <Layout>
        <div className="auction-container py-12">
          <div className="text-center">
            <h1 className="auction-heading mb-4">Auction Not Found</h1>
            <p className="text-muted-foreground">
              The auction you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="auction-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="relative rounded-lg overflow-hidden bg-muted h-[400px] md:h-[500px]">
                <img
                  src={auction.images[activeImage]}
                  alt={auction.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
                {auction.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative min-w-[80px] h-20 rounded-md overflow-hidden border-2 ${
                      activeImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Tabs */}
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
                      {auction.shippingOptions.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Banknote className="h-5 w-5" /> Payment Methods
                    </h3>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {auction.paymentMethods.map((method, index) => (
                        <li key={index}>{method}</li>
                      ))}
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
              </TabsContent>
            </Tabs>

            {/* Bid History */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Bid History ({auction.bids} bids)</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bidder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auction.bidHistory.map((bid, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{bid.bidder}</TableCell>
                        <TableCell>{formatPriceDisplay(bid.amount)}</TableCell>
                        <TableCell>{bid.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Right Column - Auction Info & Bidding */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border rounded-lg p-6 mb-6">
                <h1 className="text-xl font-bold mb-2">{auction.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {auction.category}
                  </Badge>
                  <Badge variant="outline" className="bg-muted">
                    {auction.condition}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Bid:</p>
                    <p className="text-3xl font-bold text-auction-purple">
                      {formatPriceDisplay(auction.currentBid)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <span className="font-medium">Time left:</span>{" "}
                      {auction.timeLeft}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Starting Bid: {formatPriceDisplay(auction.startingBid)}</span>
                    <span>{auction.bids} bids</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <span className="font-medium">Location:</span>{" "}
                      {auction.location}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="bid-amount" className="text-sm font-medium">
                      Your Bid (USD)
                    </label>
                    <div className="flex mt-1.5">
                      <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                        $
                      </span>
                      <Input
                        id="bid-amount"
                        type="number"
                        placeholder={auction.nextMinimumBid.toString()}
                        min={auction.nextMinimumBid}
                        step="50"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter {formatPriceDisplay(auction.nextMinimumBid)} or more
                    </p>
                  </div>
                  <Button className="w-full" size="lg" onClick={handlePlaceBid}>
                    Place Bid
                  </Button>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={toggleWatchlist}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          isWatching ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      {isWatching ? "Saved" : "Save Item"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Buyer Protection</p>
                    <p className="text-muted-foreground">
                      AuctionBliss guarantees that this item is as described. See our
                      terms and conditions for details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionDetail;
