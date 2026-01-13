import { MapPin, ShieldCheck, CreditCard, Truck, Star, Users } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Campus Locations",
    description: "Find gas sellers and refill stations near all major universities and colleges in Kenya.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ShieldCheck,
    title: "Verified Sellers",
    description: "Every seller is verified for safety and quality. Check ratings and reviews before buying.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: CreditCard,
    title: "M-Pesa & Cards",
    description: "Pay securely with M-Pesa, Paystack, or card. All transactions are encrypted and protected.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your gas delivered within hours. Track your order in real-time from purchase to delivery.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Star,
    title: "Best Prices",
    description: "Compare prices across sellers to get the best deals. Student discounts available.",
    color: "text-accent",
    bg: "bg-accent/20",
  },
  {
    icon: Users,
    title: "Community Trust",
    description: "Join 5,000+ students who trust GasBora for their cooking gas needs.",
    color: "text-forest",
    bg: "bg-forest/10",
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Why Students Choose <span className="text-gradient-flame">GasBora</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We make getting cooking gas easy, affordable, and safe for university students across Kenya.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-background p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
