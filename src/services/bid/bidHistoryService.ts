
import { supabase } from "@/integrations/supabase/client";
import { BidHistoryItem } from "./types";
import { getBidStatus } from "./utils";

// Function to get user bid history
export const getUserBidHistory = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from("bids")
      .select(`
        id,
        amount,
        time,
        auction_id,
        auctions (
          id,
          title,
          current_bid,
          end_time,
          status
        )
      `)
      .eq("bidder_id", userId)
      .order("time", { ascending: false });
      
    if (error) {
      console.error("Error fetching bid history:", error);
      throw error;
    }
    
    // Format the data for the UI
    return data.map(item => ({
      id: item.id,
      bidAmount: item.amount,
      date: item.time,
      auctionId: item.auction_id,
      itemTitle: item.auctions?.title || "Unknown Item",
      currentBid: item.auctions?.current_bid,
      endTime: item.auctions?.end_time,
      status: getBidStatus(item.auctions?.current_bid, item.amount, item.auctions?.end_time, item.auctions?.status)
    }));
    
  } catch (error) {
    console.error("Error in getUserBidHistory:", error);
    throw error;
  }
};

// Function to get auction bid history
export const getAuctionBidHistory = async (auctionId: string): Promise<BidHistoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from("bids")
      .select(`
        id,
        bidder_name,
        amount,
        time
      `)
      .eq("auction_id", auctionId)
      .order("time", { ascending: false });
      
    if (error) {
      console.error("Error fetching auction bid history:", error);
      throw error;
    }
    
    return data as BidHistoryItem[];
    
  } catch (error) {
    console.error("Error in getAuctionBidHistory:", error);
    return [];
  }
};
