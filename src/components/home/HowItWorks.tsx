
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Search, Clock, Award } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-10 w-10 text-auction-purple" />,
    title: "Browse & Discover",
    description: "Explore thousands of unique items up for auction in various categories",
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-auction-purple" />,
    title: "Place Your Bid",
    description: "Set your maximum bid and let our system automatically bid for you",
  },
  {
    icon: <Clock className="h-10 w-10 text-auction-purple" />,
    title: "Monitor Auctions",
    description: "Track your bids in real-time and receive notifications when you're outbid",
  },
  {
    icon: <Award className="h-10 w-10 text-auction-purple" />,
    title: "Win & Collect",
    description: "Pay securely when you win and arrange delivery of your new treasures",
  },
];

const HowItWorks = () => {
  return (
    <section className="auction-container py-12">
      <h2 className="auction-heading text-center mb-2">How It Works</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
        AuctionBliss makes bidding simple and exciting. Follow these steps to start your auction journey.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="border-2 border-border hover:border-primary/20 transition-colors">
            <CardHeader className="flex items-center text-center pt-6">
              <div className="rounded-full bg-auction-light p-3 mb-4">{step.icon}</div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-sm">{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
