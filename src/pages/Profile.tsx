
import { useState } from "react";
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

// Mock data for demonstration
const userProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Auction Lane, Bidding City, BC 12345",
  avatar: "",
  joinDate: "January 2023",
};

const bidHistory = [
  {
    id: "bid1",
    itemId: "auction1",
    itemTitle: "Vintage Rolex Submariner Watch 1968",
    bidAmount: 12500,
    date: "2023-06-15",
    status: "winning", // winning, outbid, won, lost
  },
  {
    id: "bid2",
    itemId: "auction3",
    itemTitle: "First Edition Signed Harry Potter Collection",
    bidAmount: 8500,
    date: "2023-06-10",
    status: "outbid",
  },
  {
    id: "bid3",
    itemId: "auction5",
    itemTitle: "Limited Edition Nike Air Jordan 1985",
    bidAmount: 9500,
    date: "2023-05-25",
    status: "won",
  },
  {
    id: "bid4",
    itemId: "auction7",
    itemTitle: "Autographed Michael Jordan Jersey",
    bidAmount: 14800,
    date: "2023-05-20",
    status: "lost",
  },
];

const wonItems = bidHistory.filter(bid => bid.status === "won" || bid.status === "winning");

const Profile = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ ...userProfile });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
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

  return (
    <Layout>
      <div className="auction-container py-8">
        <h1 className="auction-heading mb-8">My Profile</h1>

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
                    Member since: {userProfile.joinDate}
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
                        />
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
                      <Button type="submit">Save Changes</Button>
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
                      {bidHistory.map((bid) => (
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
                              <a href={`/auction/${bid.itemId}`}>View Item</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                                <a href={`/auction/${item.itemId}`}>View Item</a>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
