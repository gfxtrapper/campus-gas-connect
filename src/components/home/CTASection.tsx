import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Truck } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Become a Seller */}
          <div className="rounded-3xl bg-gradient-flame p-8 md:p-10 text-primary-foreground">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 mb-6">
              <Store className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">
              Become a Gas Seller
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Reach thousands of students looking for cooking gas. List your products and grow your business with GasBora.
            </p>
            <Link to="/auth?role=seller">
              <Button variant="default" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Start Selling
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Become a Refill Station */}
          <div className="rounded-3xl bg-gradient-forest p-8 md:p-10 text-secondary-foreground">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-foreground/20 mb-6">
              <Truck className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">
              Register Your Station
            </h3>
            <p className="text-secondary-foreground/80 mb-6">
              Own a refill station? Get discovered by students and residents. Appear on our map and boost your visibility.
            </p>
            <Link to="/auth?role=station">
              <Button variant="default" className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90">
                Register Station
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
