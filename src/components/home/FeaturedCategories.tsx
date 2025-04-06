
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    count: 234,
  },
  {
    id: "collectibles",
    name: "Collectibles",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    count: 192,
  },
  {
    id: "jewelry",
    name: "Jewelry",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    count: 158,
  },
  {
    id: "art",
    name: "Art",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    count: 143,
  },
];

const FeaturedCategories = () => {
  return (
    <section className="auction-container py-12">
      <h2 className="auction-heading text-center mb-2">Popular Categories</h2>
      <p className="text-muted-foreground text-center mb-8">
        Browse our most popular auction categories
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} to={`/category/${category.id}`}>
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="relative h-40">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.count} auctions</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
