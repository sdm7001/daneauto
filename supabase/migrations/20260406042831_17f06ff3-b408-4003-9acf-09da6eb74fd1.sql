-- 1. Add admin SELECT policy on order_items
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Tighten chat_conversations INSERT to only allow anon/authenticated (not service_role bypass)
-- The existing policy is intentional for public chat, keeping as-is.

-- 3. Restrict service_role UPDATE on chat_conversations to only service_role
-- Already scoped to service_role, so this is fine.