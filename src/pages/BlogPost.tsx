import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { blogPosts } from "./Blog";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import StructuredData from "@/components/StructuredData";

/* ─── Static post content ─────────────────────────────────────────────────── */

const postContent: Record<string, React.ReactNode> = {
  "oem-vs-aftermarket-parts": (
    <>
      <p>
        When your vehicle needs collision repair, one of the first decisions you'll face is whether to use OEM
        (Original Equipment Manufacturer) parts or aftermarket alternatives. This choice affects your insurance
        claim, your vehicle's resale value, and your out-of-pocket costs.
      </p>

      <h2>What Are OEM Parts?</h2>
      <p>
        OEM parts are manufactured by or for the original vehicle manufacturer — the same parts used when your car
        was built. They carry the automaker's logo and are sold through dealerships. Because they're guaranteed to
        fit your exact vehicle, they're often considered the gold standard for collision repair.
      </p>
      <p>
        The tradeoff? OEM parts are typically 20–60% more expensive than quality aftermarket alternatives.
      </p>

      <h2>What Are Aftermarket Parts?</h2>
      <p>
        Aftermarket parts are made by third-party manufacturers who engineer components to match or exceed OEM
        specifications. Quality varies widely — which is why certifications like CAPA matter.
      </p>
      <p>
        High-quality aftermarket parts offer comparable fit and finish at a lower price. They're widely used by
        insurance companies and reputable body shops across North America.
      </p>

      <h2>The CAPA Difference</h2>
      <p>
        Not all aftermarket parts are equal. CAPA-certified parts have been independently tested to meet the same
        fit, finish, and safety standards as OEM parts. When shopping for aftermarket collision components, look
        for the CAPA seal.
      </p>

      <h2>Which Should You Choose?</h2>
      <p>
        For most collision repairs — bumper covers, fenders, hoods, doors — quality aftermarket parts are an
        excellent choice. They cost less, fit well, and when CAPA certified, perform comparably to OEM.
      </p>
      <p>
        For safety-critical components like airbag modules or structural frame sections, OEM is generally
        recommended. When in doubt, ask your body shop and check with your insurance provider.
      </p>

      <h2>Insurance Considerations</h2>
      <p>
        Many insurance policies allow (or require) aftermarket parts to control costs. Some states and provinces
        have regulations around this disclosure. Always ask your adjuster what's covered under your specific
        policy.
      </p>
    </>
  ),

  "what-is-capa-certification": (
    <>
      <p>
        If you've shopped for collision parts, you've likely seen the CAPA badge. But what does it actually mean
        — and why do body shops and insurers pay attention to it?
      </p>

      <h2>What Is CAPA?</h2>
      <p>
        CAPA stands for the Certified Automotive Parts Association. It's an independent, non-profit organization
        that tests and certifies aftermarket collision parts against OEM benchmarks.
      </p>
      <p>
        Founded in 1987, CAPA was created because the aftermarket parts industry lacked quality standards.
        Insurers, body shops, and consumers had no reliable way to know whether an aftermarket bumper cover would
        actually fit — or hold up — the way an OEM part would.
      </p>

      <h2>How Does CAPA Certification Work?</h2>
      <p>
        Parts submitted for CAPA certification undergo rigorous testing including:
      </p>
      <ul>
        <li><strong>Dimensional testing</strong> — Does the part match OEM measurements exactly?</li>
        <li><strong>Material testing</strong> — Are the materials equivalent in strength and durability?</li>
        <li><strong>Fit and finish testing</strong> — Does it align properly and match paint surface standards?</li>
        <li><strong>Impact testing</strong> — For structural components, does it absorb energy correctly?</li>
      </ul>
      <p>
        Parts that pass receive a CAPA seal. CAPA also conducts ongoing market surveillance, purchasing certified
        parts from the open market to verify quality is maintained after certification.
      </p>

      <h2>Why It Matters for Your Repair</h2>
      <p>
        A CAPA-certified fender or bumper cover means a body shop can install it with confidence — knowing it will
        fit the first time and look right when painted. Poor-fitting parts require rework, which costs time and
        money.
      </p>
      <p>
        For insurance claims, CAPA certification provides documentation that an aftermarket part meets a defined
        quality standard, which can simplify approvals.
      </p>

      <h2>Look for the Badge</h2>
      <p>
        On our product listings, CAPA-certified parts are clearly marked. When quality matters, filter for CAPA
        parts — especially for visible exterior components where fit and finish are critical.
      </p>
    </>
  ),

  "how-to-find-partslink-number": (
    <>
      <p>
        The Partslink number is the universal identifier for automotive collision parts. Think of it like a VIN
        for a specific part — it ensures you get exactly the right component, regardless of which brand or
        supplier you buy from.
      </p>

      <h2>What Is a Partslink Number?</h2>
      <p>
        Partslink (also written as Parts Link or PartNumber) is an industry-standard cross-reference numbering
        system developed for the collision parts market. Every collision component — from headlamps to hoods —
        has a specific Partslink number tied to the vehicle application.
      </p>
      <p>
        Because the same number works across manufacturers and suppliers, you can use it to compare prices,
        confirm compatibility, and avoid ordering the wrong part.
      </p>

      <h2>How to Find Your Partslink Number</h2>

      <h3>Method 1: Use Our Shop</h3>
      <p>
        The easiest way is to use the vehicle selector on our Shop page. Enter your year, make, and model — the
        matching Partslink number appears on every product listing.
      </p>

      <h3>Method 2: OEM Part Number Cross-Reference</h3>
      <p>
        If you have the OEM part number (from a dealer or your old part), you can search that number directly on
        our site. Most of our listings cross-reference OEM numbers to Partslink numbers.
      </p>

      <h3>Method 3: CAPA or NSPA Databases</h3>
      <p>
        Industry databases like the NSPA (National Standard Parts Associates) catalog contain Partslink numbers
        for virtually every collision part. Body shops typically have access to these.
      </p>

      <h3>Method 4: Ask Your Body Shop</h3>
      <p>
        Any experienced body shop has access to parts lookup tools and can identify the correct Partslink number
        from your vehicle's damage assessment.
      </p>

      <h2>Why It Matters</h2>
      <p>
        Ordering by Partslink number eliminates guesswork. Instead of describing a part by appearance or
        approximate location, you have a precise identifier that maps to your exact vehicle's year, make, model,
        and trim level.
      </p>
    </>
  ),

  "fender-replacement-guide": (
    <>
      <p>
        Fender damage is one of the most common results of a side-impact collision or parking lot scrape. Whether
        you're handling the repair yourself or managing a shop order, understanding what's involved helps you
        plan better and spend less.
      </p>

      <h2>What's Involved in a Fender Replacement?</h2>
      <p>
        A fender replacement is a straightforward bolt-off / bolt-on repair in most cases. The fender mounts
        to the body at the door jamb, the strut tower, and along the hood line. No welding is typically required
        for unibody vehicles with undamaged mounting points.
      </p>
      <p>
        The full repair usually involves:
      </p>
      <ul>
        <li>Removing the headlamp, turn signal, and splash shield</li>
        <li>Unbolting the damaged fender (6–10 mounting points depending on the vehicle)</li>
        <li>Installing the new fender and adjusting alignment</li>
        <li>Reinstalling lighting components</li>
        <li>Priming, painting, and blending to match</li>
      </ul>

      <h2>Parts You May Need</h2>
      <p>
        Beyond the fender itself, a thorough repair often requires:
      </p>
      <ul>
        <li><strong>Fender liner / splash shield</strong> — often damaged in the same impact</li>
        <li><strong>Fender mounting brackets</strong> — check for bending</li>
        <li><strong>Headlamp or marker lamp</strong> — if impacted</li>
        <li><strong>Fender bolts and clips</strong> — replace rather than reuse if damaged</li>
        <li><strong>Rocker panel molding</strong> — may extend into the damaged area</li>
      </ul>

      <h2>OEM vs Aftermarket Fenders</h2>
      <p>
        Quality aftermarket fenders — especially CAPA-certified ones — fit and finish comparably to OEM. For most
        passenger cars and light trucks, aftermarket is the smart choice. Confirm the Partslink number matches
        your specific vehicle trim level, as fender design can vary by sub-model.
      </p>

      <h2>Primed vs Pre-Painted</h2>
      <p>
        Replacement fenders come primed (ready to paint) or pre-painted (exact OEM color code). Primed is the
        most common choice for body shops since they'll blend the color anyway. Pre-painted is useful for quick
        repairs or where professional painting isn't available.
      </p>

      <h2>Getting the Best Result</h2>
      <p>
        Proper panel alignment is critical. A fender that doesn't sit flush with the hood or door gap will look
        wrong even with perfect paint. Take time on adjustments before final torqueing, and check all gap
        measurements against factory specifications.
      </p>
    </>
  ),

  "bumper-cover-buying-guide": (
    <>
      <p>
        Bumper covers are among the most frequently replaced collision parts. They come in three main finish
        options — primed, pre-painted, and paint-to-match — and choosing the right one depends on how and where
        the repair will be done.
      </p>

      <h2>Primed Bumper Covers</h2>
      <p>
        A primed bumper cover arrives in a grey or black primer coat, ready to be sanded and painted. This is the
        most common option for professional body shops, which will apply base coat and clear coat as part of the
        standard repair process.
      </p>
      <p>
        <strong>Best for:</strong> Professional body shop repairs where color blending and quality finish are
        priorities. Most cost-effective when painting is already in the job scope.
      </p>

      <h2>Pre-Painted Bumper Covers</h2>
      <p>
        Pre-painted covers come finished in your vehicle's specific OEM color code. They're designed to bolt on
        with minimal additional preparation.
      </p>
      <p>
        <strong>Best for:</strong> Quick repairs, fleet operators, or situations where access to a paint booth is
        limited. Note that factory paint varies in age and sheen — perfect color match is still rare without some
        blending.
      </p>
      <p>
        <strong>Important:</strong> You must know your exact paint code (found on the door jamb sticker) to order
        a pre-painted cover.
      </p>

      <h2>Paint-to-Match (PTM) Bumper Covers</h2>
      <p>
        Paint-to-match covers come in a paint-ready black or unpainted TPO plastic. Unlike primed, these may not
        require sanding before painting, depending on the product. They fall between primed and pre-painted in
        the finishing workflow.
      </p>
      <p>
        <strong>Best for:</strong> Shops with a preference for a clean painting surface without the primer
        removal step. Common in volume collision centers.
      </p>

      <h2>Material: TPO vs PP</h2>
      <p>
        Most modern bumper covers are made of TPO (Thermoplastic Olefin) or PP (Polypropylene). Both are durable
        and paintable. TPO is more flexible and impact-resistant, which is why it's the OEM standard on most
        vehicles.
      </p>
      <p>
        When buying aftermarket, confirm the material matches OEM to ensure the paint adhesion primer is
        compatible.
      </p>

      <h2>What to Check Before Ordering</h2>
      <ul>
        <li>Confirm the Partslink number for your exact year/make/model/trim</li>
        <li>Note whether your bumper has parking sensors, camera cutouts, or fog lamp openings</li>
        <li>Check if the tow hook cover hole matches your vehicle's configuration</li>
        <li>Verify CAPA certification if quality assurance is a priority</li>
      </ul>
    </>
  ),

  "collision-repair-checklist": (
    <>
      <p>
        A thorough parts order before a collision repair starts saves the shop — and the customer — time and
        money. Here's what to check for after a front-end or rear-end collision.
      </p>

      <h2>Front-End Collision Parts Checklist</h2>

      <h3>Bumper System</h3>
      <ul>
        <li>Front bumper cover (primed, painted, or PTM)</li>
        <li>Bumper reinforcement / impact bar</li>
        <li>Bumper absorber / energy absorber foam</li>
        <li>Bumper brackets (left and right)</li>
        <li>Tow hook cover (if applicable)</li>
        <li>Fog lamp assemblies</li>
        <li>Fog lamp bezels / trim</li>
      </ul>

      <h3>Grille & Hood</h3>
      <ul>
        <li>Grille assembly or upper grille insert</li>
        <li>Grille surround / molding</li>
        <li>Hood (if damaged)</li>
        <li>Hood hinges (inspect for bending)</li>
        <li>Hood latch and safety catch</li>
        <li>Hood insulation pad</li>
      </ul>

      <h3>Lighting</h3>
      <ul>
        <li>Headlamp assemblies (left and/or right)</li>
        <li>Turn signal assemblies</li>
        <li>Daytime running light (DRL) modules</li>
        <li>Headlamp brackets and adjustment screws</li>
      </ul>

      <h3>Cooling & Structural</h3>
      <ul>
        <li>Radiator support / core support</li>
        <li>Upper and lower tie bars</li>
        <li>Condenser support brackets</li>
        <li>Splash shields and air deflectors</li>
      </ul>

      <h3>Fenders (if applicable)</h3>
      <ul>
        <li>Fender panel (left and/or right)</li>
        <li>Fender liner / inner splash shield</li>
        <li>Fender mounting bolts and clips</li>
        <li>Rocker panel extensions</li>
      </ul>

      <h2>Rear-End Collision Parts Checklist</h2>

      <h3>Bumper System</h3>
      <ul>
        <li>Rear bumper cover</li>
        <li>Rear bumper reinforcement</li>
        <li>Rear bumper absorber</li>
        <li>Trailer hitch receiver cover (if applicable)</li>
        <li>Rear reflectors and step pad (trucks/SUVs)</li>
      </ul>

      <h3>Trunk & Tail</h3>
      <ul>
        <li>Trunk lid or liftgate (if damaged)</li>
        <li>Trunk latch and struts</li>
        <li>License plate lamp housing</li>
        <li>Trunk spoiler (if present)</li>
      </ul>

      <h3>Lighting</h3>
      <ul>
        <li>Tail lamp assemblies (left and/or right)</li>
        <li>Backup lamp assemblies</li>
        <li>Third brake light (CHMSL)</li>
        <li>Marker lamps</li>
      </ul>

      <h2>Hardware & Consumables</h2>
      <p>
        Always order these alongside panels — they're cheap and routinely damaged:
      </p>
      <ul>
        <li>Plastic clips and push pins (bumper cover mounting)</li>
        <li>Grommets and seals</li>
        <li>Mounting bolts and nuts</li>
        <li>Weatherstripping (if damaged)</li>
      </ul>

      <h2>Before You Order</h2>
      <p>
        Cross-reference every part by Partslink number against the vehicle's year, make, model, and trim level.
        Sub-models (e.g., Sport vs. Base, with sensors vs. without) often use different part numbers. Confirm
        before ordering to avoid returns.
      </p>
    </>
  ),
};

