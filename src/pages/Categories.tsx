import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const Categories = () => {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            All <span className="text-primary">Categories</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our complete selection of auto parts organized by category. Find exactly what you need for your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group bg-gradient-card rounded-xl border border-border p-8 text-center hover:border-primary transition-all duration-500 hover:-translate-y-2 shadow-card hover:shadow-glow animate-fade-in"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <span className="text-6xl block mb-6 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </span>
              <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h2>
              <p className="text-muted-foreground">
                {category.count.toLocaleString()} parts available
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Categories;
