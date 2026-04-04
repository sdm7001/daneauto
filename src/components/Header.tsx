import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DesktopNav from "./header/DesktopNav";
import HeaderActions from "./header/HeaderActions";
import MobileNav from "./header/MobileNav";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleSearch = (query: string) => {
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          <DesktopNav />
          <HeaderActions
            isAdmin={isAdmin}
            isMenuOpen={isMenuOpen}
            onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            onSignOut={handleSignOut}
            onSearch={handleSearch}
          />
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <MobileNav
              isAdmin={isAdmin}
              onClose={() => setIsMenuOpen(false)}
              onSignOut={handleSignOut}
              onSearch={handleSearch}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
