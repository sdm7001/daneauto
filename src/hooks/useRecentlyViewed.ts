import { useEffect, useState } from "react";

const KEY = "recently_viewed";
const MAX = 8;

export function useRecentlyViewed() {
  const [skus, setSkus] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  const track = (sku: string) => {
    setSkus((prev) => {
      const next = [sku, ...prev.filter((s) => s !== sku)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { skus, track };
}
