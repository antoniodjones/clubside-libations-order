
import { Button } from "@/components/ui/button";
import { Smartphone, Clock, Star, Award, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      {/* Hero Section - Rise Cannabis Inspired */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
              Premium Experience
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-none tracking-tight">
            OPTIMAL
            <br />
            <span className="text-yellow-400">HIGHS</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            AT OPTIMAL PRICES
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/menu">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-12 py-4 text-lg tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/25 rounded-full">
                Shop Deals Now
              </Button>
            </Link>
            <Link to="/backoffice">
              <Button size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-12 py-4 text-lg font-light tracking-wide transition-all duration-300 backdrop-blur-sm rounded-full">
                Partner With Us
              </Button>
            </Link>
          </div>
          
          {/* Age Verification Notice */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-purple-400/20">
            <p className="text-sm text-gray-300 mb-4">
              By continuing, you confirm you are 21+ or a qualifying patient 18+
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-yellow-400 font-bold text-2xl">21+</span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-400 font-medium">Medical 18+</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      </section>

      {/* Product Highlights Section */}
      <section className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              ALL FLOWER'S
              <br />
              <span className="text-yellow-400">ON SALE</span>
            </h2>
            <p className="text-xl text-gray-300 font-light max-w-3xl mx-auto">
              Every brand, every size, every strain. Get up to 30% off your favorite buds today!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-gray-900/40 p-8 rounded-3xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold text-white">Premium Strains</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Curated selection of top-shelf cannabis products from trusted growers
              </p>
              <Button variant="outline" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 rounded-full">
                Explore Strains
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/40 to-gray-900/40 p-8 rounded-3xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Daily Deals</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Fresh deals every day with savings up to 30% on popular products
              </p>
              <Button variant="outline" className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 rounded-full">
                View Deals
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 p-8 rounded-3xl border border-gray-400/20 hover:border-gray-400/40 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold text-white">Lab Tested</h3>
              </div>
              <p className="text-gray-300 mb-6">
                All products are rigorously tested for quality, potency, and safety
              </p>
              <Button variant="outline" className="border-gray-400/50 text-gray-300 hover:bg-gray-400/10 rounded-full">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              TRUSTED BY THE
              <br />
              <span className="text-yellow-400">COMMUNITY</span>
            </h2>
            <p className="text-lg text-gray-300 font-light">
              Industry-leading performance you can count on
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-black text-yellow-400 mb-3 group-hover:scale-105 transition-transform duration-300">
                50+
              </div>
              <div className="text-gray-300 text-xl font-bold tracking-wide uppercase">
                Partner Venues
              </div>
              <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-black text-purple-400 mb-3 group-hover:scale-105 transition-transform duration-300">
                10K+
              </div>
              <div className="text-gray-300 text-xl font-bold tracking-wide uppercase">
                Orders Served
              </div>
              <div className="w-16 h-1 bg-purple-400 mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-black text-yellow-400 mb-3 group-hover:scale-105 transition-transform duration-300">
                4.9★
              </div>
              <div className="text-gray-300 text-xl font-bold tracking-wide uppercase">
                Average Rating
              </div>
              <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-r from-purple-900/30 to-yellow-900/30">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-yellow-400 text-sm font-bold tracking-[0.3em] uppercase">Ready to Rise?</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-none">
            TRANSFORM YOUR
            <br />
            <span className="text-yellow-400">EXPERIENCE</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Join the revolution in premium cannabis service. Increase satisfaction, reduce wait times, and discover your perfect high with our premium platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/menu">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-16 py-6 text-xl tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/30 rounded-full">
                Start Shopping
              </Button>
            </Link>
            <Link to="/backoffice">
              <Button size="lg" variant="outline" className="border-2 border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400 px-16 py-6 text-xl font-light tracking-wide transition-all duration-300 backdrop-blur-sm rounded-full">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
