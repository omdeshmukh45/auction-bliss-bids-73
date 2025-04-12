
import { supabase } from "@/integrations/supabase/client";

// Define BidHistoryItem interface
export interface BidHistoryItem {
  id: string;
  bidder_name: string;
  amount: number;
  time: string;
}

// No re-exports here, they're in the index.ts file
