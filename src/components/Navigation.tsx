
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserMenu } from "@/components/UserMenu";
import { CartIcon } from "@/components/CartIcon";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate('/auth');
  };

  const handleContinueWithoutLogin = () => {
    setShowLoginModal(false);
    navigate('/menu');
  };

  return (
    <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-lg shadow-lg group-hover:shadow-purple-400/25 transition-shadow duration-300"></div>
            <span className="text-2xl font-light text-white tracking-wide">dranx+</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              to="/menu" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-base tracking-wide relative group"
            >
              Menu
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/loyalty" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-base tracking-wide relative group"
            >
              Rewards
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/track-order" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-base tracking-wide relative group"
            >
              Track Order
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/customer-profile" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-base tracking-wide relative group"
            >
              Profile
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/backoffice" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-base tracking-wide relative group"
            >
              Partners
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <UserMenu onLoginClick={() => setShowLoginModal(true)} />
            <CartIcon onCartClick={() => setShowLoginModal(true)} />
            <Link to="/menu">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8 py-2.5 rounded-none shadow-lg hover:shadow-xl transition-all duration-300 tracking-wide">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 space-y-6 border-t border-white/10">
            <Link 
              to="/menu" 
              className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-lg tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link 
              to="/loyalty" 
              className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-lg tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Rewards
            </Link>
            <Link 
              to="/track-order" 
              className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-lg tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Track Order
            </Link>
            <Link 
              to="/customer-profile" 
              className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-lg tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link 
              to="/backoffice" 
              className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-light text-lg tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Partners
            </Link>
            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
              <UserMenu onLoginClick={() => setShowLoginModal(true)} />
              <CartIcon onCartClick={() => setShowLoginModal(true)} />
            </div>
            <Link to="/menu" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-none shadow-lg tracking-wide">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="bg-gray-900 border border-purple-400/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-yellow-400">
              Unlock Exclusive Benefits
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300 mt-4">
              Login to access member discounts, personalized recommendations, and exclusive offers available only to registered users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 mt-6">
            <Button 
              onClick={handleLogin}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-full"
            >
              Login for Discounts & Offers
            </Button>
            <Button 
              variant="outline" 
              onClick={handleContinueWithoutLogin}
              className="border-gray-400/50 text-gray-900 hover:bg-gray-400/10 rounded-full"
            >
              Continue Shopping Without Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};
