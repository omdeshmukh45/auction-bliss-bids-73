
// Re-export everything from the individual modules
export * from "./types";
export * from "./bidHistoryService";
export * from "./bidListenerService";
export * from "./bidActionService";
export * from "./wonItemsService";

// For backward compatibility
export type { 
  BidHistoryItem 
} from "./types";
export { 
  getUserBidHistory,
  getAuctionBidHistory 
} from "./bidHistoryService";
export { 
  getUserWonItems 
} from "./wonItemsService";
export { 
  listenToAuctionChanges,
  listenToUserBids 
} from "./bidListenerService";
export { 
  placeBid 
} from "./bidActionService";
