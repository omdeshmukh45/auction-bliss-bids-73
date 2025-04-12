
import { supabase } from "@/integrations/supabase/client";

// Place a bid on an auction
export async function placeBid(auctionId: string, amount: number) {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // First get the user's name
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Then get the current auction details
    const { data: auction, error: auctionError } = await supabase
      .from("auctions")
      .select("current_bid, min_bid_increment")
      .eq("id", auctionId)
      .single();

    if (auctionError) {
      throw auctionError;
    }

    // Validate the bid amount
    if (amount <= auction.current_bid) {
      throw new Error(
        `Your bid must be higher than the current bid of ${auction.current_bid}`
      );
    }

    if (amount < auction.current_bid + auction.min_bid_increment) {
      throw new Error(
        `Your bid must be at least ${auction.current_bid + auction.min_bid_increment}`
      );
    }

    // Insert the bid
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .insert({
        auction_id: auctionId,
        bidder_id: user.id,
        bidder_name: profile.name || "Anonymous",
        amount: amount,
      })
      .select()
      .single();

    if (bidError) {
      throw bidError;
    }

    // Log the bid activity
    await supabase.rpc("log_product_activity", {
      p_user_id: user.id,
      p_activity_type: "place_bid",
      p_resource_id: auctionId,
      p_resource_type: "auction",
      p_details: { bid_amount: amount }
    });

    return bid;
  } catch (error) {
    console.error("Error in placeBid:", error);
    throw error;
  }
}
