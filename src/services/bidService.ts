
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  increment,
  onSnapshot,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

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
  const user = auth.currentUser;
  
  if (!user) throw new Error("You must be logged in to place a bid");
  
  // Get the auction to make sure the bid is valid
  const auctionRef = doc(db, "auctions", auctionId);
  const auctionSnap = await getDoc(auctionRef);
  
  if (!auctionSnap.exists()) {
    throw new Error("Auction not found");
  }
  
  const auctionData = auctionSnap.data() as Auction;
  
  if (auctionData.status === 'ended') {
    throw new Error("This auction has ended");
  }
  
  if (bidAmount < auctionData.nextMinimumBid) {
    throw new Error(`Your bid must be at least ${auctionData.nextMinimumBid}`);
  }
  
  // Create the bid document
  const newBid = {
    auctionId,
    itemTitle,
    bidAmount,
    bidderUid: user.uid,
    bidderName: user.displayName || "Anonymous Bidder",
    date: new Date().toISOString(),
    timestamp: serverTimestamp(),
    status: 'winning' as const,
  };
  
  // Add the bid to the bids collection
  const bidRef = await addDoc(collection(db, "bids"), newBid);
  
  // Update the auction with the new highest bid
  await updateDoc(auctionRef, {
    currentBid: bidAmount,
    nextMinimumBid: bidAmount + Math.ceil(bidAmount * 0.02), // 2% increment for next bid
    bids: increment(1)
  });
  
  // Mark previous winning bids as outbid
  const prevWinningBidsQuery = query(
    collection(db, "bids"),
    where("auctionId", "==", auctionId),
    where("status", "==", "winning"),
    where("bidderUid", "!=", user.uid)
  );
  
  const prevWinningBids = await getDocs(prevWinningBidsQuery);
  
  const updatePromises = prevWinningBids.docs.map(doc => 
    updateDoc(doc.ref, { status: "outbid" })
  );
  
  await Promise.all(updatePromises);
  
  return {
    id: bidRef.id,
    ...newBid,
    timestamp: new Date()
  };
};

// Get user's bid history
export const getUserBidHistory = async (): Promise<Bid[]> => {
  const user = auth.currentUser;
  
  if (!user) return [];
  
  const bidsQuery = query(
    collection(db, "bids"),
    where("bidderUid", "==", user.uid),
    orderBy("timestamp", "desc")
  );
  
  const bidsSnap = await getDocs(bidsQuery);
  
  return bidsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<Bid, 'id'>
  }));
};

// Get items won by user
export const getUserWonItems = async (): Promise<Bid[]> => {
  const user = auth.currentUser;
  
  if (!user) return [];
  
  const bidsQuery = query(
    collection(db, "bids"),
    where("bidderUid", "==", user.uid),
    where("status", "in", ["won", "winning"])
  );
  
  const bidsSnap = await getDocs(bidsQuery);
  
  return bidsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<Bid, 'id'>
  }));
};

// Listen to auction changes (e.g., bid counts)
export const listenToAuctionChanges = (
  auctionId: string,
  callback: (auction: Auction) => void
) => {
  return onSnapshot(
    doc(db, "auctions", auctionId),
    (snapshot) => {
      if (snapshot.exists()) {
        callback({
          id: snapshot.id,
          ...snapshot.data() as Omit<Auction, 'id'>
        });
      }
    }
  );
};

// Listen to user's bid history 
export const listenToUserBids = (
  callback: (bids: Bid[]) => void
) => {
  const user = auth.currentUser;
  
  if (!user) {
    callback([]);
    return () => {};
  }
  
  const bidsQuery = query(
    collection(db, "bids"),
    where("bidderUid", "==", user.uid),
    orderBy("timestamp", "desc")
  );
  
  return onSnapshot(
    bidsQuery,
    (snapshot) => {
      const bids = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Bid, 'id'>
      }));
      callback(bids);
    }
  );
};
