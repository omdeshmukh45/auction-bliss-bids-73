
import { supabase } from "@/integrations/supabase/client";

// Get auctions won by the current user
export async function getUserWonItems() {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // This is a simplified query - in a real app, you'd need to check auction end time
    // and if the user is the highest bidder
    const { data: wonItems, error } = await supabase
      .from("auctions")
      .select(`
        id,
        title,
        description,
        image_urls,
        current_bid,
        end_time,
        bids!inner(bidder_id)
      `)
      .eq("bids.bidder_id", user.id)
      .lt("end_time", new Date().toISOString())
      .order("end_time", { ascending: false });

    if (error) {
      console.error("Error fetching won items:", error);
      throw error;
    }

    return wonItems || [];
  } catch (error) {
    console.error("Error in getUserWonItems:", error);
    throw error;
  }
}
