import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { 
  LayoutDashboard, Users, Mail, Package, TrendingUp, DollarSign, 
  UserCheck, Clock, Send, Edit, ArrowLeft, Upload, FileUp, CheckCircle2, AlertCircle,
  MessageCircle, Archive, Eye, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  emails_sent: number;
  recent_orders: Array<{
    id: string;
    user_id: string;
    status: string;
    total: number;
    created_at: string;
  }>;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  email?: string;
  created_at: string;
}

interface EmailLog {
  id: string;
  subject: string;
  recipient_count: number;
  status: string;
  created_at: string;
}

type AdminTab = "dashboard" | "users" | "emails" | "messages" | "chats" | "import";

interface ChatConversation {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  messages: any;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  usePageTitle("Admin");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  
  // Dashboard state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Users state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  
  // Email state
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [emailForm, setEmailForm] = useState({ subject: "", body: "" });
  const [sendingEmail, setSendingEmail] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  // Chat conversations state
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  const [chatFilter, setChatFilter] = useState<"all" | "new" | "archived">("all");
  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    inserted: number;
    skipped: number;
    failed_batches: number;
    total_rows: number;
    errors?: string[];
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/account");
    } else if (user) {
      checkAdminRole();
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "dashboard") fetchStats();
      if (activeTab === "users") fetchUsers();
      if (activeTab === "emails") fetchEmailLogs();
      if (activeTab === "messages") fetchMessages();
    }
  }, [isAdmin, activeTab]);

  const checkAdminRole = async () => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user?.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Error checking admin role:", error);
      toast.error("Failed to verify admin access");
      navigate("/");
      return;
    }

    if (!data) {
      toast.error("Admin access required");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setCheckingAdmin(false);
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    const { data, error } = await supabase.rpc("get_admin_stats");
    
    if (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
    } else if (data) {
      setStats(data as unknown as AdminStats);
    }
    setLoadingStats(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } else {
      setUsers(data || []);
    }
    setLoadingUsers(false);
  };

  const fetchEmailLogs = async () => {
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching email logs:", error);
    } else {
      setEmailLogs(data || []);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMessages(data);
    setLoadingMessages(false);
  };

  const markMessageRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ status: "read" }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: "read" } : m));
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append("file", importFile);

      const { data: { session } } = await supabase.auth.getSession();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/import-products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: formData,
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Import failed");
      setImportResult(result);
      toast.success(`Imported ${result.inserted} products!`);
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editingUser.full_name,
        phone: editingUser.phone,
      })
      .eq("id", editingUser.id);

    if (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } else {
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.subject || !emailForm.body) {
      toast.error("Please fill in subject and body");
      return;
    }

    setSendingEmail(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("send-email", {
        body: {
          subject: emailForm.subject,
          body: emailForm.body,
          send_to_all: true,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success(`Email sent to ${response.data.sent} users!`);
      setEmailForm({ subject: "", body: "" });
      fetchEmailLogs();
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error(error.message || "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading || checkingAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Manage your store</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="bg-gradient-card rounded-xl border border-border p-4 space-y-2 sticky top-24">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "users"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Users className="w-5 h-5" />
                Users
              </button>
              <button
                onClick={() => setActiveTab("emails")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "emails"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Mail className="w-5 h-5" />
                Emails
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "messages"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Edit className="w-5 h-5" />
                Messages
                {messages.filter(m => m.status === "new").length > 0 && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {messages.filter(m => m.status === "new").length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("import")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "import"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Upload className="w-5 h-5" />
                Import
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {loadingStats ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : stats ? (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-card rounded-xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">Total Users</span>
                        </div>
                        <p className="font-display text-3xl font-bold">{stats.total_users}</p>
                      </div>

                      <div className="bg-gradient-card rounded-xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">Total Orders</span>
                        </div>
                        <p className="font-display text-3xl font-bold">{stats.total_orders}</p>
                      </div>

                      <div className="bg-gradient-card rounded-xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">Revenue</span>
                        </div>
                        <p className="font-display text-3xl font-bold">
                          ${Number(stats.total_revenue).toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-gradient-card rounded-xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-accent" />
                          </div>
                          <span className="text-muted-foreground text-sm">Pending</span>
                        </div>
                        <p className="font-display text-3xl font-bold">{stats.pending_orders}</p>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-card rounded-xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <UserCheck className="w-5 h-5 text-primary" />
                          <h3 className="font-display font-semibold">Completed Orders</h3>
                        </div>
                        <p className="font-display text-4xl font-bold text-primary">
                          {stats.completed_orders}
                        </p>
                      </div>

                      <div className="bg-gradient-card rounded-xl border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Mail className="w-5 h-5 text-primary" />
                          <h3 className="font-display font-semibold">Emails Sent</h3>
                        </div>
                        <p className="font-display text-4xl font-bold text-primary">
                          {stats.emails_sent}
                        </p>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-gradient-card rounded-xl border border-border p-6">
                      <h3 className="font-display text-xl font-semibold mb-4">Recent Orders</h3>
                      {stats.recent_orders && stats.recent_orders.length > 0 ? (
                        <div className="space-y-3">
                          {stats.recent_orders.map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                            >
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  #{order.id.slice(0, 8)}
                                </p>
                                <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                  order.status === "completed" ? "bg-primary/20 text-primary" :
                                  order.status === "pending" ? "bg-accent/20 text-accent" :
                                  "bg-secondary text-foreground"
                                }`}>
                                  {order.status}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No orders yet</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Failed to load statistics</p>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="bg-gradient-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-6">User Management</h2>
                  
                  {loadingUsers ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : users.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No users found</p>
                  ) : (
                    <div className="space-y-4">
                      {users.map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">
                              {profile.full_name || "No name set"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {profile.phone || "No phone"} • Joined {new Date(profile.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(profile)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Edit User Modal */}
                {editingUser && (
                  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md">
                      <h3 className="font-display text-xl font-bold mb-4">Edit User</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <Input
                            value={editingUser.full_name || ""}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, full_name: e.target.value })
                            }
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <Input
                            value={editingUser.phone || ""}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, phone: e.target.value })
                            }
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setEditingUser(null)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateUser} className="flex-1">
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="space-y-4">
                <div className="bg-gradient-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-6">Contact Form Submissions</h2>

                  {loadingMessages ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No messages yet</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`rounded-lg border p-4 transition-colors ${msg.status === "new" ? "border-primary/40 bg-primary/5" : "border-border bg-secondary/20"}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{msg.name}</span>
                                <a href={`mailto:${msg.email}`} className="text-primary text-sm hover:underline">{msg.email}</a>
                                {msg.phone && <span className="text-muted-foreground text-sm">{msg.phone}</span>}
                                {msg.status === "new" && (
                                  <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                                )}
                              </div>
                              <p className="font-medium text-sm mt-1">{msg.subject}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{new Date(msg.created_at).toLocaleString()}</p>
                              {expandedMessage === msg.id && (
                                <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap border-t border-border pt-3">{msg.message}</p>
                              )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => setExpandedMessage(expandedMessage === msg.id ? null : msg.id)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border"
                              >
                                {expandedMessage === msg.id ? "Hide" : "Read"}
                              </button>
                              {msg.status === "new" && (
                                <button
                                  onClick={() => markMessageRead(msg.id)}
                                  className="text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded border border-primary/30"
                                >
                                  Mark Read
                                </button>
                              )}
                              <a
                                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border"
                              >
                                Reply
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Emails Tab */}
            {activeTab === "emails" && (
              <div className="space-y-6">
                {/* Send Email Form */}
                <div className="bg-gradient-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-6">
                    Send Email to All Users
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input
                        value={emailForm.subject}
                        onChange={(e) =>
                          setEmailForm({ ...emailForm, subject: e.target.value })
                        }
                        placeholder="Enter email subject"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        value={emailForm.body}
                        onChange={(e) =>
                          setEmailForm({ ...emailForm, body: e.target.value })
                        }
                        placeholder="Write your message here..."
                        rows={6}
                      />
                    </div>
                    <Button
                      onClick={handleSendEmail}
                      disabled={sendingEmail}
                      variant="hero"
                      size="lg"
                    >
                      {sendingEmail ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send to All Users
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Email Logs */}
                <div className="bg-gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display text-lg font-semibold mb-4">Email History</h3>
                  {emailLogs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No emails sent yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {emailLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{log.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              Sent to {log.recipient_count} recipients
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              log.status === "sent" ? "bg-primary/20 text-primary" :
                              log.status === "partial" ? "bg-accent/20 text-accent" :
                              "bg-destructive/20 text-destructive"
                            }`}>
                              {log.status}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Import Tab */}
            {activeTab === "import" && (
              <div className="space-y-6">
                <div className="bg-gradient-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-2">Import Products</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Upload a CSV or JSONL file to bulk-import products into the catalog.
                  </p>

                  <div className="space-y-4">
                    {/* File picker */}
                    <label
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
                        importFile
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-secondary/30"
                      }`}
                    >
                      <FileUp className="w-10 h-10 text-muted-foreground mb-3" />
                      {importFile ? (
                        <div className="text-center">
                          <p className="font-semibold">{importFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(importFile.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="font-semibold">Choose a file or drag it here</p>
                          <p className="text-sm text-muted-foreground">CSV or JSONL, up to 200 MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".csv,.jsonl,.json"
                        className="hidden"
                        onChange={(e) => {
                          setImportFile(e.target.files?.[0] ?? null);
                          setImportResult(null);
                        }}
                      />
                    </label>

                    {/* Import button */}
                    <Button
                      onClick={handleImport}
                      disabled={!importFile || importing}
                      variant="hero"
                      size="lg"
                      className="w-full"
                    >
                      {importing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                          Importing…
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Start Import
                        </>
                      )}
                    </Button>

                    {/* Results */}
                    {importResult && (
                      <div className={`rounded-xl border p-6 ${
                        importResult.failed_batches === 0
                          ? "border-primary/40 bg-primary/5"
                          : "border-accent/40 bg-accent/5"
                      }`}>
                        <div className="flex items-center gap-3 mb-4">
                          {importResult.failed_batches === 0 ? (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-accent" />
                          )}
                          <h3 className="font-display font-semibold text-lg">Import Complete</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-primary">{importResult.inserted.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Inserted</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{importResult.total_rows.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total Rows</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{importResult.skipped}</p>
                            <p className="text-xs text-muted-foreground">Skipped</p>
                          </div>
                          <div>
                            <p className={`text-2xl font-bold ${importResult.failed_batches > 0 ? "text-destructive" : ""}`}>
                              {importResult.failed_batches}
                            </p>
                            <p className="text-xs text-muted-foreground">Failed Batches</p>
                          </div>
                        </div>
                        {importResult.errors && importResult.errors.length > 0 && (
                          <div className="mt-4 space-y-1">
                            {importResult.errors.map((err, i) => (
                              <p key={i} className="text-sm text-destructive">{err}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Format Guide */}
                <div className="bg-gradient-card rounded-xl border border-border p-6">
                  <h3 className="font-display text-lg font-semibold mb-4">File Format Guide</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium mb-2">JSONL (one JSON object per line)</p>
                      <pre className="bg-secondary/50 rounded-lg p-3 text-xs overflow-x-auto text-muted-foreground">
{`{"sku":"AB12-001","year":"2024","make":"HONDA","model":"CIVIC","product_line":"LIGHTING","list_price":89.99,"description":"Headlamp Assembly"}`}
                      </pre>
                    </div>
                    <div>
                      <p className="font-medium mb-2">CSV (comma-separated with headers)</p>
                      <pre className="bg-secondary/50 rounded-lg p-3 text-xs overflow-x-auto text-muted-foreground">
{`sku,year,make,model,product_line,list_price,description
AB12-001,2024,HONDA,CIVIC,LIGHTING,89.99,Headlamp Assembly`}
                      </pre>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Required fields: <span className="font-semibold">sku, year, make, model, product_line</span>. Optional: description, list_price, net_price, oem_number, partslink_number, image_url, certification.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;
