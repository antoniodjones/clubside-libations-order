
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black/50 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">LibationsPLUS</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/menu" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Menu
            </Link>
            <Link to="/track-order" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Track Order
            </Link>
            <Link to="/backoffice" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Back Office
            </Link>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/menu" 
              className="block text-gray-300 hover:text-yellow-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link 
              to="/track-order" 
              className="block text-gray-300 hover:text-yellow-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Track Order
            </Link>
            <Link 
              to="/backoffice" 
              className="block text-gray-300 hover:text-yellow-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Back Office
            </Link>
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
