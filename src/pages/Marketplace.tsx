import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MapPin, Star, ShieldCheck, SlidersHorizontal } from "lucide-react";

const listings = [
  {
    id: 1,
    name: "6kg Gas Cylinder",
    brand: "K-Gas",
    price: 1200,
    originalPrice: 1400,
    image: "🔥",
    location: "Near UoN Main Campus",
    rating: 4.8,
    reviews: 124,
    verified: true,
    badge: "Best Seller",
    size: "6kg",
    type: "full",
  },
  {
    id: 2,
    name: "13kg Gas Cylinder",
    brand: "Total Gas",
    price: 2800,
    originalPrice: 3100,
    image: "🔥",
    location: "Juja, JKUAT Area",
    rating: 4.7,
    reviews: 89,
    verified: true,
    badge: "Student Discount",
    size: "13kg",
    type: "full",
  },
  {
    id: 3,
    name: "6kg Refill",
    brand: "Pro Gas",
    price: 800,
    originalPrice: 950,
    image: "⛽",
    location: "Nyayo Stadium Area",
    rating: 4.9,
    reviews: 203,
    verified: true,
    badge: "Quick Refill",
    size: "6kg",
    type: "refill",
  },
  {
    id: 4,
    name: "22.5kg Gas Cylinder",
    brand: "Oilibya",
    price: 4500,
    originalPrice: 5000,
    image: "🔥",
    location: "Westlands, Nairobi",
    rating: 4.6,
    reviews: 67,
    verified: true,
    badge: null,
    size: "22.5kg",
    type: "full",
  },
  {
    id: 5,
    name: "13kg Refill",
    brand: "Hashi Gas",
    price: 1650,
    originalPrice: 1800,
    image: "⛽",
    location: "Rongai Town",
    rating: 4.5,
    reviews: 45,
    verified: true,
    badge: null,
    size: "13kg",
    type: "refill",
  },
  {
    id: 6,
    name: "6kg Gas Cylinder",
    brand: "National Oil",
    price: 1150,
    originalPrice: 1350,
    image: "🔥",
    location: "Moi University Area",
    rating: 4.7,
    reviews: 78,
    verified: true,
    badge: "New",
    size: "6kg",
    type: "full",
  },
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSize = sizeFilter === "all" || listing.size === sizeFilter;
    const matchesType = typeFilter === "all" || listing.type === typeFilter;
    return matchesSearch && matchesSize && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        {/* Hero Section */}
        <section className="bg-background py-8 md:py-12">
          <div className="container">
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Gas <span className="text-gradient-flame">Marketplace</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse verified gas sellers and find the best deals near you
            </p>

            {/* Search and Filters */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by brand, size, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="6kg">6kg</SelectItem>
                    <SelectItem value="13kg">13kg</SelectItem>
                    <SelectItem value="22.5kg">22.5kg</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full">Full Cylinder</SelectItem>
                    <SelectItem value="refill">Refill Only</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredListings.length}</span> results
              </p>
              <Select defaultValue="popular">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="group rounded-2xl bg-background p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <span className="text-6xl">{listing.image}</span>
                    {listing.badge && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                        {listing.badge}
                      </Badge>
                    )}
                    {listing.verified && (
                      <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-success" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{listing.brand}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        <span className="text-xs font-medium">{listing.rating}</span>
                        <span className="text-xs text-muted-foreground">({listing.reviews})</span>
                      </div>
                    </div>

                    <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
                      {listing.name}
                    </h3>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs truncate">{listing.location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="font-display font-bold text-lg text-primary">
                          KES {listing.price.toLocaleString()}
                        </span>
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          KES {listing.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button variant="flame" className="w-full mt-3">
                      Order Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No listings found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
