import { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
const makes = [
  "Acura", "Audi", "BMW", "Chevrolet", "Chrysler", "Dodge", "Ford", "GMC",
  "Honda", "Hyundai", "Infiniti", "Jeep", "Kia", "Lexus", "Mazda", "Mercedes-Benz",
  "Nissan", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen"
];
const models: Record<string, string[]> = {
  "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius", "4Runner"],
  "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline"],
  "Ford": ["F-150", "Mustang", "Explorer", "Escape", "Edge", "Bronco", "Ranger"],
  "Chevrolet": ["Silverado", "Camaro", "Equinox", "Tahoe", "Suburban", "Colorado", "Malibu"],
  "BMW": ["3 Series", "5 Series", "X3", "X5", "X7", "M3", "M5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS"],
  "Nissan": ["Altima", "Maxima", "Sentra", "Rogue", "Pathfinder", "Murano", "Titan"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Gladiator"],
};

const VehicleSearch = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const availableModels = make && models[make] ? models[make] : [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-elevated border border-border">
      <h3 className="font-display text-xl md:text-2xl font-bold mb-6 text-center">
        Find Parts for Your Vehicle
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full h-12 rounded-md border border-input bg-secondary/50 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Make
          </label>
          <select
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              setModel("");
            }}
            className="w-full h-12 rounded-md border border-input bg-secondary/50 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
          >
            <option value="">Select Make</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
            className="w-full h-12 rounded-md border border-input bg-secondary/50 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 disabled:opacity-50"
          >
            <option value="">Select Model</option>
            {availableModels.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <Button onClick={handleSearch} variant="hero" size="xl" className="w-full">
        <Search className="w-5 h-5" />
        Search Parts
      </Button>
    </div>
  );
};

export default VehicleSearch;
