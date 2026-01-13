import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="max-w-xl space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              <span>Kenya's #1 LPG Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Get <span className="text-gradient-flame">Gas</span> Delivered
              <br />
              To Your Hostel
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground leading-relaxed md:text-xl">
              Buy, refill, and compare LPG gas prices from verified sellers near your campus. 
              Fast delivery, secure M-Pesa payments, and student-friendly prices.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/marketplace">
                <Button variant="hero" className="group w-full sm:w-auto">
                  Buy Gas Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/stations">
                <Button variant="hero-outline" className="w-full sm:w-auto">
                  <MapPin className="h-5 w-5" />
                  Find Stations
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Verified Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-gradient-flame"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">5,000+ Students Trust Us</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative animate-float">
              {/* Main Card */}
              <div className="rounded-3xl bg-gradient-card p-8 shadow-elevated">
                <div className="aspect-square rounded-2xl bg-gradient-flame flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <div className="text-6xl mb-4">🔥</div>
                    <p className="font-display text-2xl font-bold">6kg Gas</p>
                    <p className="text-lg opacity-90">From KES 1,200</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-lg">Quick Delivery</p>
                    <p className="text-sm text-muted-foreground">Within 2 hours</p>
                  </div>
                  <Button variant="flame" size="sm">
                    Order
                  </Button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-4 top-8 rounded-2xl bg-background p-4 shadow-elevated animate-pulse-slow">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Verified</p>
                    <p className="text-xs text-muted-foreground">Seller</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-8 bottom-20 rounded-2xl bg-background p-4 shadow-elevated">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Near UoN</p>
                    <p className="text-xs text-muted-foreground">2.5 km away</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
