
import { supabase } from "@/integrations/supabase/client";

// Define BidHistoryItem interface
export interface BidHistoryItem {
  id: string;
  bidder_name: string;
  amount: number;
  time: string;
}

// For backward compatibility
export { 
  getUserBidHistory,
  getAuctionBidHistory,
  getUserWonItems,
  listenToAuctionChanges,
  listenToUserBids,
  placeBid
} from "./bidHistoryService";
export { placeBid as placeBidAction } from "./bidActionService";
