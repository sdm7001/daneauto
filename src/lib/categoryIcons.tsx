import {
  Lightbulb,
  Car,
  Shield,
  Wrench,
  DoorOpen,
  Disc,
  Settings,
  CloudFog,
  Thermometer,
  CircleDot,
  Circle,
  Wind,
  Cog,
  OctagonX,
  Frame,
  CornerDownLeft,
  Home,
  Layers,
  Box,
  Gauge,
  PanelTop,
  RectangleHorizontal,
  type LucideIcon,
} from "lucide-react";

// ── Subcategory icon lookup (keyword-based) ──

const iconMap: Record<string, LucideIcon> = {
  lamp: Lightbulb,
  light: Lightbulb,
  head: Lightbulb,
  lighting: Lightbulb,
  fender: Car,
  bumper: Shield,
  hood: PanelTop,
  door: DoorOpen,
  mirror: Disc,
  grille: Settings,
  grill: Settings,
  fog: CloudFog,
  radiator: Thermometer,
  cooling: Thermometer,
  quarter: Frame,
  tail: CircleDot,
  spoiler: Gauge,
  wing: Gauge,
  valance: Box,
  apron: Box,
  panel: Layers,
  signal: CornerDownLeft,
  turn: CornerDownLeft,
  roof: Home,
  wheel: Circle,
  rim: Circle,
  air: Wind,
  engine: Cog,
  brake: OctagonX,
  exhaust: Wind,
  trunk: RectangleHorizontal,
  tailgate: RectangleHorizontal,
  windshield: PanelTop,
  other: Wrench,
};

export function getCategoryIcon(line: string): LucideIcon {
  const l = line.toLowerCase();
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (l.includes(keyword)) return icon;
  }
  return Wrench;
}

// ── Parent category icons ──

export const parentCategoryIcons: Record<string, LucideIcon> = {
  "Body & Exterior": Car,
  Lighting: Lightbulb,
  "Cooling System": Thermometer,
  Engine: Cog,
  Exhaust: Wind,
  "Suspension & Steering": Wrench,
};

// ── Subcategory → parent category mapping ──

const subcategoryToParent: Record<string, string> = {
  "Bumpers & Components": "Body & Exterior",
  "Fenders & Liners": "Body & Exterior",
  "Hoods & Hinges": "Body & Exterior",
  Mirrors: "Body & Exterior",
  "Radiator Support": "Body & Exterior",
  Grilles: "Body & Exterior",
  "Body Repair Panels": "Body & Exterior",
  "Quarter Panels & Bed Sides": "Body & Exterior",
  "Doors & Components": "Body & Exterior",
  "Tailgates & Trunk Lids": "Body & Exterior",
  "Glass & Windshield Components": "Body & Exterior",
  "Cameras & Sensors": "Body & Exterior",
  "Structural & Supports": "Body & Exterior",
  "Lighting Assemblies": "Lighting",
  "Radiators & Cooling": "Cooling System",
  "Air Intake": "Engine",
  "Mufflers & Exhaust Components": "Exhaust",
  "Control Arms & Suspension": "Suspension & Steering",
  Wheels: "Suspension & Steering",
};

/** Hidden subcategory names that should be filtered out of display */
export const HIDDEN_SUBCATEGORIES = new Set(["OTHER", "ENGINE"]);

export function getParentCategory(subcategory: string): string {
  return subcategoryToParent[subcategory] ?? "Body & Exterior";
}
