
import { Button } from "@/components/ui/button";
import { Smartphone, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-20 pb-32 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center bg-purple-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-semibold">Instant Ordering Revolution</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Order Drinks & Apps
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
            Without the Wait
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          LibationsPLUS transforms your bar and club experience. Order drinks and appetizers 
          instantly from your phone while you enjoy the night. No more waiting in line, 
          no more missing the action.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link to="/menu">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
              <Smartphone className="mr-2 h-5 w-5" />
              Start Ordering
            </Button>
          </Link>
          <Link to="/backoffice">
            <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300">
              Partner With Us
            </Button>
          </Link>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-500/30 to-yellow-400/30 rounded-2xl backdrop-blur-sm p-8 border border-purple-500/20">
            <div className="aspect-video bg-black/30 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">Interactive Demo Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
