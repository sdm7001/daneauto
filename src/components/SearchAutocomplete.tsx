import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useSearchSuggestions, type SearchSuggestion } from "@/hooks/useSearchSuggestions";

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

const SearchAutocomplete = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search by SKU, description, OEM number...",
  className,
}: SearchAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce the query by 300ms
  useEffect(() => {
    if (value.trim().length < 2) {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(value.trim()), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const { data: suggestions = [], isLoading } = useSearchSuggestions(
    debouncedQuery,
    open && debouncedQuery.length >= 2
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      setOpen(false);
      navigate(`/product/${encodeURIComponent(suggestion.sku)}`);
    },
    [navigate]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setOpen(false);
      onSearch();
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
      {isLoading && debouncedQuery.length >= 2 && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin z-10" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="pl-10"
      />

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto">
          {suggestions.map((s) => (
            <button
              key={s.sku}
              onClick={() => handleSelect(s)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/60 transition-colors border-b border-border/50 last:border-b-0"
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {s.image_url ? (
                  <img
                    src={s.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Search className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">
                  {s.description ?? s.sku}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.year} {s.make} {s.model} · {s.product_line}
                </p>
              </div>

              {/* Price */}
              {formatPrice(s.list_price) && (
                <span className="text-sm font-semibold text-primary shrink-0">
                  {formatPrice(s.list_price)}
                </span>
              )}
            </button>
          ))}

          {/* View all results */}
          <button
            onClick={() => {
              setOpen(false);
              onSearch();
            }}
            className="w-full px-4 py-3 text-sm text-primary font-medium hover:bg-secondary/60 transition-colors text-center"
          >
            View all results for "{value.trim()}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
