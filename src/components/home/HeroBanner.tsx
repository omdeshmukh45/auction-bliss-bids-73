
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <div className="relative bg-auction-dark text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81')] bg-cover bg-center opacity-20"></div>
      <div className="auction-container relative z-10 py-20 md:py-32">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Discover, Bid & Win Unique Items
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Join thousands of collectors and enthusiasts in the most exciting online auction platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auctions">
              <Button size="lg" className="bg-auction-purple hover:bg-auction-purple/90 text-white">
                Browse Auctions
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
