
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPriceDisplay } from "@/utils/currency";
import { useAuth } from "@/context/AuthContext";
import { placeBid } from "@/services/bid/bidActionService";

interface BiddingFormProps {
  auction: {
    id: string;
    title: string;
    category?: string;
    condition?: string;
    currentBid: number;
    nextMinimumBid: number;
    startingBid: number;
    timeLeft: string;
    bids?: number;
    bidHistory?: any[];
    location?: string;
  };
}

const BiddingForm = ({ auction }: BiddingFormProps) => {
  const { toast } = useToast();
  const { isAuthenticated, user, profile } = useAuth();
  const [bidAmount, setBidAmount] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  
  const handlePlaceBid = async () => {
    if (!isAuthenticated || !user || !profile) {
      toast({
        title: "Login required",
        description: "You must be logged in to place a bid.",
        variant: "destructive",
      });
      return;
    }
    
    if (!bidAmount) {
      toast({
        title: "Bid amount required",
        description: "Please enter a bid amount.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < auction.nextMinimumBid) {
      toast({
        title: "Invalid bid amount",
        description: `Your bid must be at least ${formatPriceDisplay(auction.nextMinimumBid)}.`,
        variant: "destructive",
      });
      return;
    }

    setIsPlacingBid(true);
    try {
      // Update to use the correct placeBid function signature
      const result = await placeBid({
        auctionId: auction.id,
        amount: amount,
        userId: user.id,
        userName: profile.name || user.email || 'Anonymous'
      });
      
      if (result.success) {
        toast({
          title: "Bid placed successfully!",
          description: `You've placed a bid of ${formatPriceDisplay(amount)} on ${auction.title}.`,
          variant: "default",
        });

        // Reset bid amount
        setBidAmount("");
      } else {
        toast({
          title: "Bid failed",
          description: result.error || "There was a problem placing your bid. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Bid failed",
        description: error.message || "There was a problem placing your bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingBid(false);
    }
  };

  const toggleWatchlist = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "You must be logged in to save items.",
        variant: "destructive",
      });
      return;
    }
    
    setIsWatching(!isWatching);
    toast({
      title: isWatching ? "Removed from saved items" : "Added to saved items",
      description: isWatching
        ? "Item removed from your saved items"
        : "You'll receive notifications about this auction",
      variant: "default",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        toast({
          title: "Link copied!",
          description: "Auction link copied to clipboard.",
          variant: "default",
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the link. Please try again.",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="sticky top-24">
      <div className="border rounded-lg p-6 mb-6">
        <h1 className="text-xl font-bold mb-2">{auction.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {auction.category && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {auction.category}
            </Badge>
          )}
          {auction.condition && (
            <Badge variant="outline" className="bg-muted">
              {auction.condition}
            </Badge>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Current Bid:</p>
            <p className="text-3xl font-bold text-auction-purple">
              {formatPriceDisplay(auction.currentBid)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              <span className="font-medium">Time left:</span>{" "}
              {auction.timeLeft}
            </span>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Starting Bid: {formatPriceDisplay(auction.startingBid)}</span>
            <span>{auction.bids || (auction.bidHistory && auction.bidHistory.length) || 0} bids</span>
          </div>

          {auction.location && (
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                <span className="font-medium">Location:</span>{" "}
                {auction.location}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bid-amount" className="text-sm font-medium">
              Your Bid (USD)
            </label>
            <div className="flex mt-1.5">
              <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                $
              </span>
              <Input
                id="bid-amount"
                type="number"
                placeholder={auction.nextMinimumBid.toString()}
                min={auction.nextMinimumBid}
                step="50"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="rounded-l-none"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter {formatPriceDisplay(auction.nextMinimumBid)} or more
            </p>
          </div>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handlePlaceBid}
            disabled={isPlacingBid || !isAuthenticated}
          >
            {isPlacingBid ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Bid"
            )}
          </Button>
          {!isAuthenticated && (
            <p className="text-xs text-center text-muted-foreground">
              <a href="/login" className="text-primary hover:underline">Login</a> or <a href="/signup" className="text-primary hover:underline">create an account</a> to place a bid
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={toggleWatchlist}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  isWatching ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isWatching ? "Saved" : "Save Item"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Buyer Protection</p>
            <p className="text-muted-foreground">
              AuctionBliss guarantees that this item is as described. See our
              terms and conditions for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingForm;
