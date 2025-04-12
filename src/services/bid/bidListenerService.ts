
import { supabase } from "@/integrations/supabase/client";
import { getUserBidHistory } from "./bidHistoryService";

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

  let subscription: any;
  
  fetchUserSession().then(userId => {
    if (!userId) {
      console.warn("Cannot listen to bids: User not authenticated");
      return;
    }
    
    // Subscribe to bid changes
    subscription = supabase
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
  });
  
  // Return unsubscribe function
  return () => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  };
};
