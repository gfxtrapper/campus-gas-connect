import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Grace Wanjiku",
    role: "Student, UoN",
    content: "GasBora saved me so much time! I used to walk far to find gas, now I just order from my room and it's delivered in 2 hours. M-Pesa payment is super convenient.",
    rating: 5,
    avatar: "GW",
  },
  {
    name: "Brian Ochieng",
    role: "Student, JKUAT",
    content: "The prices here are way better than what I was paying before. Plus, I can compare different sellers and choose the best deal. Highly recommend for fellow students!",
    rating: 5,
    avatar: "BO",
  },
  {
    name: "Faith Muthoni",
    role: "Hostel Manager, KU",
    content: "We order gas for multiple rooms through GasBora. The bulk discounts and reliable delivery have made our life so much easier. Great platform!",
    rating: 5,
    avatar: "FM",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Loved by <span className="text-gradient-flame">Students</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hear what students across Kenya are saying about GasBora
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="rounded-2xl bg-card p-6 shadow-card"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-flame flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
