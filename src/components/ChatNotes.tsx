import { useState, useEffect } from "react";
import { StickyNote, Send, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ChatNote {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profile_name?: string;
}

export default function ChatNotes({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ChatNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async () => {
    const { data, error } = await (supabase as any)
      .from("chat_notes")
      .select("id, content, user_id, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      // Fetch profile names for note authors
      const userIds = [...new Set(data.map((n: any) => n.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds as string[]);

      const nameMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) ?? []);
      setNotes(
        data.map((n: any) => ({
          ...n,
          profile_name: nameMap.get(n.user_id) || "Admin",
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, [conversationId]);

  const addNote = async () => {
    if (!newNote.trim() || !user) return;
    setSubmitting(true);
    const { error } = await (supabase as any).from("chat_notes").insert({
      conversation_id: conversationId,
      user_id: user.id,
      content: newNote.trim(),
    });
    if (error) {
      toast.error("Failed to add note");
    } else {
      setNewNote("");
      fetchNotes();
    }
    setSubmitting(false);
  };

  const deleteNote = async (id: string) => {
    await (supabase as any).from("chat_notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="border-t border-border p-4 bg-secondary/20">
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="w-4 h-4 text-primary" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Internal Notes
        </h4>
      </div>

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mx-auto" />
      ) : (
        <>
          {notes.length > 0 && (
            <div className="space-y-2 mb-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 text-sm group relative"
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-accent">
                      {note.profile_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                      {note.user_id === user?.id && (
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add an internal note..."
              rows={2}
              className="text-sm min-h-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote();
              }}
            />
            <Button
              size="icon"
              onClick={addNote}
              disabled={submitting || !newNote.trim()}
              className="h-auto w-10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Ctrl+Enter to submit · Only visible to admins
          </p>
        </>
      )}
    </div>
  );
}
