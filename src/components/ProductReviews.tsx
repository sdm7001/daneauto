import { useState } from "react";
import { Star, ThumbsUp, CheckCircle, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  body: string;
  verified_purchase: boolean;
  created_at: string;
}

/* ─── Star display ─────────────────────────────────────────────────────────── */

function Stars({ rating, size = "sm", interactive = false, onSet }: {
  rating: number;
  size?: "sm" | "lg";
  interactive?: boolean;
  onSet?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const cls = size === "lg" ? "w-7 h-7" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} transition-colors ${
            s <= (interactive ? (hover || rating) : rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-muted-foreground/30"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onSet?.(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  );
}

/* ─── Average bar ──────────────────────────────────────────────────────────── */

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground w-4 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-secondary/40 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-muted-foreground w-6 text-right text-xs">{count}</span>
    </div>
  );
}

/* ─── Review form ──────────────────────────────────────────────────────────── */

function ReviewForm({ sku, onSubmitted }: { sku: string; onSubmitted: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", rating: 0, title: "", body: "" });
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from("product_reviews").insert({
        sku,
        reviewer_name: form.name,
        reviewer_email: form.email,
        rating: form.rating,
        title: form.title || null,
        body: form.body,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", sku] });
      toast.success("Thanks! Your review is pending approval.");
      onSubmitted();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
      className="bg-gradient-card rounded-xl border border-border p-6 space-y-4"
    >
      <h3 className="font-display text-lg font-bold">Write a Review</h3>

      <div>
        <label className="block text-sm font-medium mb-2">Your Rating <span className="text-destructive">*</span></label>
        <Stars rating={form.rating} size="lg" interactive onSet={(r) => setForm((p) => ({ ...p, rating: r }))} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name <span className="text-destructive">*</span></label>
          <Input required placeholder="Your name" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email <span className="text-destructive">*</span></label>
          <Input required type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
          <p className="text-xs text-muted-foreground mt-1">Not published</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Review Title</label>
        <Input placeholder="Summarise your experience" value={form.title} onChange={set("title")} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Review <span className="text-destructive">*</span></label>
        <Textarea
          required
          placeholder="How was fitment? Quality? Did it solve your problem?"
          rows={4}
          value={form.body}
          onChange={set("body")}
        />
      </div>

      <Button
        type="submit"
        variant="hero"
        disabled={mutation.isPending || form.rating === 0}
        className="w-full sm:w-auto"
      >
        <Send className="w-4 h-4 mr-2" />
        {mutation.isPending ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */

export default function ProductReviews({ sku }: { sku: string }) {
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["reviews", sku],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("product_reviews")
        .select("id, reviewer_name, rating, title, body, verified_purchase, created_at")
        .eq("sku", sku)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  if (isLoading) {
    return <div className="text-muted-foreground text-sm animate-pulse py-8 text-center">Loading reviews…</div>;
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col items-center justify-center bg-gradient-card rounded-xl border border-border px-10 py-6 shrink-0 text-center">
          <span className="text-5xl font-bold font-display">{reviews.length ? avgRating.toFixed(1) : "—"}</span>
          <Stars rating={Math.round(avgRating)} />
          <span className="text-sm text-muted-foreground mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        </div>
        {reviews.length > 0 && (
          <div className="flex-1 flex flex-col justify-center space-y-2">
            {dist.map((d) => (
              <RatingBar key={d.star} label={String(d.star)} count={d.count} total={reviews.length} />
            ))}
          </div>
        )}
      </div>

      {/* Write review CTA */}
      {!showForm && (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          <Star className="w-4 h-4 mr-2" /> Write a Review
        </Button>
      )}

      {showForm && (
        <ReviewForm sku={sku} onSubmitted={() => setShowForm(false)} />
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="bg-gradient-card rounded-xl border border-border p-8 text-center">
          <ThumbsUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-gradient-card rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <Stars rating={r.rating} />
                  {r.title && <p className="font-semibold mt-1">{r.title}</p>}
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <span>{r.reviewer_name}</span>
                  {r.verified_purchase && (
                    <span className="flex items-center gap-1 text-green-400 justify-end mt-0.5">
                      <CheckCircle className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                  <p className="mt-0.5">{new Date(r.created_at).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
