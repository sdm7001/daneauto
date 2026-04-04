import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface WishlistButtonProps {
  sku: string;
  size?: "icon" | "default";
  className?: string;
}

const WishlistButton = ({ sku, size = "icon", className = "" }: WishlistButtonProps) => {
  const { user } = useAuth();
  const { isInWishlist, toggle } = useWishlist();
  const navigate = useNavigate();
  const active = isInWishlist(sku);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to save items to your wishlist");
      navigate("/account");
      return;
    }
    toggle(sku);
    toast.success(active ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Button
      variant="ghost"
      size={size}
      className={`${className} ${active ? "text-red-500 hover:text-red-400" : "text-muted-foreground hover:text-red-500"} transition-colors`}
      onClick={handleClick}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`w-5 h-5 ${active ? "fill-current" : ""}`} />
    </Button>
  );
};

export default WishlistButton;
