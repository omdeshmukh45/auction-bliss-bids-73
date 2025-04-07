
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <div className="auction-container py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-200">404</h1>
          <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto flex gap-2 items-center">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/auctions">
              <Button variant="outline" className="w-full sm:w-auto flex gap-2 items-center">
                <Search className="h-4 w-4" />
                Browse Auctions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
