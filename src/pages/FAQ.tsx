import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageBreadcrumb from "@/components/PageBreadcrumb";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: { category: string; items: FAQItem[] }[] = [
  {
    category: "Ordering & Shipping",
    items: [
      {
        question: "Where do you ship?",
        answer:
          "We ship across Canada, the United States, and Mexico. Most Canadian orders arrive within 3–7 business days. US and MX orders typically take 5–10 business days depending on the destination.",
      },
      {
        question: "How much does shipping cost?",
        answer:
          "Orders over $75 CAD ship free within Canada. Orders under $75 CAD have a flat $9.99 shipping fee. US and MX shipping rates are calculated at checkout based on weight and destination.",
      },
      {
        question: "How do I track my order?",
        answer:
          "Once your order ships you will receive a confirmation email with a tracking number. You can also log in to your account at any time to view order status.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "Orders can be changed or cancelled within 2 hours of placement. After that, the order may already be in processing. Contact us at sales@daneauto.ca or call 1-(204) 599-4562 as soon as possible.",
      },
    ],
  },
  {
    category: "Parts & Fitment",
    items: [
      {
        question: "How do I know a part fits my vehicle?",
        answer:
          "Use the vehicle search on the Shop page — enter your year, make, and model to filter parts that fit your specific vehicle. Every part listing also shows the OEM and Partslink number for cross-reference.",
      },
      {
        question: "Are your parts OEM or aftermarket?",
        answer:
          "We carry high-quality aftermarket collision and body parts. Many are CAPA certified, which means they meet the same fit, finish, and performance standards as original equipment manufacturer (OEM) parts.",
      },
      {
        question: "What does CAPA certified mean?",
        answer:
          "CAPA (Certified Automotive Parts Association) certification means the part has been independently tested and verified to meet OEM quality and safety standards for fit, finish, and performance. Look for the CAPA badge on product listings.",
      },
      {
        question: "I can't find the part I need. What should I do?",
        answer:
          "Contact us directly — we may be able to source it. Use the Contact page and include your vehicle year, make, model, and the OEM part number if you have it. We'll get back to you within one business day.",
      },
      {
        question: "What is a Partslink number?",
        answer:
          "Partslink is an industry-standard cross-reference numbering system for automotive collision parts. It lets you identify the exact same part across different brands and suppliers. You can search by Partslink number on our Shop page.",
      },
    ],
  },
  {
    category: "Returns & Warranty",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We accept returns within 30 days of delivery for unused parts in original packaging. Parts that have been installed, modified, or damaged are not eligible for return. See our Shipping & Returns page for full details.",
      },
      {
        question: "How do I start a return?",
        answer:
          "Email us at sales@daneauto.ca with your order number and reason for return. We will provide a Return Merchandise Authorization (RMA) number and return shipping instructions within 2 business days.",
      },
      {
        question: "Do your parts come with a warranty?",
        answer:
          "Yes. All parts carry a 1-year limited warranty against defects in materials and workmanship. CAPA certified parts may carry additional coverage. Warranty does not cover installation errors, normal wear, or damage caused by collision after installation.",
      },
      {
        question: "What if my part arrives damaged?",
        answer:
          "Document the damage with photos immediately and contact us within 48 hours of delivery. We will arrange a replacement or full refund at no cost to you.",
      },
    ],
  },
  {
    category: "Payments & Pricing",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) via Stripe. All transactions are SSL encrypted and processed securely.",
      },
      {
        question: "Are prices in Canadian or US dollars?",
        answer:
          "All prices are listed in Canadian dollars (CAD). If you are ordering from the US or Mexico, your card will be charged in CAD and your bank will handle the currency conversion.",
      },
      {
        question: "Do you offer discounts for shops or bulk orders?",
        answer:
          "Yes — we work with body shops, mechanics, and fleet operators. Contact us at sales@daneauto.ca to discuss wholesale pricing and trade accounts.",
      },
    ],
  },
  {
    category: "Account & Technical",
    items: [
      {
        question: "Do I need an account to order?",
        answer:
          "No. You can check out as a guest. However, creating a free account lets you save vehicles, track orders, maintain a wishlist, and reorder quickly.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "On the Account page, click 'Forgot password?' and enter your email address. You will receive a reset link within a few minutes. Check your spam folder if you don't see it.",
      },
    ],
  },
];

const FAQ = () => {
  usePageTitle(
    "FAQ",
    "Frequently asked questions about ordering, shipping, returns, fitment, and parts at Dane Auto Parts Ltd."
  );
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => setOpen(open === key ? null : key);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <PageBreadcrumb segments={[{ label: "FAQ" }]} className="mb-6" />
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground">
            Can't find your answer? <Link to="/contact" className="text-primary hover:underline">Contact us</Link> — we respond within one business day.
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-display text-xl font-bold mb-4 text-primary border-b border-border pb-2">
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const key = `${section.category}-${item.question}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-secondary/20 transition-colors"
                        onClick={() => toggle(key)}
                      >
                        <span className="font-semibold text-sm md:text-base pr-4">{item.question}</span>
                        {isOpen
                          ? <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                          : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-card rounded-xl border border-border p-8 text-center">
          <h2 className="font-display text-xl font-bold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Our team is available Monday–Friday 8AM–6PM CT and Saturday 9AM–4PM CT.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button variant="hero">Contact Us</Button>
            </Link>
            <a href="tel:+12045994562">
              <Button variant="outline">1-(204) 599-4562</Button>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQ;
