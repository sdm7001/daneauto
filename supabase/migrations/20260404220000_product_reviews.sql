-- Product reviews table
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a review
CREATE POLICY "Anyone can insert product reviews"
  ON public.product_reviews FOR INSERT
  WITH CHECK (true);

-- Only approved reviews are publicly visible
CREATE POLICY "Public can view approved reviews"
  ON public.product_reviews FOR SELECT
  USING (status = 'approved');

-- Admins can view and manage all reviews
CREATE POLICY "Admins can view all reviews"
  ON public.product_reviews FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews"
  ON public.product_reviews FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Index for fast per-SKU lookup
CREATE INDEX product_reviews_sku_status_idx ON public.product_reviews (sku, status);
