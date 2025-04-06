
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-auction-dark text-white">
      <div className="auction-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-auction-gold" />
              <span className="text-xl font-bold">AuctionBliss</span>
            </div>
            <p className="text-gray-300">
              Your premium destination for online auctions. Bid, win, and discover unique items.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-auction-gold">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-auction-gold">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-auction-gold">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/auctions" className="text-gray-300 hover:text-auction-gold">
                  Current Auctions
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-auction-gold">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-auction-gold">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-auction-gold">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-auction-gold">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-auction-gold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-auction-gold">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-auction-gold">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-auction-gold mt-0.5" />
                <span className="text-gray-300">123 Auction Avenue, Bidding City, BC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-auction-gold" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-auction-gold" />
                <span className="text-gray-300">support@auctionbliss.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AuctionBliss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
