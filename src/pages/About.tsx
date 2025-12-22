import { CheckCircle, Users, Wrench, Award } from "lucide-react";

const About = () => {
  const stats = [
    { value: "15+", label: "Years Experience" },
    { value: "50K+", label: "Happy Customers" },
    { value: "100K+", label: "Parts Sold" },
    { value: "24/7", label: "Customer Support" },
  ];

  const values = [
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description:
        "Every part we sell meets strict quality standards. We only stock genuine OEM and certified aftermarket components.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Our dedicated team is committed to helping you find the right parts and providing exceptional service.",
    },
    {
      icon: Wrench,
      title: "Expert Knowledge",
      description:
        "With decades of automotive experience, our team can help you with even the most complex parts inquiries.",
    },
    {
      icon: Award,
      title: "Best Value",
      description:
        "We offer competitive pricing without compromising on quality, plus warranty protection on all parts.",
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
            Since 2010, we've been your trusted source for quality automotive parts. Our mission is to keep your vehicle running smoothly with reliable parts and exceptional customer service.
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
              <p className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Our Story */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">
              Our <span className="text-primary">Story</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Dane Auto Parts Ltd was founded with a simple vision: to make quality auto parts accessible to everyone. What started as a small family-owned shop has grown into a trusted name in the automotive parts industry.
              </p>
              <p>
                Over the years, we've built strong relationships with top manufacturers and suppliers, allowing us to offer an extensive catalog of parts at competitive prices. Our commitment to quality and customer satisfaction has never wavered.
              </p>
              <p>
                Today, we serve thousands of customers nationwide, from DIY enthusiasts to professional mechanics. Whether you're looking for a simple replacement part or a performance upgrade, we've got you covered.
              </p>
            </div>
          </div>
          <div className="bg-gradient-card rounded-xl border border-border p-8">
            <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center">
              <Wrench className="w-24 h-24 text-primary/30" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at Dane Auto Parts
            </p>
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
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {value.title}
                  </h3>
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
