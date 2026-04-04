import { CheckCircle, Users, Wrench, Award, Package, Globe, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const About = () => {
  usePageTitle("About Us");
  const stats = [
    { value: "319,910", label: "Parts in Catalog" },
    { value: "65+", label: "Years of Vehicles Covered" },
    { value: "3", label: "Countries Served" },
    { value: "24/7", label: "Online Ordering" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "OEM-Grade Quality",
      description:
        "Every part in our catalog meets OEM specifications. We specialize in collision and auto body components that fit right the first time.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Whether you're a collision shop, dealership, or DIY owner — our team is here to help you find the exact part you need.",
    },
    {
      icon: Wrench,
      title: "Expert Knowledge",
      description:
        "Deep expertise in collision parts covering all major makes and models from 1961 through 2026.",
    },
    {
      icon: Award,
      title: "Competitive Pricing",
      description:
        "Net pricing on 319,910 SKUs with free shipping on orders over $75 CAD across Canada, the US, and Mexico.",
    },
  ];

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">Dane Auto Parts Ltd</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Canada's source for collision and auto body parts. We carry 319,910 SKUs covering vehicles from 1961 to 2026 — with fast shipping to Canada, the US, and Mexico.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-gradient-card rounded-xl border border-border p-6 text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Our Story */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">
              What We <span className="text-primary">Specialize In</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Dane Auto Parts Ltd specializes in collision and auto body replacement parts. Our catalog covers headlamps, fenders, bumper covers, hoods, mirrors, grilles, door panels, and hundreds of other body components — all sourced to OEM standards.
              </p>
              <p>
                With 319,910 SKUs spanning vehicles from 1961 to 2026, we stock parts for virtually every make and model sold in North America. Each product includes OEM and Partslink cross-reference numbers so you can confirm fitment before ordering.
              </p>
              <p>
                Orders ship to Canada, the United States, and Mexico. Free shipping on orders over $75 CAD. Secure checkout powered by Stripe.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop">
                <Button variant="hero" size="lg">Browse Parts</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">Get in Touch</Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Package, label: "319,910 SKUs" },
              { icon: Globe, label: "CA / US / MX" },
              { icon: Truck, label: "Free Ship $75+" },
              { icon: ShieldCheck, label: "OEM Certified" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-gradient-card rounded-xl border border-border p-6 flex flex-col items-center text-center gap-3">
                <Icon className="w-8 h-8 text-primary" />
                <span className="font-display font-semibold text-sm">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">
              Our <span className="text-primary">Commitment</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-gradient-card rounded-xl border border-border p-6 flex gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
