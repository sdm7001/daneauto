export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  brand: string;
  compatibleVehicles: string[];
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Brake Pad Set",
    description: "High-performance ceramic brake pads for superior stopping power and low dust.",
    price: 89.99,
    originalPrice: 119.99,
    category: "brakes",
    subcategory: "Brake Pads",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    brand: "StopTech",
    compatibleVehicles: ["Toyota Camry 2018-2024", "Honda Accord 2018-2024"],
    featured: true,
  },
  {
    id: "2",
    name: "High-Flow Air Filter",
    description: "Washable and reusable high-flow air filter for increased horsepower.",
    price: 54.99,
    category: "engine",
    subcategory: "Air Filters",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    brand: "K&N",
    compatibleVehicles: ["Ford F-150 2015-2024", "Chevrolet Silverado 2015-2024"],
    featured: true,
  },
  {
    id: "3",
    name: "Sport Suspension Kit",
    description: "Complete lowering spring kit for improved handling and aggressive stance.",
    price: 349.99,
    originalPrice: 449.99,
    category: "suspension",
    subcategory: "Springs",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    rating: 4.9,
    reviews: 78,
    inStock: true,
    brand: "Eibach",
    compatibleVehicles: ["BMW 3 Series 2019-2024", "Audi A4 2019-2024"],
    featured: true,
  },
  {
    id: "4",
    name: "LED Headlight Assembly",
    description: "Full LED headlight assembly with DRL and sequential turn signals.",
    price: 299.99,
    category: "electrical",
    subcategory: "Lighting",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    brand: "Spyder",
    compatibleVehicles: ["Jeep Wrangler 2018-2024"],
    featured: true,
  },
  {
    id: "5",
    name: "Performance Exhaust System",
    description: "Cat-back stainless steel exhaust for aggressive sound and power gains.",
    price: 599.99,
    category: "exhaust",
    subcategory: "Cat-Back Systems",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400",
    rating: 4.8,
    reviews: 92,
    inStock: true,
    brand: "Borla",
    compatibleVehicles: ["Ford Mustang 2018-2024", "Chevrolet Camaro 2018-2024"],
  },
  {
    id: "6",
    name: "Synthetic Motor Oil 5W-30",
    description: "Full synthetic motor oil for maximum engine protection.",
    price: 42.99,
    category: "fluids",
    subcategory: "Motor Oil",
    image: "https://images.unsplash.com/photo-1635784063388-1ff609d25595?w=400",
    rating: 4.9,
    reviews: 567,
    inStock: true,
    brand: "Mobil 1",
    compatibleVehicles: ["Universal"],
  },
  {
    id: "7",
    name: "Slotted Brake Rotors",
    description: "Drilled and slotted rotors for better heat dissipation.",
    price: 159.99,
    originalPrice: 189.99,
    category: "brakes",
    subcategory: "Rotors",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    rating: 4.7,
    reviews: 145,
    inStock: true,
    brand: "EBC",
    compatibleVehicles: ["Honda Civic 2016-2024", "Toyota Corolla 2016-2024"],
  },
  {
    id: "8",
    name: "Cold Air Intake Kit",
    description: "Increase horsepower with this bolt-on cold air intake system.",
    price: 279.99,
    category: "engine",
    subcategory: "Intake Systems",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    rating: 4.5,
    reviews: 203,
    inStock: false,
    brand: "AEM",
    compatibleVehicles: ["Subaru WRX 2015-2024", "Subaru STI 2015-2024"],
  },
];

export const categories = [
  { id: "engine", name: "Engine Parts", icon: "⚙️", count: 1250 },
  { id: "brakes", name: "Brake Systems", icon: "🛑", count: 890 },
  { id: "suspension", name: "Suspension", icon: "🔧", count: 650 },
  { id: "electrical", name: "Electrical", icon: "⚡", count: 1100 },
  { id: "exhaust", name: "Exhaust", icon: "💨", count: 420 },
  { id: "fluids", name: "Fluids & Oils", icon: "🛢️", count: 380 },
  { id: "body", name: "Body Parts", icon: "🚗", count: 950 },
  { id: "interior", name: "Interior", icon: "💺", count: 720 },
];
