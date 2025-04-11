
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "./apiService";
import { Session, AuthError } from "@supabase/supabase-js";

// Interface for bid history item
export interface BidHistoryItem {
  id: string;
  amount: number;
  auction_id: string;
  bidder_id: string;
  bidder_name: string;
  time: string;
  // For UI display
  itemTitle?: string;
  status?: "winning" | "outbid" | "won" | "lost";
}

// Interface for auction updates
export interface AuctionUpdate {
  id: string;
  currentBid?: number;
  nextMinimumBid?: number;
  bids?: number;
  bidHistory?: BidHistoryItem[];
}

// Place a bid in the database
export async function placeBid(
  auctionId: string,
  auctionTitle: string,
  amount: number
): Promise<void> {
  // Check authentication
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  
  if (!user) {
    throw new Error("You must be logged in to place a bid");
  }

  try {
    // Get user profile for the bidder name
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    const bidderName = profile?.name || user.email || 'Anonymous';

    // Insert the bid record
    const { error: bidError } = await supabase
      .from('bids')
      .insert({
        amount,
        auction_id: auctionId,
        bidder_id: user.id,
        bidder_name: bidderName
      });

    if (bidError) {
      console.error("Error placing bid:", bidError);
      throw new Error(bidError.message);
    }

    // Log the bid activity
    await supabase.rpc("log_user_activity", {
      p_user_id: user.id,
      p_activity_type: "place_bid",
      p_details: { amount, auction_title: auctionTitle }
    });

    // Trigger local update for UI
    const mockBidEvent = new StorageEvent('storage', {
      key: `auction_bid_${auctionId}`,
      newValue: JSON.stringify({
        amount,
        timestamp: new Date().toISOString(),
      }),
    });
    
    window.dispatchEvent(mockBidEvent);
  } catch (error: any) {
    console.error("Error in placeBid:", error);
    throw error;
  }
}

// Set up listener for auction changes (like new bids)
export function listenToAuctionChanges(
  auctionId: string,
  onUpdate: (auction: AuctionUpdate) => void
): () => void {
  // Set up the initial channel subscription
  const channel = supabase
    .channel(`auction_updates:${auctionId}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'bids',
      filter: `auction_id=eq.${auctionId}`
    }, (payload) => {
      // Get the new bid amount from the payload
      const newBid = payload.new as BidHistoryItem;
      
      // Create an update object
      const update: AuctionUpdate = {
        id: auctionId,
        currentBid: newBid.amount,
        nextMinimumBid: newBid.amount + 250, // Increment by $250
      };
      
      onUpdate(update);
    })
    .subscribe();

  // Legacy storage event listener for demo purposes
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === `auction_bid_${auctionId}` && event.newValue) {
      try {
        const bidData = JSON.parse(event.newValue);
        
        const update: AuctionUpdate = {
          id: auctionId,
          currentBid: bidData.amount,
          nextMinimumBid: bidData.amount + 250, // Increment by $250
        };
        
        onUpdate(update);
      } catch (error) {
        console.error("Error processing auction update:", error);
      }
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function for both listeners
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    supabase.removeChannel(channel);
  };
}

// Get bid history for a specific auction
export async function getAuctionBidHistory(auctionId: string): Promise<BidHistoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .order('time', { ascending: false });
    
    if (error) {
      console.error("Error fetching bid history:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAuctionBidHistory:", error);
    throw error;
  }
}

// Get user's bid history
export async function getUserBidHistory(): Promise<BidHistoryItem[]> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      throw new Error("User must be authenticated to get bid history");
    }
    
    const { data: bids, error } = await supabase
      .from('bids')
      .select(`
        *,
        auctions!inner(title)
      `)
      .eq('bidder_id', user.id)
      .order('time', { ascending: false });
    
    if (error) {
      console.error("Error fetching user bid history:", error);
      throw error;
    }
    
    // Transform the data to match the expected format
    return (bids || []).map(bid => ({
      id: bid.id,
      amount: bid.amount,
      auction_id: bid.auction_id,
      bidder_id: bid.bidder_id,
      bidder_name: bid.bidder_name,
      time: bid.time,
      itemTitle: bid.auctions?.title || 'Unknown Item',
      // Determine status based on current data
      status: 'bidding' as any // This would need logic to determine actual status
    }));
  } catch (error) {
    console.error("Error in getUserBidHistory:", error);
    // Return mock data for demo purposes if there's an error
    return MOCK_BID_HISTORY;
  }
}

// Get user's won items (items where user has winning bid)
export async function getUserWonItems(): Promise<BidHistoryItem[]> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      throw new Error("User must be authenticated to get won items");
    }
    
    // For now, just return the mocked won items since we need additional 
    // logic to determine if a bid is winning
    return MOCK_WON_ITEMS;
  } catch (error) {
    console.error("Error in getUserWonItems:", error);
    return MOCK_WON_ITEMS;
  }
}

// Listen to user's bids (real-time updates)
export function listenToUserBids(callback: (bids: BidHistoryItem[]) => void): () => void {
  // Get current user
  const getCurrentUserBids = async () => {
    try {
      const bids = await getUserBidHistory();
      callback(bids);
    } catch (error) {
      console.error("Error fetching user bids:", error);
      callback(MOCK_BID_HISTORY); // Fallback to mock data
    }
  };

  // Initial data load
  getCurrentUserBids();

  // Set up realtime subscription
  const userPromise = supabase.auth.getSession();
  
  userPromise.then(({ data: sessionData }) => {
    const user = sessionData.session?.user;
    
    if (!user) {
      // Not authenticated, just use polling with mock data
      const interval = setInterval(() => {
        callback(MOCK_BID_HISTORY);
      }, 30000);
      
      return () => clearInterval(interval);
    }
    
    // Set up realtime subscription for authenticated users
    const channel = supabase
      .channel('user_bids')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `bidder_id=eq.${user.id}`
      }, () => {
        // Refetch all bids when a new one is added
        getCurrentUserBids();
      })
      .subscribe();
    
    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  });
  
  // Default return function
  return () => {};
}

// Mock bid history data for fallback
const MOCK_BID_HISTORY: BidHistoryItem[] = [
  {
    id: "bid-1",
    auction_id: "auction-1",
    bidder_id: "user-1",
    bidder_name: "BidUser1",
    amount: 1200,
    time: "2023-04-01T14:22:00Z",
    itemTitle: "Vintage Watch",
    status: "winning"
  },
  {
    id: "bid-2",
    auction_id: "auction-2",
    bidder_id: "user-1",
    bidder_name: "BidUser1",
    amount: 850,
    time: "2023-03-28T09:15:00Z",
    itemTitle: "Antique Vase",
    status: "outbid"
  },
  {
    id: "bid-3",
    auction_id: "auction-3",
    bidder_id: "user-1",
    bidder_name: "BidUser1",
    amount: 3500,
    time: "2023-03-25T16:30:00Z",
    itemTitle: "Classic Car Model",
    status: "won"
  },
  {
    id: "bid-4",
    auction_id: "auction-4",
    bidder_id: "user-1",
    bidder_name: "BidUser1",
    amount: 5000,
    time: "2023-03-20T11:45:00Z",
    itemTitle: "Rare Coin Collection",
    status: "lost"
  }
];

// Mock won items data for fallback
const MOCK_WON_ITEMS: BidHistoryItem[] = MOCK_BID_HISTORY.filter(
  bid => bid.status === "won" || bid.status === "winning"
);
