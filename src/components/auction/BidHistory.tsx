
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPriceDisplay } from "@/utils/currency";

interface Bid {
  bidder?: string;
  bidderName?: string;
  amount?: number;
  bidAmount?: number;
  time: string;
}

interface BidHistoryProps {
  bidHistory: Bid[];
  totalBids: number;
}

const BidHistory = ({ bidHistory, totalBids }: BidHistoryProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Bid History ({totalBids} bids)</h3>
      <div className="border rounded-md overflow-hidden">
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
              bidHistory.map((bid: Bid, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{bid.bidderName || bid.bidder}</TableCell>
                  <TableCell>{formatPriceDisplay(bid.bidAmount || bid.amount || 0)}</TableCell>
                  <TableCell>{bid.time}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">No bids yet. Be the first to bid!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BidHistory;
