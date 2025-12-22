import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="text-primary text-3xl font-display font-bold tracking-tight flex items-center">
          <span className="relative">
            d
            <Wrench className="absolute -top-1 -right-1 w-3 h-3 text-primary rotate-45" />
          </span>
          <span>ane</span>
        </div>
        <div className="text-accent text-xs font-display tracking-[0.3em] uppercase">
          Auto Parts
        </div>
      </div>
      <span className="text-primary font-display text-lg font-semibold ml-1">Ltd</span>
    </Link>
  );
};

export default Logo;
