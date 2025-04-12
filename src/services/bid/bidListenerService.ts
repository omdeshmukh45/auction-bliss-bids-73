
import { supabase } from "@/integrations/supabase/client";

// Listen for changes to a specific auction
export function listenToAuctionChanges(
  auctionId: string, 
  callback: (updatedAuction: any) => void
): () => void {
  const channel = supabase
    .channel(`auction:${auctionId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'auctions',
        filter: `id=eq.${auctionId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Listen for changes to a user's bids
export function listenToUserBids(callback: () => void): () => void {
  const { data } = supabase.auth.getSession();
  const user = data.session?.user;
  
  if (!user) {
    console.error("Cannot listen to bids: User not authenticated");
    return () => {};
  }

  const channel = supabase
    .channel(`user-bids:${user.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bids',
        filter: `bidder_id=eq.${user.id}`
      },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
