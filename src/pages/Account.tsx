import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { User, Mail, Lock, Eye, EyeOff, LogOut, Car, Package, Settings, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SavedVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  nickname: string | null;
  is_primary: boolean;
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  created_at: string;
  items?: OrderItem[];
}

const Account = () => {
  usePageTitle("My Account");
  const { user, loading, signUp, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "vehicles" | "orders">("profile");
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      fetchVehicles();
      fetchOrders();
    }
  }, [user]);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("saved_vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setVehicles(data);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setSubmitting(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setSubmitting(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully!");
          navigate("/");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  // Logged in view
  if (user) {
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold">
                  My <span className="text-primary">Account</span>
                </h1>
                <p className="text-muted-foreground mt-1">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-border pb-4">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                onClick={() => setActiveTab("profile")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant={activeTab === "vehicles" ? "default" : "ghost"}
                onClick={() => setActiveTab("vehicles")}
              >
                <Car className="w-4 h-4 mr-2" />
                My Vehicles
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                onClick={() => setActiveTab("orders")}
              >
                <Package className="w-4 h-4 mr-2" />
                Orders
              </Button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <h2 className="font-display text-xl font-bold mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Email</label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Member Since</label>
                    <p className="text-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === "vehicles" && (
              <div className="space-y-4">
                {vehicles.length === 0 ? (
                  <div className="bg-gradient-card rounded-xl border border-border p-8 text-center">
                    <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold mb-2">No Saved Vehicles</h3>
                    <p className="text-muted-foreground mb-4">
                      Save your vehicles for faster parts searching
                    </p>
                    <Link to="/shop">
                      <Button>Shop Parts</Button>
                    </Link>
                  </div>
                ) : (
                  vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-gradient-card rounded-xl border border-border p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-display font-semibold">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        {vehicle.nickname && (
                          <p className="text-sm text-muted-foreground">{vehicle.nickname}</p>
                        )}
                      </div>
                      <Link to={`/shop?year=${vehicle.year}&make=${encodeURIComponent(vehicle.make)}&model=${encodeURIComponent(vehicle.model)}`}>
                        <Button variant="outline" size="sm">
                          Find Parts
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-gradient-card rounded-xl border border-border p-8 text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your order history will appear here
                    </p>
                    <Link to="/shop">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                      {/* Order Header */}
                      <button
                        className="w-full p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="font-display font-semibold text-lg">${Number(order.total).toFixed(2)} CAD</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            order.status === "paid" || order.status === "completed" ? "bg-green-500/20 text-green-400" :
                            order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                            order.status === "cancelled" ? "bg-destructive/20 text-destructive" :
                            "bg-secondary text-foreground"
                          }`}>
                            {order.status}
                          </span>
                          {expandedOrder === order.id
                            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>

                      {/* Order Items */}
                      {expandedOrder === order.id && (
                        <div className="border-t border-border">
                          {order.items && order.items.length > 0 ? (
                            <>
                              <div className="divide-y divide-border">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                                    <div className="w-12 h-12 rounded-lg bg-secondary/30 flex items-center justify-center shrink-0 overflow-hidden">
                                      {item.product_image
                                        ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-contain p-1" />
                                        : <ShoppingBag className="w-5 h-5 text-muted-foreground/30" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <Link to={`/product/${encodeURIComponent(item.product_id)}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                                        {item.product_name}
                                      </Link>
                                      <p className="text-xs text-muted-foreground">SKU: {item.product_id} · Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary shrink-0">
                                      ${(Number(item.price) * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="px-4 py-3 bg-secondary/10 text-xs text-muted-foreground space-y-1 border-t border-border">
                                <div className="flex justify-between"><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>{Number(order.shipping) === 0 ? "Free" : `$${Number(order.shipping).toFixed(2)}`}</span></div>
                                <div className="flex justify-between"><span>Tax</span><span>${Number(order.tax).toFixed(2)}</span></div>
                                <div className="flex justify-between font-semibold text-foreground text-sm pt-1 border-t border-border">
                                  <span>Total</span><span>${Number(order.total).toFixed(2)} CAD</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="px-4 py-3 text-sm text-muted-foreground">No item details available.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Login/Signup form
  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-card rounded-xl border border-border p-8 shadow-elevated">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLogin
                  ? "Sign in to access your account and orders"
                  : "Join us for exclusive deals and faster checkout"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="acc-name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="acc-name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="acc-email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="acc-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="acc-password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="acc-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="acc-confirm" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="acc-confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Account;
