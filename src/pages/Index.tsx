
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Venue?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the revolution in bar and club service. Increase revenue, reduce wait times, and delight your customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3">
                Order Now
              </Button>
            </Link>
            <Link to="/backoffice">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3">
                Partner Dashboard
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
