import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search, LogOut, Shield, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/hooks/useWishlist";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { items } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { count: wishlistCount } = useWishlist();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const checkAdminRole = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user?.id)
      .eq("role", "admin")
      .maybeSingle();
    
    setIsAdmin(!!data);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const submitSearch = () => {
    const q = searchQuery.trim();
    if (q) navigate(`/shop?search=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const mobileExtraLinks = [
    { name: "FAQ", path: "/faq" },
    { name: "Request a Part", path: "/request-a-part" },
    { name: "Wholesale", path: "/wholesale" },
    { name: "Shipping & Returns", path: "/shipping-returns" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-foreground/80 hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Inline search */}
            <div className="hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-1 animate-fade-in">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitSearch();
                      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                    }}
                    className="h-9 w-48 text-sm"
                  />
                  <Button variant="ghost" size="icon" onClick={submitSearch}>
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={openSearch}>
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </div>
            {user && (
              <Link to="/wishlist" className="relative hidden md:flex">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" title="Admin Dashboard">
                      <Shield className="w-5 h-5 text-accent" />
                    </Button>
                  </Link>
                )}
                <Link to="/account">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/account" className="hidden md:flex">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            {/* Mobile Search */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search parts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { submitSearch(); setIsMenuOpen(false); }
                  }}
                  className="pl-9 h-10 text-sm"
                />
              </div>
              <Button
                size="sm"
                onClick={() => { submitSearch(); setIsMenuOpen(false); }}
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="block py-3 text-accent hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {user && (
              <Link
                to="/wishlist"
                className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
            )}
            <Link
              to="/account"
              className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              {user ? "My Account" : "Sign In"}
            </Link>
            {user && (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider w-full text-left"
              >
                Sign Out
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
