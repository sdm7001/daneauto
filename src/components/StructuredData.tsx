import { useEffect } from "react";

interface StructuredDataProps {
  data: Record<string, unknown>;
  id?: string;
}

const StructuredData = ({ data, id = "structured-data" }: StructuredDataProps) => {
  useEffect(() => {
    const scriptId = `json-ld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [data, id]);

  return null;
};

export default StructuredData;
