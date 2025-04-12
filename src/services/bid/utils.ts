
// Helper function to determine bid status
export const getBidStatus = (currentBid: number, bidAmount: number, endTime: string, auctionStatus: string) => {
  const now = new Date();
  const auctionEndTime = new Date(endTime);
  
  if (auctionStatus === "ended" || now > auctionEndTime) {
    // Auction has ended
    return currentBid === bidAmount ? "won" : "lost";
  } else {
    // Auction is still active
    return currentBid === bidAmount ? "winning" : "outbid";
  }
};
