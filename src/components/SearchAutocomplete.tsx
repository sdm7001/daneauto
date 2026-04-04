import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Clock, X } from "lucide-react";
import { Input } from "./ui/input";
import { useSearchSuggestions, type SearchSuggestion } from "@/hooks/useSearchSuggestions";
import { useRecentSearches } from "@/hooks/useRecentSearches";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { searches: recentSearches, addSearch, clearSearches } = useRecentSearches();

  const showRecent = open && value.trim().length < 2 && recentSearches.length > 0;

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

  // Total items = suggestions + "view all" button
  const itemCount = suggestions.length > 0 ? suggestions.length + 1 : 0;

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

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

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-autocomplete-item]");
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      setOpen(false);
      addSearch(suggestion.description ?? suggestion.sku);
      navigate(`/product/${encodeURIComponent(suggestion.sku)}`);
    },
    [navigate, addSearch]
  );

  const handleSearchSubmit = () => {
    if (value.trim()) addSearch(value.trim());
    setOpen(false);
    onSearch();
  };

  const handleRecentClick = (term: string) => {
    onChange(term);
    setOpen(false);
    addSearch(term);
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Recent searches mode
    if (showRecent) {
      const count = recentSearches.length;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < count - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : count - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < count) {
            handleRecentClick(recentSearches[activeIndex]);
          } else {
            handleSearchSubmit();
          }
          break;
        case "Escape":
          setOpen(false);
          setActiveIndex(-1);
          break;
      }
      return;
    }

    if (!open || itemCount === 0) {
      if (e.key === "Enter") handleSearchSubmit();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex]);
        } else {
          handleSearchSubmit();
        }
        break;
      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`} role="combobox" aria-expanded={open && (itemCount > 0 || showRecent)} aria-haspopup="listbox">
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
        role="searchbox"
        aria-autocomplete="list"
        aria-controls="search-listbox"
        aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
      />

      {/* Recent searches */}
      {showRecent && (
        <div
          ref={listRef}
          id="search-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Recent Searches</span>
            <button
              onClick={(e) => { e.stopPropagation(); clearSearches(); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
          {recentSearches.map((term, index) => (
            <button
              key={term}
              id={`search-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              data-autocomplete-item
              onClick={() => handleRecentClick(term)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                index === activeIndex ? "bg-secondary/80" : "hover:bg-secondary/60"
              }`}
            >
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground truncate">{term}</span>
            </button>
          ))}
        </div>
      )}

      {/* Product suggestions */}
      {open && !showRecent && suggestions.length > 0 && (
        <div
          ref={listRef}
          id="search-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto"
        >
          {suggestions.map((s, index) => (
            <button
              key={s.sku}
              id={`search-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              data-autocomplete-item
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border/50 last:border-b-0 ${
                index === activeIndex ? "bg-secondary/80" : "hover:bg-secondary/60"
              }`}
            >
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {s.image_url ? (
                  <img src={s.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <Search className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{s.description ?? s.sku}</p>
                <p className="text-xs text-muted-foreground truncate">{s.year} {s.make} {s.model} · {s.product_line}</p>
              </div>
              {formatPrice(s.list_price) && (
                <span className="text-sm font-semibold text-primary shrink-0">{formatPrice(s.list_price)}</span>
              )}
            </button>
          ))}

          <button
            id={`search-option-${suggestions.length}`}
            role="option"
            aria-selected={activeIndex === suggestions.length}
            data-autocomplete-item
            onClick={handleSearchSubmit}
            onMouseEnter={() => setActiveIndex(suggestions.length)}
            className={`w-full px-4 py-3 text-sm text-primary font-medium transition-colors text-center ${
              activeIndex === suggestions.length ? "bg-secondary/80" : "hover:bg-secondary/60"
            }`}
          >
            View all results for "{value.trim()}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
