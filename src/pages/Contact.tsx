import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = [
  { icon: Phone, title: "Phone", value: "1-(204) 599-4562", link: "tel:+12045994562" },
  { icon: Mail, title: "Email", value: "info@daneautoparts.com", link: "mailto:info@daneautoparts.com" },
  { icon: MapPin, title: "Address", value: "1000 Henry Ave\nWinnipeg, MB R3E 3L2\nCanada" },
  { icon: Clock, title: "Hours", value: "Mon–Fri: 8AM – 6PM CT\nSat: 9AM – 4PM CT" },
];

const Contact = () => {
  usePageTitle("Contact Us", "Contact Dane Auto Parts Ltd. Located at 1000 Henry Ave, Winnipeg MB. Call 1-(204) 599-4562 for parts inquiries, orders, and support.");
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    subject: searchParams.get("subject") ?? "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      });
      if (error) throw error;
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send. Please email us at info@daneautoparts.com");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question or need help finding a part? We're here to help. Our team typically responds within one business day.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div key={item.title} className="bg-gradient-card rounded-xl border border-border p-6 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">{item.title}</h3>
                  {item.link ? (
                    <a href={item.link} className="text-muted-foreground hover:text-primary transition-colors whitespace-pre-line">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-gradient-card rounded-xl border border-border p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">Message Received!</h2>
                <p className="text-muted-foreground mb-6">
                  Thanks for reaching out. We'll get back to you within one business day.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gradient-card rounded-xl border border-border p-8">
                <h2 className="font-display text-2xl font-bold mb-6">Send Us a Message</h2>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <Input type="text" placeholder="John Doe" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input type="email" placeholder="you@example.com" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input type="tel" placeholder="(613) 555-0100" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <Input type="text" placeholder="How can we help?" value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea placeholder="Tell us more about what you're looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5} required />
                </div>

                <Button type="submit" variant="hero" size="lg" disabled={submitting}>
                  <Send className="w-4 h-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
