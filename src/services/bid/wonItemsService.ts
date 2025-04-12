
import { supabase } from "@/integrations/supabase/client";

// Function to get items the user has won
export const getUserWonItems = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // Get auctions that have ended where the user is the highest bidder
    const { data, error } = await supabase
      .from("auctions")
      .select(`
        id,
        title,
        current_bid,
        end_time,
        bids!inner (
          id,
          bidder_id,
          amount,
          time
        )
      `)
      .eq("bids.bidder_id", userId)
      .eq("status", "ended")
      .order("end_time", { ascending: false });
      
    if (error) {
      console.error("Error fetching won items:", error);
      throw error;
    }
    
    // Filter to ensure we only get items where user's bid is the highest
    const wonItems = data.filter(auction => {
      const highestBid = Math.max(...auction.bids.map(bid => bid.amount));
      const userHighestBid = Math.max(...auction.bids.filter(bid => bid.bidder_id === userId).map(bid => bid.amount));
      return highestBid === userHighestBid && highestBid === auction.current_bid;
    });
    
    // Format the data for the UI
    return wonItems.map(item => {
      const userBid = item.bids.find(bid => bid.bidder_id === userId);
      return {
        id: userBid?.id,
        auctionId: item.id,
        itemTitle: item.title,
        bidAmount: userBid?.amount || item.current_bid,
        date: item.end_time,
        status: "won"
      };
    });
    
  } catch (error) {
    console.error("Error in getUserWonItems:", error);
    throw error;
  }
};
