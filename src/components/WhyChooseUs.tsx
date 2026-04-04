import { Truck, Shield, Globe, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping Over $75 CAD",
    description: "Free delivery on orders $75+ CAD. Flat-rate shipping on smaller orders.",
  },
  {
    icon: Shield,
    title: "OEM-Grade Quality",
    description: "Every part meets OEM specifications. Partslink and OEM cross-references included.",
  },
  {
    icon: Globe,
    title: "Canada · USA · Mexico",
    description: "We ship across North America. Secure checkout in CAD via Stripe.",
  },
  {
    icon: Award,
    title: "319,910 Parts In Stock",
    description: "Collision and body parts covering vehicles from 1961 to 2026.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Dane Auto Parts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best parts and service for your vehicle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-8 bg-gradient-card rounded-xl border border-border hover:border-primary transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
