import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { navLinks, extraLinks } from "./navLinks";

interface MobileNavProps {
  isAdmin: boolean;
  onClose: () => void;
  onSignOut: () => void;
  onSearch: (query: string) => void;
}

const MobileNav = ({ isAdmin, onClose, onSignOut, onSearch }: MobileNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();

  const submitSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      onSearch(q);
      onClose();
    }
  };

  return (
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
              if (e.key === "Enter") submitSearch();
            }}
            className="pl-9 h-10 text-sm"
          />
        </div>
        <Button
          size="sm"
          onClick={submitSearch}
          disabled={!searchQuery.trim()}
        >
          Search
        </Button>
      </div>

      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`block py-3 transition-colors duration-300 font-display uppercase tracking-wider border-l-2 pl-3 ${
            location.pathname === link.path
              ? "text-primary border-primary"
              : "text-foreground/80 hover:text-primary border-transparent"
          }`}
          onClick={onClose}
        >
          {link.name}
        </Link>
      ))}

      {isAdmin && (
        <Link
          to="/admin"
          className="block py-3 text-accent hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider"
          onClick={onClose}
        >
          Admin Dashboard
        </Link>
      )}

      <div className="border-t border-border mt-2 pt-2">
        {extraLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`block py-3 transition-colors duration-300 font-display uppercase tracking-wider text-sm border-l-2 pl-3 ${
              location.pathname === link.path
                ? "text-primary border-primary"
                : "text-foreground/80 hover:text-primary border-transparent"
            }`}
            onClick={onClose}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {user && (
        <Link
          to="/wishlist"
          className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider"
          onClick={onClose}
        >
          Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
        </Link>
      )}

      <Link
        to="/account"
        className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider"
        onClick={onClose}
      >
        {user ? "My Account" : "Sign In"}
      </Link>

      {user && (
        <button
          onClick={() => {
            onSignOut();
            onClose();
          }}
          className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-display uppercase tracking-wider w-full text-left"
        >
          Sign Out
        </button>
      )}
    </nav>
  );
};

MobileNav.displayName = "MobileNav";

export default MobileNav;
