
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuctionCard from "../auctions/AuctionCard";
import { Link } from "react-router-dom";

// Sample auction data with improved realistic product images
const auctions = {
  trending: [
    {
      id: "auction1",
      title: "Vintage Rolex Submariner Watch 1968",
      image: "https://images.unsplash.com/photo-1626170733248-0baf8ce057fb?q=80&w=2070&auto=format&fit=crop",
      currentBid: 12500,
      timeLeft: "2 days, 4 hours",
      bids: 28,
      isHot: true,
    },
    {
      id: "auction2",
      title: "Original Abstract Painting by Maria Gonzalez",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2145&auto=format&fit=crop",
      currentBid: 4200,
      timeLeft: "1 day, 8 hours",
      bids: 15,
    },
    {
      id: "auction3",
      title: "First Edition Signed Harry Potter Collection",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2048&auto=format&fit=crop",
      currentBid: 8750,
      timeLeft: "4 days, 12 hours",
      bids: 32,
      isHot: true,
    },
    {
      id: "auction4",
      title: "Antique Victorian Oak Dining Table",
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=2080&auto=format&fit=crop",
      currentBid: 3500,
      timeLeft: "3 days, 6 hours",
      bids: 12,
    },
  ],
  ending: [
    {
      id: "auction5",
      title: "Limited Edition Nike Air Jordan 1985",
      image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=1974&auto=format&fit=crop",
      currentBid: 9800,
      timeLeft: "5 hours, 23 minutes",
      bids: 45,
      isHot: true,
    },
    {
      id: "auction6",
      title: "Rare Coin Collection - Silver Eagles",
      image: "https://images.unsplash.com/photo-1610375461249-bd2461d438f6?q=80&w=2070&auto=format&fit=crop",
      currentBid: 6300,
      timeLeft: "3 hours, 15 minutes",
      bids: 19,
    },
    {
      id: "auction7",
      title: "Autographed Michael Jordan Jersey",
      image: "https://images.unsplash.com/photo-1574872853399-d9a89622dbb3?q=80&w=2071&auto=format&fit=crop",
      currentBid: 15000,
      timeLeft: "8 hours, 42 minutes",
      bids: 52,
      isHot: true,
    },
    {
      id: "auction8",
      title: "Apple Macintosh 128K Original 1984",
      image: "https://images.unsplash.com/photo-1551651065-6eb9b84c59aa?q=80&w=2070&auto=format&fit=crop",
      currentBid: 6800,
      timeLeft: "4 hours, 10 minutes",
      bids: 23,
    },
  ],
  new: [
    {
      id: "auction9",
      title: "Diamond Engagement Ring 2.5 Carat",
      image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=2070&auto=format&fit=crop",
      currentBid: 18500,
      timeLeft: "6 days, 18 hours",
      bids: 8,
      isNew: true,
    },
    {
      id: "auction10",
      title: "Vintage Gibson Les Paul Guitar 1959",
      image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=2070&auto=format&fit=crop",
      currentBid: 32000,
      timeLeft: "6 days, 12 hours",
      bids: 14,
      isNew: true,
    },
    {
      id: "auction11",
      title: "Rare Baseball Card Collection",
      image: "https://images.unsplash.com/photo-1619450237270-e5de7d661c27?q=80&w=2070&auto=format&fit=crop",
      currentBid: 5400,
      timeLeft: "5 days, 20 hours",
      bids: 6,
      isNew: true,
    },
    {
      id: "auction12",
      title: "Signed First Edition 'To Kill a Mockingbird'",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2074&auto=format&fit=crop",
      currentBid: 12000,
      timeLeft: "6 days, 8 hours",
      bids: 11,
      isNew: true,
    },
  ],
};

const FeaturedAuctions = () => {
  return (
    <section className="auction-container py-12 bg-auction-light">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="auction-heading mb-2">Featured Auctions</h2>
          <p className="text-muted-foreground">
            Discover unique items and place your bids
          </p>
        </div>
        <Link to="/auctions" className="mt-4 md:mt-0">
          <Button variant="outline">View All Auctions</Button>
        </Link>
      </div>

      <Tabs defaultValue="trending">
        <TabsList className="mb-8">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="ending">Ending Soon</TabsTrigger>
          <TabsTrigger value="new">New Arrivals</TabsTrigger>
        </TabsList>
        <TabsContent value="trending">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {auctions.trending.map((auction) => (
              <AuctionCard key={auction.id} {...auction} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ending">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {auctions.ending.map((auction) => (
              <AuctionCard key={auction.id} {...auction} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="new">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {auctions.new.map((auction) => (
              <AuctionCard key={auction.id} {...auction} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default FeaturedAuctions;
