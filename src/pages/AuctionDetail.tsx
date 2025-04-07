
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { listenToAuctionChanges } from "@/services/bidService";
import AuctionImageGallery from "@/components/auction/AuctionImageGallery";
import AuctionDetailTabs from "@/components/auction/AuctionDetailTabs";
import BidHistory from "@/components/auction/BidHistory";
import BiddingForm from "@/components/auction/BiddingForm";

// Sample auction data (in a real app, this would come from MySQL API)
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
  const [isLoading, setIsLoading] = useState(true);
  const [auction, setAuction] = useState<any>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);

  // Fetch auction data and bidding history on mount
  useEffect(() => {
    if (!id) return;
    
    // Fetch auction from API
    const fetchAuction = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await fetch(`/api/auctions/${id}`);
        // const data = await response.json();
        
        // For now, use sample data
        console.log("Fetching auction data for:", id);
        setAuction(auctionData.auction1);
        setBidHistory(auctionData.auction1.bidHistory);
        
        // Set up listener for auction updates (bids, etc.)
        const unsubscribeAuction = listenToAuctionChanges(id, (updatedAuction) => {
          setAuction(current => ({
            ...current,
            ...updatedAuction
          }));
        });
        
        return () => {
          unsubscribeAuction();
        };
      } catch (error) {
        console.error("Error fetching auction:", error);
        // Fall back to sample data
        setAuction(auctionData.auction1);
        setBidHistory(auctionData.auction1.bidHistory);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuction();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="auction-container py-12 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-xl">Loading auction details...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            <AuctionImageGallery 
              images={auction.images} 
              title={auction.title} 
              category={auction.category} 
            />

            <AuctionDetailTabs auction={auction} />

            <BidHistory 
              bidHistory={bidHistory} 
              totalBids={auction.bids || bidHistory.length} 
            />
          </div>

          {/* Right Column - Auction Info & Bidding */}
          <div className="lg:col-span-1">
            <BiddingForm auction={auction} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionDetail;
