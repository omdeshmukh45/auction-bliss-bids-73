
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "./apiService";

// Mock structure for auction changes
interface AuctionUpdate {
  id: string;
  currentBid?: number;
  nextMinimumBid?: number;
  bids?: number;
  bidHistory?: any[];
}

// Mock bid history item
interface BidHistoryItem {
  id: string;
  itemTitle: string;
  auctionId: string;
  bidAmount: number;
  date: string;
  status: "winning" | "outbid" | "won" | "lost";
}

// Mock place bid function
export async function placeBid(
  auctionId: string,
  auctionTitle: string,
  amount: number
): Promise<void> {
  if (!isAuthenticated()) {
    throw new Error("You must be logged in to place a bid");
  }

  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if amount is valid (would be server-side in real app)
  if (amount <= 0) {
    throw new Error("Bid amount must be greater than zero");
  }
  
  // Simulating successful bid
  console.log(`Bid placed on ${auctionTitle} for $${amount}`);
  
  // In a real app, this would update the database and trigger the listeners
  const mockBidEvent = new StorageEvent('storage', {
    key: `auction_bid_${auctionId}`,
    newValue: JSON.stringify({
      amount,
      timestamp: new Date().toISOString(),
    }),
  });
  
  window.dispatchEvent(mockBidEvent);
}

// Set up listener for auction changes (like new bids)
export function listenToAuctionChanges(
  auctionId: string,
  onUpdate: (auction: AuctionUpdate) => void
): () => void {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === `auction_bid_${auctionId}` && event.newValue) {
      try {
        const bidData = JSON.parse(event.newValue);
        
        // In a real app, we would fetch the updated auction data
        // For demo, create a mock update
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
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}

// Mock bid history data
const MOCK_BID_HISTORY: BidHistoryItem[] = [
  {
    id: "bid-1",
    itemTitle: "Vintage Watch",
    auctionId: "auction-1",
    bidAmount: 1200,
    date: "2023-04-01T14:22:00Z",
    status: "winning"
  },
  {
    id: "bid-2",
    itemTitle: "Antique Vase",
    auctionId: "auction-2",
    bidAmount: 850,
    date: "2023-03-28T09:15:00Z",
    status: "outbid"
  },
  {
    id: "bid-3",
    itemTitle: "Classic Car Model",
    auctionId: "auction-3",
    bidAmount: 3500,
    date: "2023-03-25T16:30:00Z",
    status: "won"
  },
  {
    id: "bid-4",
    itemTitle: "Rare Coin Collection",
    auctionId: "auction-4",
    bidAmount: 5000,
    date: "2023-03-20T11:45:00Z",
    status: "lost"
  }
];

// Mock won items data
const MOCK_WON_ITEMS: BidHistoryItem[] = MOCK_BID_HISTORY.filter(
  bid => bid.status === "won" || bid.status === "winning"
);

// Get user's bid history
export async function getUserBidHistory(): Promise<BidHistoryItem[]> {
  if (!isAuthenticated()) {
    throw new Error("User must be authenticated to get bid history");
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return MOCK_BID_HISTORY;
}

// Get user's won items
export async function getUserWonItems(): Promise<BidHistoryItem[]> {
  if (!isAuthenticated()) {
    throw new Error("User must be authenticated to get won items");
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return MOCK_WON_ITEMS;
}

// Listen to user's bids (real-time updates)
export function listenToUserBids(callback: (bids: BidHistoryItem[]) => void): () => void {
  // Call callback immediately with initial data
  callback(MOCK_BID_HISTORY);
  
  // In a real app, this would set up a listener for bid updates
  // For demo, we'll just simulate updates periodically
  const interval = setInterval(() => {
    // No updates in demo, just return the same data
    callback(MOCK_BID_HISTORY);
  }, 30000); // Check every 30 seconds
  
  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}
