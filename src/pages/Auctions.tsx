
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import AuctionCard from "@/components/auctions/AuctionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Sample auction data (same structure as in FeaturedAuctions)
const auctionData = {
  active: [
    {
      id: "auction1",
      title: "Vintage Rolex Submariner Watch 1968",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
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
    {
      id: "auction13",
      title: "Professional Camera Kit with 3 Lenses",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      currentBid: 2300,
      timeLeft: "3 days, 7 hours",
      bids: 9,
    },
    {
      id: "auction14",
      title: "Handcrafted Leather Laptop Bag",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      currentBid: 450,
      timeLeft: "4 days, 9 hours",
      bids: 7,
    },
  ],
  upcoming: [
    {
      id: "auction9",
      title: "Diamond Engagement Ring 2.5 Carat",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      currentBid: 18500,
      timeLeft: "Starts in 2 days",
      bids: 0,
      isNew: true,
    },
    {
      id: "auction10",
      title: "Vintage Gibson Les Paul Guitar 1959",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      currentBid: 32000,
      timeLeft: "Starts in 3 days",
      bids: 0,
      isNew: true,
    },
    {
      id: "auction11",
      title: "Rare Baseball Card Collection",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      currentBid: 5400,
      timeLeft: "Starts in 5 days",
      bids: 0,
      isNew: true,
    },
    {
      id: "auction12",
      title: "Signed First Edition 'To Kill a Mockingbird'",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      currentBid: 12000,
      timeLeft: "Starts in 4 days",
      bids: 0,
      isNew: true,
    },
  ],
  closed: [
    {
      id: "auction5",
      title: "Limited Edition Nike Air Jordan 1985",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      currentBid: 9800,
      timeLeft: "Ended 2 days ago",
      bids: 45,
    },
    {
      id: "auction6",
      title: "Rare Coin Collection - Silver Eagles",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      currentBid: 6300,
      timeLeft: "Ended 1 week ago",
      bids: 19,
    },
    {
      id: "auction7",
      title: "Autographed Michael Jordan Jersey",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      currentBid: 15000,
      timeLeft: "Ended 3 days ago",
      bids: 52,
    },
    {
      id: "auction8",
      title: "Apple Macintosh 128K Original 1984",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      currentBid: 6800,
      timeLeft: "Ended 5 days ago",
      bids: 23,
    },
  ],
};

// Sample categories for filter
const categories = [
  "All Categories",
  "Electronics",
  "Art & Collectibles",
  "Fashion",
  "Jewelry & Watches",
  "Furniture & Home",
  "Books & Manuscripts",
  "Sports Memorabilia",
  "Vehicles",
];

// Sample locations
const locations = [
  "All Locations",
  "New York, USA",
  "London, UK",
  "Paris, France",
  "Tokyo, Japan",
  "Sydney, Australia",
  "Berlin, Germany",
  "Toronto, Canada",
];

const Auctions = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [priceRange, setPriceRange] = useState([0, 50000]);

  // Filter auctions based on search and filters
  const filterAuctions = (auctions: typeof auctionData.active) => {
    return auctions.filter((auction) => {
      // Filter by search query
      const matchesSearch = auction.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter by price range
      const matchesPrice =
        auction.currentBid >= priceRange[0] && auction.currentBid <= priceRange[1];

      // If All Categories is selected, don't filter by category
      // If specific category is selected, we would filter here (not implemented in demo)
      const matchesCategory = selectedCategory === "All Categories" ? true : true;

      // If All Locations is selected, don't filter by location
      // If specific location is selected, we would filter here (not implemented in demo)
      const matchesLocation = selectedLocation === "All Locations" ? true : true;

      return matchesSearch && matchesPrice && matchesCategory && matchesLocation;
    });
  };

  return (
    <Layout>
      <div className="auction-container py-8">
        <h1 className="auction-heading mb-8">Browse Auctions</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Search bar */}
          <div className="relative flex-1">
            <Input
              placeholder="Search auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Filter button (for mobile) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your auction search with these filters.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category-mobile">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger id="category-mobile">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location-mobile">Location</Label>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger id="location-mobile">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
                    </div>
                    <Slider
                      defaultValue={[0, 50000]}
                      max={50000}
                      step={1000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop filters */}
          <div className="hidden md:flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <span>Price: ${priceRange[0]} - ${priceRange[1]}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Price Range</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div>
                      <Label>
                        ${priceRange[0]} - ${priceRange[1]}
                      </Label>
                    </div>
                    <Slider
                      defaultValue={[0, 50000]}
                      max={50000}
                      step={1000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="active">Active Auctions</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {filterAuctions(auctionData.active).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterAuctions(auctionData.active).map((auction) => (
                  <AuctionCard key={auction.id} {...auction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No active auctions match your search criteria.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {filterAuctions(auctionData.upcoming).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterAuctions(auctionData.upcoming).map((auction) => (
                  <AuctionCard key={auction.id} {...auction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No upcoming auctions match your search criteria.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="closed">
            {filterAuctions(auctionData.closed).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterAuctions(auctionData.closed).map((auction) => (
                  <AuctionCard key={auction.id} {...auction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No closed auctions match your search criteria.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Auctions;
