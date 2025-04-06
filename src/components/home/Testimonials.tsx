
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Art Collector",
    quote: "AuctionBliss completely transformed how I discover rare art pieces. The bidding process is intuitive and transparent. I've found items here that I couldn't find anywhere else!",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Vintage Watch Enthusiast",
    quote: "As someone who collects vintage timepieces, I've tried many platforms. None compare to the quality of listings and seller verification that AuctionBliss provides.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Antique Dealer",
    quote: "The authentication process gives both buyers and sellers peace of mind. I've been able to expand my business significantly through this platform.",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="auction-container py-12 bg-auction-light">
      <h2 className="auction-heading text-center mb-2">What Our Users Say</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
        Join thousands of satisfied customers who have found their treasures on AuctionBliss
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="bg-white border-none">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mb-4"
                />
                <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
