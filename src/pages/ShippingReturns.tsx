import { usePageTitle } from "@/hooks/usePageTitle";
import { Truck, RotateCcw, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-display text-2xl font-bold mb-4 text-primary">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3 text-sm md:text-base">{children}</div>
  </section>
);

const ShippingReturns = () => {
  usePageTitle(
    "Shipping & Returns",
    "Shipping rates, delivery times, and return policy for Dane Auto Parts Ltd. Free shipping on orders over $75 CAD."
  );

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <PageBreadcrumb segments={[{ label: "Shipping & Returns" }]} className="mb-6" />
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Shipping <span className="text-primary">&</span> Returns
          </h1>
          <p className="text-muted-foreground">
            Last updated: April 2026
          </p>
        </div>

        {/* Quick summary cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: Truck, title: "Free Shipping", body: "On all Canadian orders over $75 CAD" },
            { icon: Clock, title: "Fast Delivery", body: "3–7 business days within Canada" },
            { icon: RotateCcw, title: "30-Day Returns", body: "Unused parts in original packaging" },
            { icon: Shield, title: "1-Year Warranty", body: "Against defects in materials & workmanship" },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-gradient-card rounded-xl border border-border p-5 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted-foreground text-sm">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <Section title="Shipping Rates & Times">
          <p>All prices are in Canadian dollars (CAD).</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden mt-2">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Destination</th>
                  <th className="text-left px-4 py-3 font-semibold">Order Total</th>
                  <th className="text-left px-4 py-3 font-semibold">Shipping Cost</th>
                  <th className="text-left px-4 py-3 font-semibold">Est. Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-4 py-3">Canada</td><td className="px-4 py-3">$75 CAD or more</td><td className="px-4 py-3 text-green-400 font-semibold">Free</td><td className="px-4 py-3">3–7 business days</td></tr>
                <tr><td className="px-4 py-3">Canada</td><td className="px-4 py-3">Under $75 CAD</td><td className="px-4 py-3">$9.99 CAD</td><td className="px-4 py-3">3–7 business days</td></tr>
                <tr><td className="px-4 py-3">United States</td><td className="px-4 py-3">Any</td><td className="px-4 py-3">Calculated at checkout</td><td className="px-4 py-3">5–10 business days</td></tr>
                <tr><td className="px-4 py-3">Mexico</td><td className="px-4 py-3">Any</td><td className="px-4 py-3">Calculated at checkout</td><td className="px-4 py-3">7–14 business days</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">Delivery times are estimates and do not include order processing time (1–2 business days). Remote or rural addresses may require additional time.</p>
        </Section>

        <Section title="Order Processing">
          <p>Orders placed before 2:00 PM CT on business days are typically processed and shipped the same day. Orders placed after 2:00 PM CT, on weekends, or on Canadian public holidays are processed the next business day.</p>
          <p>You will receive a shipping confirmation email with tracking information once your order has been dispatched.</p>
        </Section>

        <Section title="Damaged or Incorrect Orders">
          <p>If your order arrives damaged or you receive the wrong part, please:</p>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>Photograph the damage or incorrect item immediately upon receipt.</li>
            <li>Contact us within <strong>48 hours</strong> of delivery at <a href="mailto:sales@daneauto.ca" className="text-primary hover:underline">sales@daneauto.ca</a> or 1-(204) 599-4562.</li>
            <li>Include your order number and photos in your message.</li>
          </ol>
          <p>We will arrange a replacement shipment or full refund at no cost to you. We do not require you to return damaged items in most cases.</p>
        </Section>

        <Section title="Return Policy">
          <p>We accept returns within <strong>30 days of delivery</strong> subject to the following conditions:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Part must be unused and uninstalled.</li>
            <li>Part must be in its original packaging with all labels intact.</li>
            <li>A Return Merchandise Authorization (RMA) number is required before returning any item.</li>
          </ul>
          <p className="font-semibold text-foreground mt-2">The following items are not eligible for return:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Parts that have been installed, modified, or altered in any way.</li>
            <li>Electrical components once the packaging has been opened.</li>
            <li>Parts purchased as clearance or "minor damage" items.</li>
            <li>Custom or special-order parts.</li>
          </ul>
        </Section>

        <Section title="How to Return an Item">
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Email <a href="mailto:sales@daneauto.ca" className="text-primary hover:underline">sales@daneauto.ca</a> with your order number and reason for return.</li>
            <li>We will issue an RMA number within 2 business days.</li>
            <li>Ship the item back with the RMA number clearly marked on the outside of the package. Return shipping costs are the customer's responsibility unless the item is defective or incorrectly shipped.</li>
            <li>Once received and inspected, your refund will be processed within 5–7 business days to your original payment method.</li>
          </ol>
        </Section>

        <Section title="Warranty">
          <p>All parts sold by Dane Auto Parts Ltd. carry a <strong>1-year limited warranty</strong> against defects in materials and workmanship from the date of purchase.</p>
          <p>This warranty does not cover:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Damage caused by improper installation.</li>
            <li>Normal wear and tear.</li>
            <li>Damage caused by collision, accident, or misuse after installation.</li>
            <li>Parts modified after purchase.</li>
          </ul>
          <p>To make a warranty claim, contact us with your order number, a description of the defect, and photos. We will assess the claim and provide a replacement or refund if the defect is covered.</p>
        </Section>

        <div className="mt-8 bg-gradient-card rounded-xl border border-border p-8 text-center">
          <h2 className="font-display text-xl font-bold mb-2">Questions about your order?</h2>
          <p className="text-muted-foreground mb-6 text-sm">We're here Mon–Fri 8AM–6PM CT and Sat 9AM–4PM CT.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact"><Button variant="hero">Contact Us</Button></Link>
            <Link to="/faq"><Button variant="outline">View FAQ</Button></Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShippingReturns;
