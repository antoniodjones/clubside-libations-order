
import { Button } from "@/components/ui/button";
import { Smartphone, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-95"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Premium badge */}
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-8 py-3 border border-white/20 shadow-lg">
              <Zap className="w-5 h-5 text-yellow-400 mr-3" />
              <span className="text-yellow-400 font-medium text-sm tracking-wide uppercase letter-spacing-wider">
                Instant Ordering Revolution
              </span>
            </div>
          </div>
          
          {/* Main headline */}
          <h1 className="text-6xl md:text-8xl font-light text-white mb-8 leading-none tracking-tight">
            Order Drinks &
            <br />
            <span className="font-bold bg-gradient-to-r from-purple-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
              Skip the Wait
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Experience the future of nightlife with pours+. Order premium drinks and appetizers 
            instantly from your phone while you enjoy the night.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link to="/auth">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg px-12 py-4 rounded-none shadow-xl hover:shadow-2xl transition-all duration-300 border-0 min-w-[200px]">
                <Smartphone className="mr-3 h-5 w-5" />
                Start Ordering
              </Button>
            </Link>
            <Link to="/backoffice">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-orange-700 hover:bg-white hover:text-orange-800 font-semibold text-lg px-12 py-4 rounded-none backdrop-blur-sm transition-all duration-300 min-w-[200px]">
                Partner With Us
              </Button>
            </Link>
          </div>

          {/* Hero visual element */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-none border border-white/20 p-12 shadow-2xl">
              <div className="aspect-[16/9] bg-gradient-to-br from-purple-900/30 to-black/50 rounded-none flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-400/30">
                    <Smartphone className="w-10 h-10 text-yellow-400" />
                  </div>
                  <h3 className="text-white text-2xl font-light mb-2">Interactive Experience</h3>
                  <p className="text-gray-400 text-lg">Coming Soon</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
