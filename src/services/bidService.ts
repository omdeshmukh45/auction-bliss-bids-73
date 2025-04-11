
import { supabase } from "@/integrations/supabase/client";

// Define BidHistoryItem interface
export interface BidHistoryItem {
  id: string;
  bidder_name: string;
  amount: number;
  time: string;
}

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

// Function to listen to auction changes in real-time
export const listenToAuctionChanges = (auctionId: string, callback: (auction: any) => void) => {
  // Subscribe to auction changes
  const subscription = supabase
    .channel('auction_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'auctions',
        filter: `id=eq.${auctionId}`
      },
      (payload) => {
        // When data changes, pass the updated auction to the callback
        callback(payload.new);
      }
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};

// Function to listen to bid changes in real-time
export const listenToUserBids = (callback: (bids: any[]) => void) => {
  const fetchUserSession = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id;
  };

  fetchUserSession().then(userId => {
    if (!userId) {
      console.warn("Cannot listen to bids: User not authenticated");
      return () => {}; // Return empty unsubscribe function
    }
    
    // Subscribe to bid changes
    const subscription = supabase
      .channel('bids_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids',
          filter: `bidder_id=eq.${userId}`
        },
        async () => {
          // When data changes, fetch the updated bid history
          try {
            const bids = await getUserBidHistory();
            callback(bids);
          } catch (error) {
            console.error("Error updating bids in real-time:", error);
          }
        }
      )
      .subscribe();
    
    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
    };
  });
  
  // Default return to satisfy TypeScript
  return () => {};
};

// Function to place a bid on an auction
export const placeBid = async (auctionId: string, amount: number) => {
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
    
    // Update the auction's current bid
    const { error: updateError } = await supabase
      .from("auctions")
      .update({ current_bid: amount })
      .eq("id", auctionId);
      
    if (updateError) {
      console.error("Error updating auction current bid:", updateError);
      throw updateError;
    }
    
    // Log the bid activity
    await supabase.rpc("log_user_activity", {
      p_user_id: user.id,
      p_activity_type: "place_bid",
      p_resource_id: auctionId,
      p_resource_type: "auction",
      p_details: { amount }
    });
    
    return bidData;
    
  } catch (error) {
    console.error("Error in placeBid:", error);
    throw error;
  }
};

// Helper function to determine bid status
const getBidStatus = (currentBid: number, bidAmount: number, endTime: string, auctionStatus: string) => {
  const now = new Date();
  const auctionEndTime = new Date(endTime);
  
  if (auctionStatus === "ended" || now > auctionEndTime) {
    // Auction has ended
    return currentBid === bidAmount ? "won" : "lost";
  } else {
    // Auction is still active
    return currentBid === bidAmount ? "winning" : "outbid";
  }
};
