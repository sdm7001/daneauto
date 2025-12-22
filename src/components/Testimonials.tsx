import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mike Johnson",
    location: "New York, NY",
    rating: 5,
    text: "Found the exact brake pads I needed for my Camry. Great prices and fast shipping. Will definitely order again!",
    vehicle: "2020 Toyota Camry",
  },
  {
    name: "Sarah Williams",
    location: "Los Angeles, CA",
    rating: 5,
    text: "The vehicle search feature made it so easy to find compatible parts. Customer service was incredibly helpful too.",
    vehicle: "2019 Honda CR-V",
  },
  {
    name: "David Chen",
    location: "Chicago, IL",
    rating: 5,
    text: "Best auto parts store online. Quality parts at competitive prices. The warranty coverage gives me peace of mind.",
    vehicle: "2021 Ford F-150",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-primary">Customers Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their auto parts needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Quote className="w-10 h-10 text-primary/30 mb-4" />
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-current" />
                ))}
              </div>
              <div>
                <p className="font-display font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.vehicle}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