/* ─── Category color map ───────────────────────────────────────────────────── */

const categoryColors: Record<string, string> = {
  "Buying Guide": "bg-blue-500/10 text-blue-400",
  "Education": "bg-purple-500/10 text-purple-400",
  "How-To": "bg-green-500/10 text-green-400",
  "Resources": "bg-orange-500/10 text-orange-400",
};

/* ─── Component ────────────────────────────────────────────────────────────── */

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  usePageTitle(
    post?.title ?? "Article Not Found",
    post?.excerpt ?? "Dane Auto Parts Ltd. — Canada's collision parts specialists."
  );

  const articleSchema = post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.image,
    wordCount: post.readTime ? parseInt(post.readTime) * 200 : undefined,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://daneauto.ca",
    },
    publisher: {
      "@type": "Organization",
      name: "Dane Auto Parts Ltd",
      url: "https://daneauto.ca",
      logo: { "@type": "ImageObject", url: "https://daneauto.ca/favicon.ico" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://daneauto.ca/blog/${post.slug}` },
  } : null;

  if (!post) {
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">That article doesn't exist or may have moved.</p>
          <Link to="/blog"><Button variant="hero">Back to Blog</Button></Link>
        </div>
      </main>
    );
  }

  const content = postContent[post.slug];

  /* Related posts — up to 3 others in same category, else any */
  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.category === post.category ? -1 : 1) - (b.category === post.category ? -1 : 1))
    .slice(0, 3);

  return (
    <main className="min-h-screen py-8">
      {articleSchema && <StructuredData data={articleSchema} id="article" />}
      <div className="container mx-auto px-4 max-w-3xl">
        <PageBreadcrumb
          segments={[
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category] ?? "bg-primary/10 text-primary"}`}
            >
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" /> {post.author}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{post.excerpt}</p>
        </div>

        {/* Article body */}
        <div className="bg-gradient-card rounded-xl border border-border p-8 mb-10 prose-article">
          {content ?? (
            <p className="text-muted-foreground italic">Full article coming soon.</p>
          )}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-4">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="group">
                  <div className="bg-gradient-card rounded-xl border border-border p-5 h-full hover:border-primary/50 transition-colors">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[r.category] ?? "bg-primary/10 text-primary"}`}
                    >
                      {r.category}
                    </span>
                    <h3 className="font-display text-sm font-bold mt-2 mb-1 group-hover:text-primary transition-colors line-clamp-3">
                      {r.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{r.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogPost;
