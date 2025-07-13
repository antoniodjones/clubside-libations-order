
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Clock, CreditCard, BarChart3, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      <Hero />
      <Features />
      
      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
              Trusted by the Best
            </h2>
            <p className="text-lg text-gray-300 font-light">
              Industry-leading performance you can count on
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-light text-yellow-400 mb-3 group-hover:scale-105 transition-transform duration-300">
                50+
              </div>
              <div className="text-gray-300 text-lg font-light tracking-wide">
                Partner Venues
              </div>
              <div className="w-12 h-px bg-yellow-400/30 mx-auto mt-4"></div>
            </div>
            
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-light text-yellow-400 mb-3 group-hover:scale-105 transition-transform duration-300">
                10k+
              </div>
              <div className="text-gray-300 text-lg font-light tracking-wide">
                Orders Served
              </div>
              <div className="w-12 h-px bg-yellow-400/30 mx-auto mt-4"></div>
            </div>
            
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-light text-yellow-400 mb-3 group-hover:scale-105 transition-transform duration-300">
                4.9★
              </div>
              <div className="text-gray-300 text-lg font-light tracking-wide">
                Average Rating
              </div>
              <div className="w-12 h-px bg-yellow-400/30 mx-auto mt-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-yellow-400 text-sm font-medium tracking-[0.2em] uppercase">Ready to Begin?</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-8 tracking-tight leading-tight">
            Transform Your Venue
            <br />
            <span className="font-normal">Experience</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Join the revolution in bar and club service. Increase revenue, reduce wait times, and delight your customers with our premium ordering platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/menu">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-12 py-4 text-lg tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/25">
                Start Ordering
              </Button>
            </Link>
            <Link to="/backoffice">
              <Button size="lg" variant="outline" className="border-2 border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400 px-12 py-4 text-lg font-light tracking-wide transition-all duration-300 backdrop-blur-sm">
                Partner With Us
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
