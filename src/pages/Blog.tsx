import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import PageBreadcrumb from "@/components/PageBreadcrumb";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "oem-vs-aftermarket-parts",
    title: "OEM vs Aftermarket Parts: What's the Difference and Which Should You Choose?",
    excerpt:
      "When it comes to collision repair, the choice between OEM and aftermarket parts can affect your insurance claim, your vehicle's resale value, and your wallet. We break down the facts.",
    date: "April 3, 2026",
    readTime: "6 min read",
    category: "Buying Guide",
    author: "Dane Auto Parts Team",
  },
  {
    slug: "what-is-capa-certification",
    title: "What Is CAPA Certification and Why Does It Matter?",
    excerpt:
      "CAPA-certified parts are independently tested to meet OEM fit, finish, and safety standards. Here's what that means for your repair and why body shops rely on the CAPA badge.",
    date: "March 28, 2026",
    readTime: "4 min read",
    category: "Education",
    author: "Dane Auto Parts Team",
  },
  {
    slug: "how-to-find-partslink-number",
    title: "How to Find Your Vehicle's Partslink Number",
    excerpt:
      "The Partslink number is the universal ID for collision parts. Finding the right one for your vehicle ensures you order the exact correct part — every time. Here's how to look it up.",
    date: "March 20, 2026",
    readTime: "3 min read",
    category: "How-To",
    author: "Dane Auto Parts Team",
  },
  {
    slug: "fender-replacement-guide",
    title: "Fender Replacement: What to Expect and How to Prepare",
    excerpt:
      "Replacing a fender is one of the most common collision repairs. This guide walks you through what's involved, what parts you'll need, and how to get the best result.",
    date: "March 12, 2026",
    readTime: "7 min read",
    category: "How-To",
    author: "Dane Auto Parts Team",
  },
  {
    slug: "bumper-cover-buying-guide",
    title: "Bumper Cover Buying Guide: Primed, Painted, or PTM?",
    excerpt:
      "Bumper covers come in three main finishes: primed, pre-painted, and paint-to-match (PTM). Each has its pros and cons. We explain which is right for your repair situation.",
    date: "March 5, 2026",
    readTime: "5 min read",
    category: "Buying Guide",
    author: "Dane Auto Parts Team",
  },
  {
    slug: "collision-repair-checklist",
    title: "Collision Repair Parts Checklist: Everything a Body Shop Needs",
    excerpt:
      "A comprehensive checklist of the parts typically needed after a front-end or rear-end collision — from bumper covers and fenders to fog lamp brackets and radiator supports.",
    date: "February 26, 2026",
    readTime: "8 min read",
    category: "Resources",
    author: "Dane Auto Parts Team",
  },
];

const categoryColors: Record<string, string> = {
  "Buying Guide": "bg-blue-500/10 text-blue-400",
  "Education": "bg-purple-500/10 text-purple-400",
  "How-To": "bg-green-500/10 text-green-400",
  "Resources": "bg-orange-500/10 text-orange-400",
};

const Blog = () => {
  usePageTitle(
    "Blog",
    "Auto parts guides, how-tos, and industry resources from Dane Auto Parts Ltd. — Canada's collision parts specialists."
  );

  const [featured, ...rest] = blogPosts;

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Parts <span className="text-primary">Knowledge Base</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Guides, how-tos, and resources from Canada's collision parts specialists.
          </p>
        </div>

        {/* Featured post */}
        <Link to={`/blog/${featured.slug}`} className="block mb-12 group">
          <div className="bg-gradient-card rounded-xl border border-border p-8 hover:border-primary/50 transition-colors">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[featured.category] ?? "bg-primary/10 text-primary"}`}>
                {featured.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {featured.date}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {featured.readTime}
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
            <span className="text-primary font-semibold flex items-center gap-2 text-sm">
              Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Rest of posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
              <div className="bg-gradient-card rounded-xl border border-border p-6 h-full flex flex-col hover:border-primary/50 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? "bg-primary/10 text-primary"}`}>
                    {post.category}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;
