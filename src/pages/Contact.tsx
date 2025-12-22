import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "(123) 456-7890",
      link: "tel:+1234567890",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@daneautoparts.com",
      link: "mailto:info@daneautoparts.com",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Auto Parts Drive\nIndustrial District, NY 10001",
    },
    {
      icon: Clock,
      title: "Hours",
      value: "Mon-Fri: 8AM - 6PM\nSat: 9AM - 4PM",
    },
  ];

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question or need help finding a part? We're here to assist you. Reach out to our team today.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="bg-gradient-card rounded-xl border border-border p-6 flex gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">
                    {item.title}
                  </h3>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-muted-foreground hover:text-primary transition-colors whitespace-pre-line"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-gradient-card rounded-xl border border-border p-8"
            >
              <h2 className="font-display text-2xl font-bold mb-6">
                Send Us a Message
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  placeholder="Tell us more about what you're looking for..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" variant="hero" size="lg">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
