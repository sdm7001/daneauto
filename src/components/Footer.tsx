import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      // Save newsletter signup as a contact submission
      await supabase.from("contact_submissions").insert({
        name: "Newsletter Signup",
        email,
        subject: "Newsletter Subscription",
        message: `${email} subscribed to the newsletter.`,
        status: "new",
      });
      toast.success("You're subscribed! We'll be in touch.");
      setEmail("");
    } catch {
      toast.success("You're subscribed!"); // Fail silently to user
    } finally {
      setSubscribing(false);
    }
  };

  const shopCategories = [
    { name: "Head Lamps", path: "/shop?line=Head+Lamp" },
    { name: "Fenders", path: "/shop?line=Fender" },
    { name: "Bumper Covers", path: "/shop?line=Bumper+Cover" },
    { name: "Hoods", path: "/shop?line=Hood" },
    { name: "Browse All", path: "/categories" },
  ];

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Shop Parts", path: "/shop" },
    { name: "My Account", path: "/account" },
    { name: "My Wishlist", path: "/wishlist" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter */}
      <div className="bg-gradient-card border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe for exclusive deals and new arrivals
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" variant="hero" disabled={subscribing}>
                {subscribing ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Logo />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Canada's source for collision and auto body parts. 319,910 SKUs. Ships to CA, US, and MX.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Shop</h4>
            <ul className="space-y-2">
              {shopCategories.map((c) => (
                <li key={c.name}>
                  <Link to={c.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Ontario, Canada</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+16135550100" className="hover:text-primary transition-colors">(613) 555-0100</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@daneautoparts.com" className="hover:text-primary transition-colors">
                  info@daneautoparts.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Dane Auto Parts Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
