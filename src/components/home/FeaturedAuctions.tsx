
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuctionCard from "../auctions/AuctionCard";
import { Link } from "react-router-dom";

// Sample auction data
const auctions = {
  trending: [
    {
      id: "auction1",
      title: "Vintage Rolex Submariner Watch 1968",
      image: "https://plus.unsplash.com/premium_photo-1682125779534-76c5debea767?q=80&w=2031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      currentBid: 12500,
      timeLeft: "2 days, 4 hours",
      bids: 28,
      isHot: true,
    },
    {
      id: "auction2",
      title: "Original Abstract Painting by Maria Gonzalez",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      currentBid: 4200,
      timeLeft: "1 day, 8 hours",
      bids: 15,
    },
    {
      id: "auction3",
      title: "First Edition Signed Harry Potter Collection",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      currentBid: 8750,
      timeLeft: "4 days, 12 hours",
      bids: 32,
      isHot: true,
    },
    {
      id: "auction4",
      title: "Antique Victorian Oak Dining Table",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      currentBid: 3500,
      timeLeft: "3 days, 6 hours",
      bids: 12,
    },
  ],
  ending: [
    {
      id: "auction5",
      title: "Limited Edition Nike Air Jordan 1985",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      currentBid: 9800,
      timeLeft: "5 hours, 23 minutes",
      bids: 45,
      isHot: true,
    },
    {
      id: "auction6",
      title: "Rare Coin Collection - Silver Eagles",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      currentBid: 6300,
      timeLeft: "3 hours, 15 minutes",
      bids: 19,
    },
    {
      id: "auction7",
      title: "Autographed Michael Jordan Jersey",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      currentBid: 15000,
      timeLeft: "8 hours, 42 minutes",
      bids: 52,
      isHot: true,
    },
    {
      id: "auction8",
      title: "Apple Macintosh 128K Original 1984",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      currentBid: 6800,
      timeLeft: "4 hours, 10 minutes",
      bids: 23,
    },
  ],
  new: [
    {
      id: "auction9",
      title: "Diamond Engagement Ring 2.5 Carat",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      currentBid: 18500,
      timeLeft: "6 days, 18 hours",
      bids: 8,
      isNew: true,
    },
    {
      id: "auction10",
      title: "Vintage Gibson Les Paul Guitar 1959",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      currentBid: 32000,
      timeLeft: "6 days, 12 hours",
      bids: 14,
      isNew: true,
    },
    {
      id: "auction11",
      title: "Rare Baseball Card Collection",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      currentBid: 5400,
      timeLeft: "5 days, 20 hours",
      bids: 6,
      isNew: true,
    },
    {
      id: "auction12",
      title: "Signed First Edition 'To Kill a Mockingbird'",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
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
