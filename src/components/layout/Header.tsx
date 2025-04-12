
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Menu, ShoppingBag, LogIn, Bell, User, Heart, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { isAuthenticated, profile, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
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
                {isAuthenticated && (
                  <>
                    <Link to="/profile" className="text-lg font-semibold hover:text-primary">
                      My Profile
                    </Link>
                    <Link to="/products" className="text-lg font-semibold hover:text-primary">
                      My Products
                    </Link>
                    <Link to="/cart" className="text-lg font-semibold hover:text-primary">
                      Saved Items
                    </Link>
                    <Button variant="ghost" onClick={handleLogout} className="justify-start px-0">
                      Logout
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AuctionBliss</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Home
          </Link>
          <Link 
            to="/auctions" 
            className={`text-sm font-medium ${isActive('/auctions') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Auctions
          </Link>
          <Link 
            to="/categories" 
            className={`text-sm font-medium ${isActive('/categories') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Categories
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium ${isActive('/about') ? 'text-primary' : 'hover:text-primary'}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-medium ${isActive('/contact') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Contact
          </Link>
          {isAuthenticated && (
            <Link 
              to="/products" 
              className={`text-sm font-medium ${isActive('/products') ? 'text-primary' : 'hover:text-primary'}`}
            >
              My Products
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Link to="/products">
                <Button variant="ghost" size="icon">
                  <Package className="h-5 w-5" />
                  <span className="sr-only">My Products</span>
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Saved Items</span>
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="hidden md:inline-flex gap-2">
                  <User className="h-4 w-4" /> {profile?.name?.split(' ')[0] || 'My Profile'}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={handleLogout}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
              <Button 
                variant="default" 
                className="hidden md:inline-flex ml-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
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
