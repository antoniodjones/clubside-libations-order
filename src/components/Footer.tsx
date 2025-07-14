
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-purple-500/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-lg"></div>
              <span className="text-xl font-bold text-white">dranx+</span>
            </div>
            <p className="text-gray-400">
              Revolutionizing the bar and club experience with instant mobile ordering.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2">
              <li><Link to="/menu" className="text-gray-400 hover:text-yellow-400 transition-colors">Browse Menu</Link></li>
              <li><Link to="/loyalty-info" className="text-gray-400 hover:text-yellow-400 transition-colors">Loyalty Program</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-yellow-400 transition-colors">Track Order</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Download App</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">For Venues</h4>
            <ul className="space-y-2">
              <li><Link to="/backoffice" className="text-gray-400 hover:text-yellow-400 transition-colors">Dashboard</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Partner Program</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-purple-500/20 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2025 dranx+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
