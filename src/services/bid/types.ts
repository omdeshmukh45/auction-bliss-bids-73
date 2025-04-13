
import { supabase } from "@/integrations/supabase/client";

// Define BidHistoryItem interface
export interface BidHistoryItem {
  id: string;
  bidder_name: string;
  amount: number;
  time: string;
}

// Define BidData interface
export interface BidData {
  auctionId: string;
  itemTitle: string;
  itemImage?: string;
  bidAmount: number;
  date: string;
  status: string;
}

// No re-exports here, they're in the index.ts file
