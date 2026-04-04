import { usePageTitle } from "@/hooks/usePageTitle";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="font-display text-xl font-bold mb-3 text-primary">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3 text-sm md:text-base">{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  usePageTitle("Privacy Policy", "Privacy policy for Dane Auto Parts Ltd. — how we collect, use, and protect your personal information.");

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <PageBreadcrumb segments={[{ label: "Privacy Policy" }]} className="mb-6" />
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground text-sm">Last updated: April 2026</p>
        </div>

        <div className="bg-gradient-card rounded-xl border border-border p-8">
          <Section title="Who We Are">
            <p>Dane Auto Parts Ltd. ("we", "our", "us") is a Canadian auto parts retailer located at 1000 Henry Ave, Winnipeg, MB R3E 3L2. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our website at daneauto.ca.</p>
          </Section>

          <Section title="Information We Collect">
            <p>We collect the following types of information:</p>
            <p><strong className="text-foreground">Information you provide directly:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Name, email address, and phone number when you create an account or submit a contact form.</li>
              <li>Shipping and billing address when you place an order.</li>
              <li>Vehicle information (year, make, model) when you use the vehicle search or save vehicles to your account.</li>
              <li>Payment information — processed securely by Stripe. We never store your card details.</li>
            </ul>
            <p><strong className="text-foreground">Information collected automatically:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>IP address, browser type, and device information.</li>
              <li>Pages visited, search terms, and browsing behaviour on our site.</li>
              <li>Cart and wishlist contents stored in your browser's local storage.</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>To process and fulfill your orders.</li>
              <li>To communicate with you about your orders, returns, and inquiries.</li>
              <li>To send newsletters and promotional emails (only if you opted in — you can unsubscribe at any time).</li>
              <li>To improve our website and product offerings.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </Section>

          <Section title="How We Share Your Information">
            <p>We do not sell your personal information. We share information only as follows:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong className="text-foreground">Stripe</strong> — payment processing. Governed by Stripe's Privacy Policy.</li>
              <li><strong className="text-foreground">Shipping carriers</strong> — name and address shared with couriers to fulfill delivery.</li>
              <li><strong className="text-foreground">Supabase</strong> — our database and authentication provider, operating under strict data agreements.</li>
              <li><strong className="text-foreground">Legal authorities</strong> — if required by law or to protect our rights.</li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p>We use essential cookies and browser local storage to maintain your session, remember your cart, and store recently viewed products. We do not use third-party advertising cookies.</p>
            <p>You can clear cookies and local storage at any time through your browser settings. Note that clearing local storage will empty your cart and recently viewed items.</p>
          </Section>

          <Section title="Data Retention">
            <p>We retain your account information for as long as your account is active. Order records are retained for 7 years as required by Canadian tax law. Contact form submissions are retained for 2 years.</p>
            <p>You may request deletion of your account and personal data at any time by emailing <a href="mailto:sales@daneauto.ca" className="text-primary hover:underline">sales@daneauto.ca</a>. We will comply within 30 days, subject to any legal retention requirements.</p>
          </Section>

          <Section title="Your Rights (PIPEDA)">
            <p>Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Withdraw consent for non-essential use of your data.</li>
              <li>Request deletion of your data.</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:sales@daneauto.ca" className="text-primary hover:underline">sales@daneauto.ca</a>.</p>
          </Section>

          <Section title="Security">
            <p>We use industry-standard security measures including SSL/TLS encryption, secure authentication via Supabase, and PCI-compliant payment processing via Stripe. However, no method of internet transmission is 100% secure and we cannot guarantee absolute security.</p>
          </Section>

          <Section title="Children's Privacy">
            <p>Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. The updated date at the top of this page reflects when changes were last made. Continued use of our website after changes constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="Contact Us">
            <p>For any privacy-related questions or requests:</p>
            <ul className="list-none space-y-1 pl-2">
              <li><strong className="text-foreground">Email:</strong> <a href="mailto:sales@daneauto.ca" className="text-primary hover:underline">sales@daneauto.ca</a></li>
              <li><strong className="text-foreground">Phone:</strong> 1-(204) 599-4562</li>
              <li><strong className="text-foreground">Mail:</strong> Dane Auto Parts Ltd., 1000 Henry Ave, Winnipeg, MB R3E 3L2</li>
            </ul>
          </Section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
