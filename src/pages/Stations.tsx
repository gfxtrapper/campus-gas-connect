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
import { Search, MapPin, Star, Phone, Clock, Navigation, ShieldCheck } from "lucide-react";

const stations = [
  {
    id: 1,
    name: "K-Gas Refill Station",
    address: "Kimathi Street, Near UoN",
    phone: "+254 712 345 678",
    hours: "7:00 AM - 9:00 PM",
    rating: 4.8,
    reviews: 156,
    distance: "0.5 km",
    verified: true,
    services: ["6kg Refill", "13kg Refill", "New Cylinders"],
    prices: { "6kg": 750, "13kg": 1600 },
  },
  {
    id: 2,
    name: "Total Gas Station",
    address: "Juja Town, Main Road",
    phone: "+254 723 456 789",
    hours: "6:00 AM - 10:00 PM",
    rating: 4.7,
    reviews: 98,
    distance: "1.2 km",
    verified: true,
    services: ["6kg Refill", "13kg Refill", "22.5kg Refill"],
    prices: { "6kg": 780, "13kg": 1650 },
  },
  {
    id: 3,
    name: "Pro Gas Center",
    address: "Ngong Road, Near KU",
    phone: "+254 734 567 890",
    hours: "7:30 AM - 8:00 PM",
    rating: 4.9,
    reviews: 234,
    distance: "2.1 km",
    verified: true,
    services: ["6kg Refill", "13kg Refill", "Delivery Available"],
    prices: { "6kg": 720, "13kg": 1580 },
  },
  {
    id: 4,
    name: "Oilibya Gas Point",
    address: "Westlands, Sarit Centre",
    phone: "+254 745 678 901",
    hours: "24 Hours",
    rating: 4.6,
    reviews: 87,
    distance: "3.5 km",
    verified: true,
    services: ["All Sizes", "Express Refill", "Card Payment"],
    prices: { "6kg": 800, "13kg": 1700 },
  },
];

const Stations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Refill <span className="text-gradient-flame">Stations</span>
            </h1>
            <p className="text-muted-foreground">
              Find gas refill stations near you with real-time availability
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Station List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search stations or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select defaultValue="distance">
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Nearest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price">Lowest Price</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              </div>

              {/* Station Cards */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    onClick={() => setSelectedStation(station.id)}
                    className={`rounded-xl p-4 cursor-pointer transition-all ${
                      selectedStation === station.id
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-card shadow-card hover:shadow-elevated"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold">{station.name}</h3>
                        {station.verified && (
                          <ShieldCheck className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {station.distance}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{station.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{station.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{station.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{station.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({station.reviews} reviews)
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">6kg: </span>
                        <span className="font-semibold text-primary">
                          KES {station.prices["6kg"]}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {station.services.map((service) => (
                        <Badge
                          key={service}
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="lg:col-span-3 rounded-2xl bg-muted overflow-hidden min-h-[500px] relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="h-20 w-20 rounded-2xl bg-gradient-flame flex items-center justify-center mb-6">
                  <MapPin className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  Interactive Map Coming Soon
                </h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  We're integrating Google Maps to show you all refill stations near your location in real-time.
                </p>
                <Button variant="flame">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions (Coming Soon)
                </Button>
              </div>

              {/* Decorative Map Background */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Stations;
