import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ImageOff, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { Product } from "@/hooks/useProducts";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [copied, setCopied] = useState(false);

  const copySku = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(product.sku).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleAddToCart = () => {
    addItem({
      id: product.sku,
      name: product.description ?? product.sku,
      price: product.net_price ?? product.list_price ?? 0,
      image: product.image_url ?? "",
      category: product.product_line,
    });
    toast.success(`${product.sku} added to cart!`);
  };

  const displayPrice = product.list_price ?? product.net_price;
  const hasDiscount = product.list_price && product.net_price && product.net_price < product.list_price;
  const discount = hasDiscount
    ? Math.round((1 - product.net_price! / product.list_price!) * 100)
    : 0;

  return (
    <div className="group bg-gradient-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
      <Link to={`/product/${encodeURIComponent(product.sku)}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-secondary/30 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.description ?? product.sku}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.removeAttribute("style");
              }}
            />
          ) : null}
          <ImageOff className="w-12 h-12 text-muted-foreground/30" style={product.image_url ? { display: "none" } : undefined} />
        </div>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        <WishlistButton sku={product.sku} className="absolute top-2 right-2 bg-background/60 backdrop-blur-sm rounded-full" />
      </Link>

      <div className="p-4">
        <span className="text-xs text-primary font-display uppercase tracking-wider line-clamp-1">
          {product.product_line}
        </span>
        <Link to={`/product/${encodeURIComponent(product.sku)}`}>
          <h3 className="font-display text-sm font-semibold mt-1 line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
            {product.description ?? product.sku}
          </h3>
        </Link>
        <button
          onClick={copySku}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-1 transition-colors group"
          title="Copy SKU"
        >
          <span>SKU: {product.sku}</span>
          {copied
            ? <Check className="w-3 h-3 text-green-400" />
            : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>

        <div className="flex items-center justify-between mt-4">
          <div>
            {displayPrice != null ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ${displayPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through ml-2">
                    ${product.list_price!.toFixed(2)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Call for price</span>
            )}
          </div>
          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={displayPrice == null}
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
