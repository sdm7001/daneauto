import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VehicleSearch from "@/components/VehicleSearch";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import heroBg from "@/assets/hero-bg.jpg";
import { usePageTitle } from "@/hooks/usePageTitle";
import StructuredData from "@/components/StructuredData";
import RecentlyViewed from "@/components/RecentlyViewed";

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: "Dane Auto Parts Ltd",
  url: "https://daneauto.ca",
  description: "Collision and body parts for vehicles from 1961 to 2026. Shipping Canada, USA, and Mexico.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1000 Henry Ave",
    addressLocality: "Winnipeg",
    addressRegion: "MB",
    postalCode: "R3E 3L2",
    addressCountry: "CA",
  },
  email: "sales@daneauto.ca",
  telephone: "+1-204-599-4562",
  areaServed: ["CA", "US", "MX"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Auto Body Parts",
    numberOfItems: 319910,
  },
};

const Index = () => {
  usePageTitle();
  return (
    <main>
      <StructuredData data={ORG_SCHEMA} id="org" />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Auto parts workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                319,910 Auto Parts
                <br />
                <span className="text-primary">In Stock & Ready to Ship</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Canada's source for OEM-grade collision and auto body parts. 319,910 SKUs covering vehicles from 1961–2026. Search by year, make and model to find the exact part you need.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button variant="hero" size="xl">
                    Shop All Parts
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="xl">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <VehicleSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <CategoryGrid />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-card rounded-2xl border border-border p-8 md:p-12 text-center shadow-elevated">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team is ready to help you find the exact parts you need. Contact us and we'll source it for you.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Contact Us Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
