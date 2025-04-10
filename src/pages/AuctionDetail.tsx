
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { listenToAuctionChanges, getAuctionBidHistory, BidHistoryItem } from "@/services/bidService";
import AuctionImageGallery from "@/components/auction/AuctionImageGallery";
import AuctionDetailTabs from "@/components/auction/AuctionDetailTabs";
import BidHistory from "@/components/auction/BidHistory";
import BiddingForm from "@/components/auction/BiddingForm";
import { supabase } from "@/integrations/supabase/client";

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
    bidHistory: []
  },
  // Add more auctions as needed
};

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [auction, setAuction] = useState<any>(null);
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([]);

  // Fetch auction data and bidding history on mount
  useEffect(() => {
    if (!id) return;
    
    // Fetch auction from database
    const fetchAuction = async () => {
      setIsLoading(true);
      try {
        // Try to get the auction from the database
        const { data, error } = await supabase
          .from('auctions')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Error fetching auction:", error);
          // Fall back to sample data
          setAuction({...auctionData.auction1, id});
        } else if (data) {
          setAuction({
            id: data.id,
            title: data.title,
            images: data.image_urls || auctionData.auction1.images,
            description: data.description,
            currentBid: data.current_bid,
            nextMinimumBid: data.current_bid + (data.min_bid_increment || 250),
            startingBid: data.starting_bid,
            timeLeft: getRemainingTime(data.end_time),
            bids: data.bids_count || 0,
            views: data.watch_count || 0,
            location: data.location,
            seller: {
              name: data.seller_name || "Sample Seller",
              rating: data.seller_rating || 4.5,
              since: data.seller_joined_date ? new Date(data.seller_joined_date).getFullYear().toString() : "2020",
              items: data.seller_total_sales || 50,
            },
            category: data.category,
            condition: data.condition,
            authenticity: data.authenticity,
            shippingOptions: ["Standard Shipping"],
            paymentMethods: ["Credit Card", "Bank Transfer"]
          });
        }
        
        // Get bid history
        const bids = await getAuctionBidHistory(id);
        setBidHistory(bids);
        
        // Set up listener for auction updates (bids, etc.)
        const unsubscribeAuction = listenToAuctionChanges(id, (updatedAuction) => {
          setAuction(current => ({
            ...current,
            ...updatedAuction
          }));
          
          // Refetch bid history when auction updates
          getAuctionBidHistory(id).then(newBids => {
            setBidHistory(newBids);
          });
        });
        
        return () => {
          unsubscribeAuction();
        };
      } catch (error) {
        console.error("Error fetching auction:", error);
        // Fall back to sample data
        setAuction({...auctionData.auction1, id});
        setBidHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuction();
  }, [id]);

  // Helper to calculate time remaining
  const getRemainingTime = (endTimeStr: string) => {
    try {
      const endTime = new Date(endTimeStr);
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) return "Auction ended";
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      return `${days} days, ${hours} hours`;
    } catch (e) {
      return "Time remaining unknown";
    }
  };

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
              auctionId={auction.id}
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
