import { Link } from "react-router-dom";
import logoHorizontal from "@/assets/logo-horizontal.jpg";
import logoIcon from "@/assets/logo-icon.jpg";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center group">
      <img
        src={logoHorizontal}
        alt="Dane Auto Parts Ltd"
        className="hidden md:block h-12 w-auto object-contain"
      />
      <img
        src={logoIcon}
        alt="Dane Auto Parts Ltd"
        className="block md:hidden h-10 w-10 object-contain rounded-lg"
      />
    </Link>
  );
};

export default Logo;
