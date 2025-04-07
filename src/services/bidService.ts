
import { api, createPollingEffect, isAuthenticated } from "./apiService";

export interface Bid {
  id: string;
  auctionId: string;
  itemTitle: string;
  bidAmount: number;
  bidderUid: string;
  bidderName: string;
  date: string;
  timestamp: Date;
  status: 'winning' | 'outbid' | 'won' | 'lost';
}

export interface Auction {
  id: string;
  title: string;
  currentBid: number;
  nextMinimumBid: number;
  bids: number;
  bidHistory: Bid[];
  winnerId?: string;
  status: 'active' | 'ended';
}

// Place a bid on an auction
export const placeBid = async (
  auctionId: string,
  itemTitle: string,
  bidAmount: number
): Promise<Bid> => {
  if (!isAuthenticated()) {
    throw new Error("You must be logged in to place a bid");
  }
  
  try {
    // Get the auction first to validate bid amount
    const auction = await api.auctions.getAuction(auctionId);
    
    if (auction.status === 'ended') {
      throw new Error("This auction has ended");
    }
    
    if (bidAmount < auction.nextMinimumBid) {
      throw new Error(`Your bid must be at least ${auction.nextMinimumBid}`);
    }
    
    // Place the bid
    const bidResult = await api.bids.placeBid(auctionId, bidAmount);
    return bidResult;
  } catch (error: any) {
    console.error("Error placing bid:", error);
    throw new Error(error.message || "Failed to place bid. Please try again.");
  }
};

// Get user's bid history
export const getUserBidHistory = async (): Promise<Bid[]> => {
  if (!isAuthenticated()) return [];
  
  try {
    return await api.bids.getUserBids();
  } catch (error) {
    console.error("Error fetching bid history:", error);
    return [];
  }
};

// Get items won by user
export const getUserWonItems = async (): Promise<Bid[]> => {
  if (!isAuthenticated()) return [];
  
  try {
    return await api.bids.getWonItems();
  } catch (error) {
    console.error("Error fetching won items:", error);
    return [];
  }
};

// Poll for auction changes
export const listenToAuctionChanges = (
  auctionId: string,
  callback: (auction: Auction) => void
) => {
  return createPollingEffect(
    () => api.auctions.getAuction(auctionId),
    callback,
    5000, // Poll every 5 seconds
    (error) => console.error("Error polling auction:", error)
  );
};

// Poll for user's bid history
export const listenToUserBids = (
  callback: (bids: Bid[]) => void
) => {
  if (!isAuthenticated()) {
    callback([]);
    return () => {};
  }
  
  return createPollingEffect(
    () => api.bids.getUserBids(),
    callback,
    10000, // Poll every 10 seconds
    (error) => console.error("Error polling user bids:", error)
  );
};

// Poll for all bids for a specific auction
export const listenToAuctionBids = (
  auctionId: string,
  callback: (bids: Bid[]) => void
) => {
  return createPollingEffect(
    () => api.bids.getAuctionBids(auctionId),
    callback,
    5000, // Poll every 5 seconds
    (error) => console.error("Error polling auction bids:", error)
  );
};
