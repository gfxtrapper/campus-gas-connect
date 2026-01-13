import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

const campuses = [
  { name: "University of Nairobi", location: "Nairobi", sellers: 45, abbr: "UoN" },
  { name: "JKUAT", location: "Juja", sellers: 32, abbr: "JKUAT" },
  { name: "Kenyatta University", location: "Nairobi", sellers: 38, abbr: "KU" },
  { name: "Moi University", location: "Eldoret", sellers: 25, abbr: "MU" },
  { name: "Egerton University", location: "Njoro", sellers: 18, abbr: "EU" },
  { name: "Strathmore University", location: "Nairobi", sellers: 22, abbr: "SU" },
];

export function CampusSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="rounded-3xl bg-gradient-to-br from-secondary to-forest-light p-8 md:p-12 lg:p-16">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="text-secondary-foreground">
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Gas Sellers Near Your Campus
              </h2>
              <p className="mt-4 text-secondary-foreground/80 text-lg">
                We've partnered with verified LPG sellers near all major universities in Kenya. 
                Find affordable gas options just minutes from your hostel.
              </p>
              <Link to="/stations">
                <Button variant="default" size="lg" className="mt-6 bg-background text-foreground hover:bg-background/90">
                  <MapPin className="h-5 w-5" />
                  Explore Map
                </Button>
              </Link>
            </div>

            {/* Campus Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {campuses.map((campus) => (
                <Link
                  key={campus.name}
                  to={`/stations?campus=${campus.abbr}`}
                  className="group rounded-xl bg-background/10 backdrop-blur-sm p-4 hover:bg-background/20 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/20 mb-3">
                    <span className="font-display font-bold text-sm">{campus.abbr}</span>
                  </div>
                  <p className="font-medium text-sm text-secondary-foreground line-clamp-1">
                    {campus.name}
                  </p>
                  <p className="text-xs text-secondary-foreground/70 mt-1">
                    {campus.sellers} sellers nearby
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
