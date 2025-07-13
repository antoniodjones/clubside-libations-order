import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const GuestOrderButton = () => {
  return (
    <Link to="/menu" className="block">
      <Button
        type="button"
        variant="outline"
        className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-black font-semibold backdrop-blur-sm transition-all duration-300"
        size="lg"
      >
        Order as Guest
      </Button>
    </Link>
  );
};