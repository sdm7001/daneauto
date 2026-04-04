import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, LogOut, Shield, Heart, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";

interface HeaderActionsProps {
  isAdmin: boolean;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onSignOut: () => void;
  onSearch: (query: string) => void;
}

const HeaderActions = ({
  isAdmin,
  isMenuOpen,
  onToggleMenu,
  onSignOut,
  onSearch,
}: HeaderActionsProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { items } = useCart();
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const submitSearch = () => {
    const q = searchQuery.trim();
    if (q) onSearch(q);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
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
                if (e.key === "Escape") {
                  setSearchOpen(false);
                  setSearchQuery("");
                }
              }}
              className="h-9 w-48 text-sm"
            />
            <Button variant="ghost" size="icon" onClick={submitSearch}>
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
            >
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
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
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
          <Button variant="ghost" size="icon" onClick={onSignOut}>
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
        onClick={onToggleMenu}
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>
    </div>
  );
};

HeaderActions.displayName = "HeaderActions";

export default HeaderActions;
