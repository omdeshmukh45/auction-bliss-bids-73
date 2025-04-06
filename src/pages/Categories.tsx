
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Sample categories data with updated electronics subcategories
const categories = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Computers, smartphones, audio equipment, and more",
    icon: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVsZWN0cm9uaWNzfGVufDB8fDB8fHww",
    itemCount: 152,
    subcategories: [
      { id: "smartphones", name: "Mobile Phones" },
      { id: "laptops", name: "Laptops" },
      { id: "tablets", name: "Tablets" },
      { id: "televisions", name: "Televisions" },
      { id: "cameras", name: "Cameras" },
    ]
  },
  {
    id: "jewelry",
    name: "Jewelry & Watches",
    description: "Fine jewelry, luxury watches, and precious gems",
    icon: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGpld2Vscnl8ZW58MHx8MHx8fDA%3D",
    itemCount: 76,
  },
  {
    id: "art",
    name: "Art & Collectibles",
    description: "Paintings, sculptures, limited editions, and rare items",
    icon: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFydHxlbnwwfHwwfHx8MA%3D%3D",
    itemCount: 98,
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Clothing, shoes, accessories, and vintage attire",
    icon: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    itemCount: 213,
  },
  {
    id: "furniture",
    name: "Furniture & Home",
    description: "Antique and modern furniture, decor, and home items",
    icon: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnVybml0dXJlfGVufDB8fDB8fHww",
    itemCount: 124,
  },
  {
    id: "books",
    name: "Books & Manuscripts",
    description: "Rare books, first editions, and historical manuscripts",
    icon: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
    itemCount: 87,
  },
  {
    id: "sports",
    name: "Sports Memorabilia",
    description: "Collectible sports items, autographs, and equipment",
    icon: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BvcnRzJTIwbWVtb3JhYmlsaWF8ZW58MHx8MHx8fDA%3D",
    itemCount: 65,
  },
  {
    id: "vehicles",
    name: "Vehicles",
    description: "Classic cars, motorcycles, boats, and other vehicles",
    icon: "https://images.unsplash.com/photo-1578508393418-0b281fe620b8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNsYXNzaWMlMjBjYXJzfGVufDB8fDB8fHww",
    itemCount: 42,
  },
  {
    id: "wine",
    name: "Wine & Spirits",
    description: "Fine wines, rare whiskies, and collectible spirits",
    icon: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2luZXxlbnwwfHwwfHx8MA%3D%3D",
    itemCount: 53,
  },
  {
    id: "coins",
    name: "Coins & Stamps",
    description: "Numismatic items, rare stamps, and currency collections",
    icon: "https://images.unsplash.com/photo-1621559189959-ca5a4e848d4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNvaW5zfGVufDB8fDB8fHww",
    itemCount: 89,
  },
  {
    id: "music",
    name: "Musical Instruments",
    description: "Vintage and contemporary musical instruments",
    icon: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3VpdGFyfGVufDB8fDB8fHww",
    itemCount: 38,
  },
  {
    id: "other",
    name: "Other Collectibles",
    description: "Unique items that don't fit in other categories",
    icon: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvbGxlY3RpYmxlc3xlbnwwfHwwfHx8MA%3D%3D",
    itemCount: 115,
  },
];

const Categories = () => {
  return (
    <Layout>
      <div className="auction-container py-8">
        <div className="text-center mb-12">
          <h1 className="auction-heading mb-4">Browse Categories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of auction categories and find exactly what you're looking for. 
            From rare collectibles to everyday essentials, we have something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="auction-card group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.itemCount} items</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-muted-foreground mb-4 flex-1">
                  {category.description}
                </p>
                
                {/* Display subcategories for Electronics */}
                {category.id === 'electronics' && category.subcategories && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Subcategories:</h4>
                    <ul className="grid grid-cols-2 gap-1 text-sm">
                      {category.subcategories.map(subcat => (
                        <li key={subcat.id}>
                          <Link 
                            to={`/auctions?category=${category.id}&subcategory=${subcat.id}`}
                            className="text-primary hover:underline"
                          >
                            {subcat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Link to={`/auctions?category=${category.id}`} className="self-start">
                  <Button variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors flex gap-2">
                    Browse Category
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
