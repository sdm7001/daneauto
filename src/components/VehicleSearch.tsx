import { useState } from "react";
import { Button } from "./ui/button";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVehicleYears, useVehicleMakes, useVehicleModels } from "@/hooks/useVehicles";

const selectCls =
  "w-full h-12 rounded-md border border-input bg-secondary/50 px-3 text-foreground " +
  "focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 disabled:opacity-50";

const VehicleSearch = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const { data: years = [], isLoading: yearsLoading } = useVehicleYears();
  const { data: makes = [], isLoading: makesLoading } = useVehicleMakes(year);
  const { data: models = [], isLoading: modelsLoading } = useVehicleModels(year, make);

  const handleSearch = () => {
    if (!year && !make && !model) return;
    const params = new URLSearchParams();
    if (year)  params.set("year", year);
    if (make)  params.set("make", make);
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
          <label htmlFor="vs-year" className="block text-sm font-medium text-muted-foreground mb-2">Year</label>
          <div className="relative">
            <select
              id="vs-year"
              value={year}
              onChange={(e) => { setYear(e.target.value); setMake(""); setModel(""); }}
              disabled={yearsLoading}
              className={selectCls}
            >
              <option value="">Select Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            {yearsLoading && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
        </div>
        <div>
          <label htmlFor="vs-make" className="block text-sm font-medium text-muted-foreground mb-2">Make</label>
          <div className="relative">
            <select
              id="vs-make"
              value={make}
              onChange={(e) => { setMake(e.target.value); setModel(""); }}
              disabled={!year || makesLoading}
              className={selectCls}
            >
              <option value="">Select Make</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            {makesLoading && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
        </div>
        <div>
          <label htmlFor="vs-model" className="block text-sm font-medium text-muted-foreground mb-2">Model</label>
          <div className="relative">
            <select
              id="vs-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make || modelsLoading}
              className={selectCls}
            >
              <option value="">Select Model</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            {modelsLoading && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
        </div>
      </div>
      <Button
        onClick={handleSearch}
        variant="hero"
        size="xl"
        className="w-full"
        disabled={!year && !make && !model}
      >
        <Search className="w-5 h-5" />
        Search Parts
      </Button>
    </div>
  );
};

export default VehicleSearch;
