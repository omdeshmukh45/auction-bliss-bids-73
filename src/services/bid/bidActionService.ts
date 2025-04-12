
import { supabase } from "@/integrations/supabase/client";

interface PlaceBidParams {
  auctionId: string;
  amount: number;
  userId: string;
  userName: string;
}

export async function placeBid({ auctionId, amount, userId, userName }: PlaceBidParams) {
  try {
    // Verify the auction exists and is active
    const { data: auction, error: auctionError } = await supabase
      .from("auctions")
      .select("*")
      .eq("id", auctionId)
      .single();
    
    if (auctionError) {
      return { success: false, error: "Auction not found" };
    }
    
    // Check if auction is still active
    if (new Date(auction.end_time) < new Date()) {
      return { success: false, error: "Auction has ended" };
    }
    
    // Check if bid amount is valid
    if (amount <= auction.current_bid) {
      return { 
        success: false, 
        error: `Bid must be higher than the current bid (${auction.current_bid})`
      };
    }
    
    // Place the bid
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .insert([
        { 
          auction_id: auctionId,
          bidder_id: userId,
          bidder_name: userName,
          amount: amount,
        }
      ])
      .select()
      .single();
    
    if (bidError) {
      console.error("Error placing bid:", bidError);
      return { success: false, error: "Failed to place bid" };
    }
    
    // Log auction activity
    try {
      await supabase.rpc("log_product_activity", {
        p_user_id: userId,
        p_activity_type: "place_bid",
        p_resource_id: auctionId,
        p_resource_type: "auction",
        p_details: { bid_amount: amount }
      });
    } catch (error) {
      // Just log the error, don't fail the bid
      console.error("Error logging bid activity:", error);
    }
    
    return { success: true, data: bid };
  } catch (error: any) {
    console.error("Error in placeBid:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}
