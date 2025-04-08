
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuctionCard from "../auctions/AuctionCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Sample auction data with improved product-specific images
const auctions = {
  trending: [
    {
      id: "auction1",
      title: "Vintage Rolex Submariner Watch 1968",
      image: "https://images.unsplash.com/photo-1635399860495-2a359a21c53b?q=80&w=2070&auto=format&fit=crop",
      currentBid: 12500,
      timeLeft: "2 days, 4 hours",
      bids: 28,
      isHot: true,
      category: "Watches",
    },
    {
      id: "auction2",
      title: "Original Abstract Painting by Maria Gonzalez",
      image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=2070&auto=format&fit=crop",
      currentBid: 4200,
      timeLeft: "1 day, 8 hours",
      bids: 15,
      category: "Art",
    },
    {
      id: "auction3",
      title: "First Edition Signed Harry Potter Collection",
      image: "https://images.unsplash.com/photo-1479894720049-a2da13c449f2?q=80&w=2070&auto=format&fit=crop",
      currentBid: 8750,
      timeLeft: "4 days, 12 hours",
      bids: 32,
      isHot: true,
      category: "Books",
    },
    {
      id: "auction4",
      title: "Antique Victorian Oak Dining Table",
      image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop",
      currentBid: 3500,
      timeLeft: "3 days, 6 hours",
      bids: 12,
      category: "Furniture",
    },
  ],
  ending: [
    {
      id: "auction5",
      title: "Limited Edition Nike Air Jordan 1985",
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop",
      currentBid: 9800,
      timeLeft: "5 hours, 23 minutes",
      bids: 45,
      isHot: true,
      category: "Fashion",
    },
    {
      id: "auction6",
      title: "Rare Coin Collection - Silver Eagles",
      image: "https://images.unsplash.com/photo-1601933513793-9a3bfba67bef?q=80&w=2070&auto=format&fit=crop",
      currentBid: 6300,
      timeLeft: "3 hours, 15 minutes",
      bids: 19,
      category: "Collectibles",
    },
    {
      id: "auction7",
      title: "Autographed Michael Jordan Jersey",
      image: "https://images.unsplash.com/photo-1587385789097-0197a7fbd179?q=80&w=2069&auto=format&fit=crop",
      currentBid: 15000,
      timeLeft: "8 hours, 42 minutes",
      bids: 52,
      isHot: true,
      category: "Sports",
    },
    {
      id: "auction8",
      title: "Apple Macintosh 128K Original 1984",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop",
      currentBid: 6800,
      timeLeft: "4 hours, 10 minutes",
      bids: 23,
      category: "Electronics",
    },
  ],
  new: [
    {
      id: "auction9",
      title: "Diamond Engagement Ring 2.5 Carat",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
      currentBid: 18500,
      timeLeft: "6 days, 18 hours",
      bids: 8,
      isNew: true,
      category: "Jewelry",
    },
    {
      id: "auction10",
      title: "Vintage Gibson Les Paul Guitar 1959",
      image: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=2072&auto=format&fit=crop",
      currentBid: 32000,
      timeLeft: "6 days, 12 hours",
      bids: 14,
      isNew: true,
      category: "Musical Instruments",
    },
    {
      id: "auction11",
      title: "Rare Baseball Card Collection",
      image: "https://images.unsplash.com/photo-1588398779793-a4c304f29720?q=80&w=2069&auto=format&fit=crop",
      currentBid: 5400,
      timeLeft: "5 days, 20 hours",
      bids: 6,
      isNew: true,
      category: "Sports",
    },
    {
      id: "auction12",
      title: "Signed First Edition 'To Kill a Mockingbird'",
      image: "https://images.unsplash.com/photo-1603162525962-df3406c46b8a?q=80&w=2070&auto=format&fit=crop",
      currentBid: 12000,
      timeLeft: "6 days, 8 hours",
      bids: 11,
      isNew: true,
      category: "Books",
    },
  ],
};

const FeaturedAuctions = () => {
  // State to force re-render
  const [refreshKey, setRefreshKey] = useState(0);

  // Enhanced debugging with useEffect
  useEffect(() => {
    console.log("FeaturedAuctions component rendered:", {
      timestamp: new Date().toISOString(),
      refreshKey
    });
    
    // Force a re-render after component mounts to ensure latest data is used
    const timer = setTimeout(() => {
      setRefreshKey(prevKey => prevKey + 1);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [refreshKey]);

  return (
    <section className="auction-container py-12 bg-auction-light" key={`featured-auctions-${refreshKey}`}>
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
