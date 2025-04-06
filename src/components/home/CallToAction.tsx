
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="bg-auction-dark text-white py-16">
      <div className="auction-container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Bidding Journey?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of collectors and enthusiasts. Create an account today
            and start bidding on unique treasures.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-auction-purple hover:bg-auction-purple/90 text-white w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
            <Link to="/auctions">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Browse Auctions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
