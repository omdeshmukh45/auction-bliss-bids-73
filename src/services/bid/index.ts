
// Re-export everything from the individual modules
export * from "./types";
export * from "./bidHistoryService";
export * from "./bidListenerService";
export * from "./bidActionService";
export * from "./wonItemsService";

// For backward compatibility
export { 
  BidHistoryItem,
  getUserBidHistory,
  getAuctionBidHistory,
  getUserWonItems,
  listenToAuctionChanges,
  listenToUserBids,
  placeBid
} from "./types";
