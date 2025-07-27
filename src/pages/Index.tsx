
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wine, Coffee, Star, Award, Users, TrendingUp, Clock, Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState } from "react";

const Index = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleOrderNow = () => {
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate('/auth');
  };

  const handleContinueWithoutLogin = () => {
    setShowLoginModal(false);
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      {/* Hero Section - Bar/Club Focus */}
      <section className="relative h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4">
            <span className="inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-full text-base font-bold tracking-wide uppercase">
              Premium Bar Experience
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-1 leading-[0.8] tracking-tight">
            PREMIUM
            <br />
            <span className="text-yellow-400">POURS</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-gray-300 font-light mb-8 max-w-xl mx-auto leading-tight">
            AT YOUR FINGERTIPS
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              onClick={handleOrderNow}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 text-base tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/25 rounded-full"
            >
              Order Now
            </Button>
            <Link to="/backoffice">
              <Button size="lg" variant="outline" className="border-2 border-white/20 text-gray-900 hover:bg-white/10 hover:border-white/40 px-8 py-3 text-base font-light tracking-wide transition-all duration-300 backdrop-blur-sm rounded-full">
                Partner With Us
              </Button>
            </Link>
          </div>
          
          {/* Age Verification Notice */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 max-w-sm mx-auto border border-purple-400/20">
            <p className="text-xs text-gray-300 mb-2">
              Must be 21+ to order alcoholic beverages
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-yellow-400 font-bold text-lg">21+</span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-400 font-medium text-sm">Verified Service</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      </section>

      {/* Service Highlights Section */}
      <section className="py-12 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-[0.85] tracking-tight">
              CRAFTED
              <br />
              <span className="text-yellow-400">EXPERIENCES</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              Premium cocktails, bottle service, and bar experiences delivered to your table
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-gray-900/40 p-8 rounded-3xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <Wine className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">Premium Cocktails</h3>
              </div>
              <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
                Handcrafted cocktails from expert bartenders using top-shelf spirits and fresh ingredients
              </p>
              <Button variant="outline" className="border-yellow-400/50 text-gray-900 hover:bg-yellow-400/10 rounded-full">
                View Menu
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/40 to-gray-900/40 p-8 rounded-3xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">Bottle Service</h3>
              </div>
              <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
                VIP bottle service with premium champagne, spirits, and mixers delivered to your table
              </p>
              <Button variant="outline" className="border-purple-400/50 text-gray-900 hover:bg-purple-400/10 rounded-full">
                Reserve Now
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 p-8 rounded-3xl border border-gray-400/20 hover:border-gray-400/40 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <Coffee className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">Food & More</h3>
              </div>
              <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
                Gourmet bar food, late-night bites, and select cannabis options where available
              </p>
              <Button variant="outline" className="border-gray-400/50 text-gray-900 hover:bg-gray-400/10 rounded-full">
                Order Food
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-[0.85] tracking-tight">
              WHY CHOOSE
              <br />
              <span className="text-yellow-400">DRANX</span><span className="text-purple-400">+</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-tight">Skip the Wait</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Order directly where you stand and skip the crowded bar lines</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-tight">Fast Delivery</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Bartenders and Professional service staff delivers your order in minutes</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-tight">Premium Quality</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Only the finest spirits, wines, craft cocktails, and bottle services</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-tight">Group Orders</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">Easy splitting bill and sharing for your entire party</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-1 leading-[0.85] tracking-tight">
              TRUSTED BY THE
              <br />
              <span className="text-yellow-400">NIGHTLIFE</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
              Industry-leading performance you can count on
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="text-7xl md:text-8xl font-black text-yellow-400 mb-2 leading-none group-hover:scale-105 transition-transform duration-300">
                50+
              </div>
              <div className="text-gray-300 text-lg md:text-xl font-bold tracking-wide uppercase leading-tight">
                Partner Venues
              </div>
              <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="text-center group">
              <div className="text-7xl md:text-8xl font-black text-purple-400 mb-2 leading-none group-hover:scale-105 transition-transform duration-300">
                10K+
              </div>
              <div className="text-gray-300 text-lg md:text-xl font-bold tracking-wide uppercase leading-tight">
                Drinks Served
              </div>
              <div className="w-16 h-1 bg-purple-400 mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="text-center group">
              <div className="text-7xl md:text-8xl font-black text-yellow-400 mb-2 leading-none group-hover:scale-105 transition-transform duration-300">
                4.9★
              </div>
              <div className="text-gray-300 text-lg md:text-xl font-bold tracking-wide uppercase leading-tight">
                Customer Rating
              </div>
              <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-900/30 to-yellow-900/30">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-yellow-400 text-sm font-bold tracking-[0.3em] uppercase">Ready to Elevate?</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-3 leading-[0.85] tracking-tight">
            TRANSFORM YOUR
            <br />
            <span className="text-yellow-400">NIGHT OUT</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Join the revolution in bar service. Skip lines, enjoy premium drinks, elevate your nightlife.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleOrderNow}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-16 py-6 text-xl tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/30 rounded-full"
            >
              Start Ordering
            </Button>
            <Link to="/backoffice">
              <Button size="lg" variant="outline" className="border-2 border-purple-400/50 text-gray-900 hover:bg-purple-400/10 hover:border-purple-400 px-16 py-6 text-xl font-light tracking-wide transition-all duration-300 backdrop-blur-sm rounded-full">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

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
    </div>
  );
};

export default Index;
