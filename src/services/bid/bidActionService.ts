
import { supabase } from "@/integrations/supabase/client";
import { BidHistoryItem } from "./types";

// Place a bid on an auction
export const placeBid = async (
  auctionId: string,
  amount: number
): Promise<{ success: boolean; bid?: BidHistoryItem; error?: string }> => {
  try {
    const { data: userData } = await supabase.auth.getSession();
    const user = userData.session?.user;
    
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Get user's profile for bidder name
    const { data: profileData } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    const bidderName = profileData?.name || "Anonymous";

    // First check if the bid is valid (higher than current bid)
    const { data: auctionData, error: auctionError } = await supabase
      .from("auctions")
      .select("current_bid, min_bid_increment")
      .eq("id", auctionId)
      .single();

    if (auctionError) {
      console.error("Error fetching auction:", auctionError);
      return { success: false, error: "Auction not found" };
    }

    const currentBid = auctionData.current_bid;
    const minIncrement = auctionData.min_bid_increment || 1;

    if (amount <= currentBid) {
      return {
        success: false,
        error: `Bid must be higher than current bid: ${currentBid}`,
      };
    }

    if (amount < currentBid + minIncrement) {
      return {
        success: false,
        error: `Bid must be at least ${minIncrement} higher than current bid`,
      };
    }

    // Insert the bid
    const { data: bidData, error: bidError } = await supabase
      .from("bids")
      .insert({
        auction_id: auctionId,
        bidder_id: user.id,
        bidder_name: bidderName,
        amount: amount,
      })
      .select()
      .single();

    if (bidError) {
      console.error("Error placing bid:", bidError);
      return { success: false, error: bidError.message };
    }

    // Log the bid activity
    await supabase.rpc("log_activity", {
      p_user_id: user.id,
      p_activity_type: "place_bid",
      p_resource_id: auctionId,
      p_resource_type: "auction",
      p_details: JSON.stringify({ bid_amount: amount })
    });

    return {
      success: true,
      bid: {
        id: bidData.id,
        bidder_name: bidderName,
        amount: amount,
        time: bidData.time,
      },
    };
  } catch (error: any) {
    console.error("Error in placeBid:", error);
    return { success: false, error: error.message };
  }
};
