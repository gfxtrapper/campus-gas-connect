import { Search, ShoppingCart, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Compare",
    description: "Browse listings near your campus. Filter by size, brand, and price.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Add to Cart",
    description: "Select your preferred gas cylinder and add delivery details.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Pay with M-Pesa",
    description: "Complete payment securely via M-Pesa STK Push or Paystack.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Get Delivery",
    description: "Track your order and receive your gas within hours.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            How <span className="text-gradient-flame">GasBora</span> Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Getting your cooking gas has never been easier. Just 4 simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="absolute top-24 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Number Badge */}
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-flame text-primary-foreground font-display font-bold text-lg shadow-soft">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
