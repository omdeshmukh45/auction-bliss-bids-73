
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly.",
        variant: "default",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="auction-container py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="auction-heading text-center mb-8">Contact Us</h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Have questions about an auction, need help with your account, or want to learn more about 
            selling on AuctionBliss? We're here to help. Reach out to our team using the form below 
            or through our contact information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="auction-subheading mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please describe your query in detail..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="auction-subheading mb-6">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Our Location</h3>
                      <p className="text-muted-foreground">
                        123 Auction Avenue<br />
                        Bidding City, BC 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-muted-foreground mb-1">
                        General Inquiries: <a href="mailto:support@auctionbliss.com" className="text-primary hover:underline">support@auctionbliss.com</a>
                      </p>
                      <p className="text-muted-foreground mb-1">
                        Seller Support: <a href="mailto:sellers@auctionbliss.com" className="text-primary hover:underline">sellers@auctionbliss.com</a>
                      </p>
                      <p className="text-muted-foreground">
                        Partnership Opportunities: <a href="mailto:partners@auctionbliss.com" className="text-primary hover:underline">partners@auctionbliss.com</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Call Us</h3>
                      <p className="text-muted-foreground mb-1">
                        Customer Support: <a href="tel:+15551234567" className="text-primary hover:underline">+1 (555) 123-4567</a>
                      </p>
                      <p className="text-muted-foreground">
                        Seller Hotline: <a href="tel:+15559876543" className="text-primary hover:underline">+1 (555) 987-6543</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Saturday: 10:00 AM - 4:00 PM EST<br />
                        Sunday: Closed
                      </p>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Online support available 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="auction-subheading text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">How do I place a bid?</h3>
                <p className="text-muted-foreground text-sm">
                  To place a bid, navigate to the auction item you're interested in, enter your bid amount, 
                  and confirm. You'll need to be registered and logged in to bid.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">What happens if I win an auction?</h3>
                <p className="text-muted-foreground text-sm">
                  When you win, you'll receive a notification with instructions for payment and 
                  connecting with the seller to arrange delivery or pickup.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">How do I list an item for auction?</h3>
                <p className="text-muted-foreground text-sm">
                  To sell an item, you need a seller account. Once approved, you can create a listing 
                  with photos, description, starting price, and auction duration.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">What fees does AuctionBliss charge?</h3>
                <p className="text-muted-foreground text-sm">
                  Bidding is free. Sellers pay a small listing fee and a percentage commission on successful sales. 
                  See our pricing page for detailed information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
