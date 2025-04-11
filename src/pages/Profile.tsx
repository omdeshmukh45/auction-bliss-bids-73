import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPriceDisplay } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile, logoutUser } from "@/services/authService";
import { getUserBidHistory, getUserWonItems, listenToUserBids } from "@/services/bidService";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, profile, user, isLoading, refreshUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });
  
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [wonItems, setWonItems] = useState<any[]>([]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isFetchingBids, setIsFetchingBids] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const unsubscribe = listenToUserBids((bids) => {
      setBidHistory(bids);
      
      const won = bids.filter(bid => 
        bid.status === "won" || bid.status === "winning"
      );
      setWonItems(won);
    });
    
    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchBidHistory = async () => {
      if (!isAuthenticated) return;
      
      setIsFetchingBids(true);
      try {
        const bids = await getUserBidHistory();
        setBidHistory(bids);
        
        const won = await getUserWonItems();
        setWonItems(won);
      } catch (error) {
        console.error("Error fetching bid history:", error);
        toast({
          title: "Error",
          description: "Failed to load your bid history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsFetchingBids(false);
      }
    };
    
    fetchBidHistory();
  }, [isAuthenticated, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdatingProfile(true);
    try {
      await updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      
      await refreshUserProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
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

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case "winning":
        return <Badge className="bg-green-500">Winning</Badge>;
      case "outbid":
        return <Badge variant="outline" className="text-red-500 border-red-500">Outbid</Badge>;
      case "won":
        return <Badge className="bg-blue-500">Won</Badge>;
      case "lost":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Lost</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="auction-container py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !profile) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout>
      <div className="auction-container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="auction-heading">My Profile</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="won">Won Items</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>My Photo</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="text-3xl">{formData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Upload New Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Member since: {profile.joinDate}
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bids">
            <Card>
              <CardHeader>
                <CardTitle>My Bid History</CardTitle>
                <CardDescription>
                  Track all your bids across various auctions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isFetchingBids ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading your bid history...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Bid Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bidHistory.length > 0 ? (
                          bidHistory.map((bid) => (
                            <TableRow key={bid.id}>
                              <TableCell className="font-medium">
                                {bid.itemTitle}
                              </TableCell>
                              <TableCell>
                                {formatPriceDisplay(bid.bidAmount)}
                              </TableCell>
                              <TableCell>
                                {new Date(bid.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {getBidStatusBadge(bid.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`/auction/${bid.auctionId}`}>View Item</a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              You haven't placed any bids yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="won">
            <Card>
              <CardHeader>
                <CardTitle>Won Items</CardTitle>
                <CardDescription>
                  Items you've successfully won in auctions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isFetchingBids ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading your won items...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Winning Bid</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wonItems.length > 0 ? (
                          wonItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                {item.itemTitle}
                              </TableCell>
                              <TableCell>
                                {formatPriceDisplay(item.bidAmount)}
                              </TableCell>
                              <TableCell>
                                {new Date(item.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`/auction/${item.auctionId}`}>View Item</a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                              You haven't won any items yet. Keep bidding!
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
