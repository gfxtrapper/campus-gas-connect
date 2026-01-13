import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Flame, 
  Target, 
  Users, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Flame className="h-4 w-4" />
                <span>About GasBora</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Making <span className="text-gradient-flame">Cooking Gas</span> Accessible for Every Student
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                GasBora was born from a simple idea: students shouldn't have to walk far or overpay for cooking gas. 
                We're building Kenya's most trusted LPG marketplace, one campus at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Mission */}
              <div className="space-y-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-display text-3xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To revolutionize how Kenyan students access cooking gas by creating a safe, affordable, 
                  and convenient marketplace that connects verified sellers with buyers across all university campuses.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe every student deserves access to reliable cooking gas without the hassle of 
                  searching for sellers or worrying about safety and fair pricing.
                </p>
              </div>

              {/* Values */}
              <div className="space-y-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                  <Heart className="h-7 w-7 text-secondary" />
                </div>
                <h2 className="font-display text-3xl font-bold">Our Values</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { title: "Safety First", desc: "Every seller is verified for your protection" },
                    { title: "Student Focused", desc: "Built by students, for students" },
                    { title: "Fair Pricing", desc: "Transparent prices, no hidden fees" },
                    { title: "Community Trust", desc: "Building lasting relationships" },
                  ].map((value) => (
                    <div key={value.title} className="rounded-xl bg-muted/50 p-4">
                      <h3 className="font-semibold mb-1">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "5,000+", label: "Active Students" },
                { value: "200+", label: "Verified Sellers" },
                { value: "50+", label: "Refill Stations" },
                { value: "20+", label: "Campus Locations" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl font-bold text-gradient-flame md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Meet the <span className="text-gradient-flame">Team</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                A passionate group of Kenyan innovators working to solve everyday problems
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {[
                { name: "Alex Kamau", role: "Founder & CEO", avatar: "AK" },
                { name: "Sarah Wanjiru", role: "Head of Operations", avatar: "SW" },
                { name: "David Ochieng", role: "Lead Developer", avatar: "DO" },
              ].map((member) => (
                <div key={member.name} className="rounded-2xl bg-card p-6 text-center shadow-card">
                  <div className="mx-auto h-20 w-20 rounded-full bg-gradient-flame flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="font-display font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary to-forest-light">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center text-secondary-foreground">
              <h2 className="font-display text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-secondary-foreground/80 mb-8">
                Have questions? We'd love to hear from you. Reach out anytime.
              </p>

              <div className="grid gap-4 sm:grid-cols-3 mb-8">
                <div className="rounded-xl bg-secondary-foreground/10 p-4">
                  <MapPin className="h-5 w-5 mx-auto mb-2" />
                  <p className="text-sm">Nairobi, Kenya</p>
                </div>
                <div className="rounded-xl bg-secondary-foreground/10 p-4">
                  <Phone className="h-5 w-5 mx-auto mb-2" />
                  <p className="text-sm">+254 700 123 456</p>
                </div>
                <div className="rounded-xl bg-secondary-foreground/10 p-4">
                  <Mail className="h-5 w-5 mx-auto mb-2" />
                  <p className="text-sm">hello@gasbora.co.ke</p>
                </div>
              </div>

              <Link to="/contact">
                <Button className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90">
                  Contact Us
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
