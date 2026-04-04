import { useState } from "react";
import { Building2, CheckCircle, Users, Truck, Tag, Phone } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const BUSINESS_TYPES = [
  "Auto Body Shop",
  "Collision Repair Centre",
  "Auto Dealership",
  "Fleet Operator",
  "Auto Repair Shop",
  "Insurance Company",
  "Auto Parts Retailer",
  "Other",
];

const perks = [
  { icon: Tag, title: "Trade Pricing", body: "Discounted rates on all stock, applied automatically to your account." },
  { icon: Truck, title: "Priority Shipping", body: "Orders flagged for priority processing and same-day dispatch before 2PM CT." },
  { icon: Users, title: "Dedicated Rep", body: "A dedicated account manager for quotes, sourcing, and order support." },
  { icon: Building2, title: "Net-30 Terms", body: "Qualifying accounts can apply for net-30 payment terms." },
];

const Wholesale = () => {
  usePageTitle(
    "Wholesale & Trade Accounts",
    "Apply for a Dane Auto Parts Ltd. wholesale trade account. Discounted pricing for body shops, dealers, and fleet operators."
  );

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    monthlyVolume: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const message = [
        `WHOLESALE / TRADE ACCOUNT APPLICATION`,
        ``,
        `Business: ${form.businessName}`,
        `Type: ${form.businessType}`,
        `Contact: ${form.contactName}`,
        `Phone: ${form.phone}`,
        form.website ? `Website: ${form.website}` : "",
        `Estimated monthly volume: ${form.monthlyVolume}`,
        form.message ? `Additional info: ${form.message}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const { error } = await supabase.from("contact_submissions").insert({
        name: form.contactName,
        email: form.email,
        subject: "Wholesale Account Application",
        message,
        status: "new",
      });

      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please email us directly at sales@daneauto.ca");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Application Received</h1>
          <p className="text-muted-foreground mb-6">
            We'll review your application and reach out within one business day to discuss your account setup
            and pricing.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop"><Button variant="hero">Browse Shop</Button></Link>
            <Link to="/contact"><Button variant="outline">Contact Us</Button></Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Wholesale & <span className="text-primary">Trade Accounts</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We work with body shops, dealerships, fleet operators, and repair centres across Canada. Apply for a
            trade account and get access to discounted pricing, priority shipping, and dedicated support.
          </p>
        </div>

        {/* Perks */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {perks.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-gradient-card rounded-xl border border-border p-5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold mb-1">{title}</p>
              <p className="text-muted-foreground text-sm">{body}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-card rounded-xl border border-border p-8">
              <h2 className="font-display text-xl font-bold mb-6">Apply for a Trade Account</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Business info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Business Name <span className="text-destructive">*</span>
                    </label>
                    <Input required placeholder="Acme Auto Body" value={form.businessName} onChange={set("businessName")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Business Type <span className="text-destructive">*</span>
                    </label>
                    <select
                      required
                      value={form.businessType}
                      onChange={set("businessType")}
                      className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select type</option>
                      {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contact Name <span className="text-destructive">*</span>
                  </label>
                  <Input required placeholder="Your full name" value={form.contactName} onChange={set("contactName")} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input required type="email" placeholder="you@business.com" value={form.email} onChange={set("email")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone <span className="text-destructive">*</span>
                    </label>
                    <Input required type="tel" placeholder="(204) 555-0100" value={form.phone} onChange={set("phone")} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Website (optional)</label>
                    <Input type="url" placeholder="https://yourbusiness.com" value={form.website} onChange={set("website")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Est. Monthly Parts Spend <span className="text-destructive">*</span>
                    </label>
                    <select
                      required
                      value={form.monthlyVolume}
                      onChange={set("monthlyVolume")}
                      className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select range</option>
                      <option>Under $500/month</option>
                      <option>$500 – $2,000/month</option>
                      <option>$2,000 – $5,000/month</option>
                      <option>$5,000 – $15,000/month</option>
                      <option>Over $15,000/month</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Anything else we should know?</label>
                  <Textarea
                    rows={3}
                    placeholder="Types of vehicles you service, specific part categories, special requirements…"
                    value={form.message}
                    onChange={set("message")}
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Application"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We review all applications within one business day. For immediate assistance call{" "}
                  <a href="tel:+12045994562" className="text-primary hover:underline">1-(204) 599-4562</a>.
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <h3 className="font-display text-lg font-bold mb-3">Who Qualifies?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Auto body and collision shops",
                  "Automotive dealerships",
                  "Fleet maintenance operators",
                  "Independent repair shops",
                  "Insurance appraisal firms",
                  "Auto parts retailers and distributors",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <h3 className="font-display text-lg font-bold mb-3">Already a Customer?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you've been ordering with us and want to upgrade to a trade account, just let us know.
              </p>
              <a href="tel:+12045994562">
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  1-(204) 599-4562
                </Button>
              </a>
            </div>

            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <h3 className="font-display text-lg font-bold mb-2">319,910 SKUs</h3>
              <p className="text-sm text-muted-foreground">
                Canada's largest in-catalog selection of collision and body parts. If we don't have it,{" "}
                <Link to="/request-a-part" className="text-primary hover:underline">we'll source it</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Wholesale;
