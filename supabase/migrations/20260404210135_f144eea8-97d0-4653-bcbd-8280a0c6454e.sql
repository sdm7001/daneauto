CREATE TABLE public.chat_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view chat notes"
  ON public.chat_notes FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert chat notes"
  ON public.chat_notes FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update chat notes"
  ON public.chat_notes FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete chat notes"
  ON public.chat_notes FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_chat_notes_conversation ON public.chat_notes(conversation_id);