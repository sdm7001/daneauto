import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="font-display text-xl font-bold mb-3 text-primary">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3 text-sm md:text-base">{children}</div>
  </section>
);

const TermsOfService = () => {
  usePageTitle(
    "Terms of Service",
    "Terms and conditions for using the Dane Auto Parts Ltd. website and purchasing products."
  );

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground text-sm">Last updated: April 2026</p>
        </div>

        <div className="bg-gradient-card rounded-xl border border-border p-8">
          <Section title="Agreement to Terms">
            <p>
              By accessing or using the website at daneauto.ca (the "Site") or purchasing products from Dane Auto
              Parts Ltd. ("we", "our", "us"), you agree to be bound by these Terms of Service. If you do not
              agree to all of these terms, do not use our Site or services.
            </p>
            <p>
              We reserve the right to update these Terms at any time. Continued use of the Site after changes
              constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="Who We Are">
            <p>
              Dane Auto Parts Ltd. is a Canadian auto parts retailer registered in Manitoba, Canada. Our principal
              place of business is 1000 Henry Ave, Winnipeg, MB R3E 3L2. We sell aftermarket collision and auto
              body parts to consumers, body shops, and fleet operators.
            </p>
          </Section>

          <Section title="Products and Pricing">
            <p>
              All prices on this Site are displayed in Canadian dollars (CAD) and are subject to change without
              notice. We make every effort to ensure product descriptions and specifications are accurate, but we
              do not warrant that descriptions are error-free, complete, or current.
            </p>
            <p>
              We reserve the right to limit quantities, refuse orders, and correct pricing errors at any time.
              In the event of a pricing error, we will contact you before processing the order.
            </p>
            <p>
              Product availability is subject to change. If an item becomes unavailable after your order is
              placed, we will notify you promptly and issue a full refund for any unavailable items.
            </p>
          </Section>

          <Section title="Orders and Payment">
            <p>
              By placing an order, you represent that you are of legal age to enter a binding contract and that
              all information you provide is accurate. Your order constitutes an offer to purchase; acceptance
              occurs when we confirm shipment.
            </p>
            <p>
              Payment is processed securely through Stripe. We accept Visa, Mastercard, American Express, and
              Discover. We do not store your payment card information.
            </p>
            <p>
              You are responsible for any applicable taxes, duties, and customs charges for orders shipped
              outside Canada. We collect and remit applicable Canadian taxes (GST/HST/PST) as required.
            </p>
          </Section>

          <Section title="Shipping and Delivery">
            <p>
              Estimated delivery times are provided as a guide only and are not guaranteed. We are not liable
              for delays caused by carriers, customs, weather, or other circumstances beyond our control.
            </p>
            <p>
              Risk of loss passes to you upon delivery to the carrier. If your order is lost in transit,
              contact us within 15 days of the expected delivery date and we will investigate with the carrier.
            </p>
            <p>
              For full shipping rates and policies, see our{" "}
              <Link to="/shipping-returns" className="text-primary hover:underline">
                Shipping &amp; Returns
              </Link>{" "}
              page.
            </p>
          </Section>

          <Section title="Returns and Refunds">
            <p>
              Returns are accepted within 30 days of delivery for unused parts in original packaging, subject to
              the conditions on our{" "}
              <Link to="/shipping-returns" className="text-primary hover:underline">
                Shipping &amp; Returns
              </Link>{" "}
              page. A Return Merchandise Authorization (RMA) number is required before returning any item.
            </p>
            <p>
              Refunds are issued to the original payment method within 5–7 business days of receiving and
              inspecting the returned item. Shipping charges are non-refundable except where the return is due
              to our error or a product defect.
            </p>
          </Section>

          <Section title="Fitment and Compatibility">
            <p>
              You are responsible for verifying that a part is compatible with your specific vehicle before
              ordering. We provide vehicle fitment tools and Partslink cross-references as a convenience, but
              we do not warrant that parts will fit every vehicle configuration.
            </p>
            <p>
              Trim-level variations, regional differences, optional equipment, and aftermarket modifications may
              affect fitment. When uncertain, contact us before ordering.
            </p>
          </Section>

          <Section title="User Accounts">
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activity under your account. Notify us immediately if you suspect unauthorized access.
            </p>
            <p>
              We reserve the right to terminate accounts, cancel orders, or refuse service at our discretion,
              including for suspected fraudulent activity or abuse of our policies.
            </p>
          </Section>

          <Section title="Intellectual Property">
            <p>
              All content on this Site — including text, images, product descriptions, logos, and software — is
              the property of Dane Auto Parts Ltd. or its licensors and is protected by Canadian and
              international copyright and trademark laws.
            </p>
            <p>
              You may not reproduce, distribute, or create derivative works from our content without express
              written permission. Product images may include manufacturer trademarks for identification purposes
              only.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, Dane Auto Parts Ltd. shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising from your use of
              our products or services.
            </p>
            <p>
              Our total liability to you for any claim arising from a purchase shall not exceed the amount you
              paid for the specific product giving rise to the claim.
            </p>
            <p>
              We do not warrant that parts will be suitable for a particular purpose beyond their described
              vehicle application. Improper installation that results in vehicle damage is outside the scope
              of our liability.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms are governed by the laws of the Province of Manitoba and the federal laws of Canada
              applicable therein, without regard to conflict of law principles. Any disputes shall be resolved
              in the courts of Winnipeg, Manitoba.
            </p>
          </Section>

          <Section title="Consumer Protection">
            <p>
              Nothing in these Terms limits any rights you may have under applicable Canadian consumer
              protection legislation, including the Consumer Protection Act (Manitoba) or equivalent provincial
              legislation. Statutory consumer rights are unaffected by these Terms.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>For questions about these Terms:</p>
            <ul className="list-none space-y-1 pl-2">
              <li>
                <strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:sales@daneauto.ca" className="text-primary hover:underline">
                  sales@daneauto.ca
                </a>
              </li>
              <li>
                <strong className="text-foreground">Phone:</strong> 1-(204) 599-4562
              </li>
              <li>
                <strong className="text-foreground">Mail:</strong> Dane Auto Parts Ltd., 1000 Henry Ave,
                Winnipeg, MB R3E 3L2
              </li>
            </ul>
          </Section>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;
