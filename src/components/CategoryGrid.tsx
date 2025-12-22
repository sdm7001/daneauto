import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const CategoryGrid = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive selection of quality auto parts organized by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group relative bg-gradient-card rounded-xl border border-border p-6 text-center hover:border-primary transition-all duration-500 hover:-translate-y-1 shadow-card hover:shadow-glow animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-4xl md:text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </span>
              <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.count.toLocaleString()} parts
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
