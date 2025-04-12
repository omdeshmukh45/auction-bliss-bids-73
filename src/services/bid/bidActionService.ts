
import { supabase } from "@/integrations/supabase/client";

// Function to place a bid on an auction
export const placeBid = async (auctionId: string, amount: number): Promise<any> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Get the auction details first to validate bid
    const { data: auctionData, error: auctionError } = await supabase
      .from("auctions")
      .select("current_bid, min_bid_increment, status, end_time")
      .eq("id", auctionId)
      .single();
      
    if (auctionError) {
      console.error("Error fetching auction:", auctionError);
      throw auctionError;
    }
    
    // Validate the bid
    if (auctionData.status !== "live") {
      throw new Error("This auction is not active");
    }
    
    if (new Date(auctionData.end_time) < new Date()) {
      throw new Error("This auction has ended");
    }
    
    if (amount <= auctionData.current_bid) {
      throw new Error(`Bid must be higher than the current bid (${auctionData.current_bid})`);
    }
    
    if (amount < auctionData.current_bid + auctionData.min_bid_increment) {
      throw new Error(`Minimum bid increment is ${auctionData.min_bid_increment}`);
    }
    
    // Get the user profile to get the name
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw profileError;
    }
    
    const bidderName = profile.name || user.email || "Anonymous";
    
    // Place the bid
    const { data: bidData, error: bidError } = await supabase
      .from("bids")
      .insert([
        {
          auction_id: auctionId,
          bidder_id: user.id,
          bidder_name: bidderName,
          amount: amount,
        }
      ])
      .select()
      .single();
      
    if (bidError) {
      console.error("Error placing bid:", bidError);
      throw bidError;
    }
    
    // Log the bid activity
    await supabase.rpc("log_user_activity", {
      p_user_id: user.id,
      p_activity_type: "place_bid",
      p_resource_id: auctionId,
      p_resource_type: "auction"
    });
    
    return bidData;
    
  } catch (error) {
    console.error("Error in placeBid:", error);
    throw error;
  }
};
