import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ShieldCheck, ArrowRight } from "lucide-react";

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
  },
];

export function FeaturedListings() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Popular <span className="text-gradient-flame">Gas Deals</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Top-rated gas cylinders and refills from verified sellers
            </p>
          </div>
          <Link to="/marketplace">
            <Button variant="ghost" className="group">
              View All Listings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              to={`/marketplace/${listing.id}`}
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
