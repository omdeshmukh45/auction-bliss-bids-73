import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPriceDisplay } from "@/utils/currency";
import { getAuctionBidHistory, BidHistoryItem } from "@/services/bidService";
import { Loader2 } from "lucide-react";

interface BidHistoryProps {
  auctionId: string;
  bidHistory?: BidHistoryItem[];
  totalBids?: number;
}

const BidHistory = ({ auctionId, bidHistory: initialBidHistory, totalBids: initialTotalBids }: BidHistoryProps) => {
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>(initialBidHistory || []);
  const [totalBids, setTotalBids] = useState<number>(initialTotalBids || 0);
  const [isLoading, setIsLoading] = useState<boolean>(!initialBidHistory);

  useEffect(() => {
    if (initialBidHistory) {
      setBidHistory(initialBidHistory);
      setTotalBids(initialTotalBids || initialBidHistory.length);
      return;
    }

    const fetchBidHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getAuctionBidHistory(auctionId);
        setBidHistory(data);
        setTotalBids(data.length);
      } catch (error) {
        console.error("Error fetching bid history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBidHistory();
  }, [auctionId, initialBidHistory, initialTotalBids]);

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleString();
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Bid History ({totalBids} bids)</h3>
      <div className="border rounded-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading bid history...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bidder</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bidHistory.length > 0 ? (
                bidHistory.map((bid: BidHistoryItem, index: number) => (
                  <TableRow key={bid.id || index}>
                    <TableCell className="font-medium">{bid.bidder_name}</TableCell>
                    <TableCell>{formatPriceDisplay(bid.amount)}</TableCell>
                    <TableCell>{formatTime(bid.time)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">No bids yet. Be the first to bid!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default BidHistory;
