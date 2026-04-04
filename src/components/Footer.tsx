import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Footer = forwardRef<HTMLElement>((_, ref) => {
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
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "Request a Part", path: "/request-a-part" },
    { name: "Shipping & Returns", path: "/shipping-returns" },
    { name: "My Account", path: "/account" },
  ];

  return (
    <footer ref={ref} className="bg-card border-t border-border">
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
            {/* Social links */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.facebook.com/daneauto"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/daneautoparts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@daneautoparts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="hsl(var(--background))" />
                </svg>
              </a>
            </div>
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
                <span>1000 Henry Ave, Winnipeg, MB R3E 3L2</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+12045994562" className="hover:text-primary transition-colors">1-(204) 599-4562</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:sales@daneauto.ca" className="hover:text-primary transition-colors">
                  sales@daneauto.ca
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
            <div className="flex flex-wrap gap-6 justify-center md:justify-end">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/shipping-returns" className="hover:text-primary transition-colors">Shipping & Returns</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
