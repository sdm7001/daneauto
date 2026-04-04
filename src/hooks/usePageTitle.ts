import { useEffect } from "react";

const BASE = "Dane Auto Parts Ltd";
const DEFAULT_DESC =
  "Your trusted source for premium automotive parts. Find the right parts for your vehicle with our easy Year, Make, Model search. Fast delivery and quality guaranteed.";

function setMetaDescription(content: string) {
  let el = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!el) {
    el = document.createElement("meta");
    el.name = "description";
    document.head.appendChild(el);
  }
  el.content = content;
}

export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : BASE;
    setMetaDescription(description ?? DEFAULT_DESC);
    return () => {
      document.title = BASE;
      setMetaDescription(DEFAULT_DESC);
    };
  }, [title, description]);
}
