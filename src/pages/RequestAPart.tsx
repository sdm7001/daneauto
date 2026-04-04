import { useState } from "react";
import { Search, CheckCircle } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const YEARS = Array.from({ length: 35 }, (_, i) => String(2024 - i));

const RequestAPart = () => {
  usePageTitle(
    "Request a Part",
    "Can't find the collision part you need? Submit a part request and we'll source it for you."
  );

  const [form, setForm] = useState({
    year: "",
    make: "",
    model: "",
    trim: "",
    partDescription: "",
    oemNumber: "",
    partslink: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.partDescription) return;
    setSubmitting(true);
    try {
      const message = [
        `PART REQUEST`,
        ``,
        `Vehicle: ${[form.year, form.make, form.model, form.trim].filter(Boolean).join(" ")}`,
        `Part needed: ${form.partDescription}`,
        form.oemNumber ? `OEM part number: ${form.oemNumber}` : "",
        form.partslink ? `Partslink number: ${form.partslink}` : "",
        form.phone ? `Phone: ${form.phone}` : "",
        form.notes ? `Additional notes: ${form.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        subject: "Part Request",
        message,
        status: "new",
      });

      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
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
          <h1 className="font-display text-3xl font-bold mb-3">Request Received</h1>
          <p className="text-muted-foreground mb-6">
            We've received your part request and will get back to you within one business day.
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
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Request a <span className="text-primary">Part</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Can't find what you need in our catalog? We source parts across North America.
            Fill out the form and we'll get back to you within one business day.
          </p>
        </div>

        <div className="bg-gradient-card rounded-xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Vehicle info */}
            <div>
              <h2 className="font-display text-lg font-bold mb-4 text-primary">Vehicle Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select
                    value={form.year}
                    onChange={set("year")}
                    className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select year</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Make</label>
                  <Input placeholder="e.g. Toyota" value={form.make} onChange={set("make")} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <Input placeholder="e.g. Camry" value={form.model} onChange={set("model")} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trim (optional)</label>
                  <Input placeholder="e.g. LE, SE, XLE" value={form.trim} onChange={set("trim")} />
                </div>
              </div>
            </div>

            {/* Part info */}
            <div>
              <h2 className="font-display text-lg font-bold mb-4 text-primary">Part Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Part Description <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Front bumper cover, driver-side headlamp"
                    value={form.partDescription}
                    onChange={set("partDescription")}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">OEM Part Number (if known)</label>
                    <Input placeholder="e.g. 52119-06902" value={form.oemNumber} onChange={set("oemNumber")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Partslink Number (if known)</label>
                    <Input placeholder="e.g. TO1000123" value={form.partslink} onChange={set("partslink")} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Additional Notes</label>
                  <Textarea
                    placeholder="Any other details — colour, whether parking sensors are present, damage photos, etc."
                    value={form.notes}
                    onChange={set("notes")}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <h2 className="font-display text-lg font-bold mb-4 text-primary">Your Contact Info</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input required placeholder="Your name" value={form.name} onChange={set("name")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                    <Input type="tel" placeholder="(204) 555-0100" value={form.phone} onChange={set("phone")} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input required type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                </div>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Submit Part Request"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              We respond within one business day (Mon–Fri 8AM–6PM CT). For urgent requests, call{" "}
              <a href="tel:+12045994562" className="text-primary hover:underline">1-(204) 599-4562</a>.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default RequestAPart;
