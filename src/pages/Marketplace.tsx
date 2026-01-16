import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, MapPin, ShieldCheck, SlidersHorizontal, Loader2, Package, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Listing = Tables<"listings">;
type CylinderSize = "3kg" | "6kg" | "13kg" | "22kg" | "45kg";

const CYLINDER_SIZES: CylinderSize[] = ["3kg", "6kg", "13kg", "22kg", "45kg"];

const Marketplace = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setListings(data || []);
      
      // Calculate max price for slider
      if (data && data.length > 0) {
        const highest = Math.max(...data.map((l) => l.price));
        setMaxPrice(Math.ceil(highest / 1000) * 1000 || 10000);
        setPriceRange([0, Math.ceil(highest / 1000) * 1000 || 10000]);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings
    .filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (listing.brand?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (listing.location?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      const matchesSize = sizeFilter === "all" || listing.cylinder_size === sizeFilter;
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "refill" && listing.is_refill) ||
        (typeFilter === "full" && !listing.is_refill);
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      return matchesSearch && matchesSize && matchesType && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

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
                  placeholder="Search by brand, title, or location..."
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
                    {CYLINDER_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
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
                
                {/* Advanced Filters Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Refine your search with advanced filters
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Price Range</h4>
                        <Slider
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          max={maxPrice}
                          min={0}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Cylinder Size</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={sizeFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSizeFilter("all")}
                          >
                            All
                          </Button>
                          {CYLINDER_SIZES.map((size) => (
                            <Button
                              key={size}
                              variant={sizeFilter === size ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSizeFilter(size)}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Type</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={typeFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTypeFilter("all")}
                          >
                            All
                          </Button>
                          <Button
                            variant={typeFilter === "full" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTypeFilter("full")}
                          >
                            Full Cylinder
                          </Button>
                          <Button
                            variant={typeFilter === "refill" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTypeFilter("refill")}
                          >
                            Refill
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                    className="group rounded-2xl bg-background p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                      {listing.image_url ? (
                        <img
                          src={listing.image_url}
                          alt={listing.title}
                          className="object-cover w-full h-full rounded-xl"
                        />
                      ) : (
                        <span className="text-6xl">{listing.is_refill ? "⛽" : "🔥"}</span>
                      )}
                      <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs">
                        {listing.cylinder_size}
                      </Badge>
                      {listing.is_refill && (
                        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs">
                          Refill
                        </Badge>
                      )}
                      {listing.quantity > 0 && (
                        <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                          <ShieldCheck className="h-4 w-4 text-success" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{listing.brand || "Generic"}</p>
                        <Badge variant="outline" className="text-xs">
                          <Package className="h-3 w-3 mr-1" />
                          {listing.quantity} left
                        </Badge>
                      </div>

                      <h3 className="font-display font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {listing.title}
                      </h3>

                      {listing.location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-xs truncate">{listing.location}</span>
                        </div>
                      )}

                      {listing.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {listing.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-display font-bold text-lg text-primary">
                          {formatPrice(listing.price)}
                        </span>
                      </div>

                      <Button 
                        variant="flame" 
                        className="w-full mt-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/listing/${listing.id}`);
                        }}
                      >
                        <Flame className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">No listings found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchQuery || sizeFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters or search query to find more listings."
                    : "There are no gas cylinders available at the moment. Check back later!"}
                </p>
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
