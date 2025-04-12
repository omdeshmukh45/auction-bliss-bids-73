
import { supabase } from "@/integrations/supabase/client";
import { BidHistoryItem } from "./types";

// Listen to changes in an auction
export function listenToAuctionChanges(auctionId: string, onUpdate: () => void) {
  const channel = supabase
    .channel(`auction_${auctionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bids',
        filter: `auction_id=eq.${auctionId}`,
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Listen to the user's bids
export function listenToUserBids(userId: string, onUpdate: () => void) {
  const channel = supabase
    .channel(`user_bids_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bids',
        filter: `bidder_id=eq.${userId}`,
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
