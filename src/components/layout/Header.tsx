
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Menu, ShoppingBag, LogIn, Bell } from "lucide-react";

const Header = () => {
  const [isLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[350px]">
              <nav className="flex flex-col gap-4 pt-4">
                <Link to="/" className="text-lg font-semibold hover:text-primary">
                  Home
                </Link>
                <Link to="/auctions" className="text-lg font-semibold hover:text-primary">
                  Auctions
                </Link>
                <Link to="/categories" className="text-lg font-semibold hover:text-primary">
                  Categories
                </Link>
                <Link to="/about" className="text-lg font-semibold hover:text-primary">
                  About
                </Link>
                <Link to="/contact" className="text-lg font-semibold hover:text-primary">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-auction-purple" />
            <span className="text-xl font-bold">AuctionBliss</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/auctions" className="text-sm font-medium hover:text-primary">
            Auctions
          </Link>
          <Link to="/categories" className="text-sm font-medium hover:text-primary">
            Categories
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" className="hidden md:inline-flex gap-2">
                  My Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" className="hidden md:inline-flex gap-2">
                <LogIn className="h-4 w-4" /> Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
