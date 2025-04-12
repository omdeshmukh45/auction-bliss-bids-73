
import { supabase } from "@/integrations/supabase/client";
import { BidData } from "./types";

export const listenToUserBids = (callback: (bids: any[]) => void) => {
  // Set up initial fetch
  const fetchInitialBids = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      
      if (!user) {
        callback([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("bids")
        .select(`
          id,
          amount,
          time,
          bidder_id,
          bidder_name,
          auction:auction_id (
            id,
            title,
            image_urls,
            current_bid,
            end_time
          )
        `)
        .eq("bidder_id", user.id)
        .order("time", { ascending: false });
      
      if (error) {
        console.error("Error fetching bids:", error);
        callback([]);
        return;
      }
      
      // Process and format bid data
      const formattedBids = data.map((bid) => ({
        id: bid.id,
        auctionId: bid.auction.id,
        itemTitle: bid.auction.title,
        itemImage: bid.auction.image_urls[0],
        bidAmount: bid.amount,
        date: bid.time,
        status: determineBidStatus(bid.amount, bid.auction.current_bid, bid.auction.end_time),
      }));
      
      callback(formattedBids);
    } catch (error) {
      console.error("Error in listenToUserBids:", error);
      callback([]);
    }
  };
  
  // Determine bid status based on current bid and end time
  const determineBidStatus = (bidAmount: number, currentBid: number, endTime: string) => {
    const now = new Date();
    const auctionEnd = new Date(endTime);
    
    if (now > auctionEnd) {
      return bidAmount >= currentBid ? "won" : "lost";
    } else {
      return bidAmount >= currentBid ? "winning" : "outbid";
    }
  };
  
  // Initial fetch
  fetchInitialBids();
  
  // Set up real-time subscription
  const subscription = supabase
    .channel("public:bids")
    .on("postgres_changes", { event: "*", schema: "public", table: "bids" }, fetchInitialBids)
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};
