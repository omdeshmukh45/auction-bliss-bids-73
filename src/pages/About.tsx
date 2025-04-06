
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="auction-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="auction-heading mb-8 text-center">About AuctionBliss</h1>
          
          {/* Hero section */}
          <div className="mb-12 relative rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800" 
              alt="Team at work" 
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
              <div className="p-8 text-white max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Connecting Buyers and Sellers Since 2020</h2>
                <p className="text-white/80">
                  We've revolutionized the online auction experience by creating a platform that's trustworthy, 
                  transparent, and tailored to both buyers and sellers.
                </p>
              </div>
            </div>
          </div>
          
          {/* Our Story */}
          <section className="mb-12">
            <h2 className="auction-subheading mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              AuctionBliss was founded in 2020 by a team of auction enthusiasts who saw the need for a more 
              transparent, secure, and user-friendly online auction platform. What started as a small venture 
              focused on collectibles has grown into a comprehensive marketplace for a wide range of categories.
            </p>
            <p className="text-muted-foreground mb-4">
              We began with just 50 registered users and a handful of auctions each week. Today, we're proud 
              to host thousands of auctions monthly, connecting buyers and sellers from around the world. Our 
              growth has been driven by our commitment to fairness, transparency, and exceptional customer service.
            </p>
            <p className="text-muted-foreground">
              Despite our growth, we maintain the same values that guided us from the beginning: providing a trusted 
              platform where buyers can discover unique items and sellers can reach interested audiences.
            </p>
          </section>
          
          {/* Mission & Values */}
          <section className="mb-12 bg-muted p-8 rounded-lg">
            <h2 className="auction-subheading mb-4">Our Mission</h2>
            <p className="mb-6 italic text-lg">
              "To create the most trusted online auction community where buyers and sellers can connect without 
              barriers, ensuring every transaction is fair, transparent, and enjoyable."
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-md">
                <h4 className="font-semibold text-primary mb-2">Trust & Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  We verify sellers and provide detailed item information so buyers can bid with confidence.
                </p>
              </div>
              <div className="p-4 bg-background rounded-md">
                <h4 className="font-semibold text-primary mb-2">Fair Competition</h4>
                <p className="text-sm text-muted-foreground">
                  Our platform ensures fair bidding practices through secure systems and anti-fraud measures.
                </p>
              </div>
              <div className="p-4 bg-background rounded-md">
                <h4 className="font-semibold text-primary mb-2">Customer Satisfaction</h4>
                <p className="text-sm text-muted-foreground">
                  We prioritize exceptional service and support for both buyers and sellers.
                </p>
              </div>
              <div className="p-4 bg-background rounded-md">
                <h4 className="font-semibold text-primary mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  We continuously improve our platform with new features and technologies.
                </p>
              </div>
            </div>
          </section>
          
          {/* How It Works Summary */}
          <section className="mb-12">
            <h2 className="auction-subheading mb-4">How AuctionBliss Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">1</div>
                <h3 className="font-semibold mb-2">Browse & Discover</h3>
                <p className="text-sm text-muted-foreground">
                  Explore thousands of unique items across multiple categories. Use filters to find exactly what you're looking for.
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">2</div>
                <h3 className="font-semibold mb-2">Bid with Confidence</h3>
                <p className="text-sm text-muted-foreground">
                  Place bids on items you love. Our system notifies you about bid status and auction endings.
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">3</div>
                <h3 className="font-semibold mb-2">Win & Connect</h3>
                <p className="text-sm text-muted-foreground">
                  When you win, our secure system connects you with the seller to arrange payment and delivery.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/auctions">
                <Button>Start Browsing Auctions</Button>
              </Link>
            </div>
          </section>
          
          {/* Team section could be added here */}
          {/* For now using a CTA instead */}
          <section className="bg-primary text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="mb-6">
              Whether you're looking to bid on unique items or sell to interested buyers, 
              AuctionBliss is the perfect platform for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="secondary">Create an Account</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
