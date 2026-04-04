import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { navLinks, extraLinks } from "./navLinks";

const DesktopNav = () => {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`relative font-display uppercase tracking-wider text-sm transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:bg-primary after:transition-transform after:duration-300 after:origin-bottom-left ${
            location.pathname === link.path
              ? "text-primary after:w-full after:scale-x-100"
              : "text-foreground/80 hover:text-primary after:w-full after:scale-x-0 hover:after:scale-x-100"
          }`}
        >
          {link.name}
        </Link>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`flex items-center gap-1 transition-colors duration-300 font-display uppercase tracking-wider text-sm outline-none ${
            extraLinks.some((l) => location.pathname === l.path)
              ? "text-primary font-semibold"
              : "text-foreground/80 hover:text-primary"
          }`}
        >
          More <ChevronDown className="w-3.5 h-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {extraLinks.map((link) => (
            <DropdownMenuItem key={link.name} asChild>
              <Link to={link.path} className="cursor-pointer">
                {link.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

DesktopNav.displayName = "DesktopNav";

export default DesktopNav;
