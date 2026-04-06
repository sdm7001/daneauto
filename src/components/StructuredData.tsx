interface StructuredDataProps {
  data: Record<string, unknown>;
  id?: string;
}

const StructuredData = ({ data, id = "structured-data" }: StructuredDataProps) => {
  return (
    <script
      id={`json-ld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default StructuredData;
