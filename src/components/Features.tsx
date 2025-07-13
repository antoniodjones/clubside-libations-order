
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Clock, CreditCard, BarChart3, Users, Shield } from "lucide-react";

export const Features = () => {
  const customerFeatures = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for standing and one-handed use in busy venues"
    },
    {
      icon: Clock,
      title: "Skip the Line",
      description: "Order instantly and get notified when ready for pickup"
    },
    {
      icon: CreditCard,
      title: "Seamless Payments",
      description: "Quick checkout with saved payment methods and digital receipts"
    }
  ];

  const businessFeatures = [
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights into sales, popular items, and customer behavior"
    },
    {
      icon: Users,
      title: "Staff Management",
      description: "Streamline operations with order management and staff coordination"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Customer Features */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">For Customers</h2>
          <p className="text-gray-300 text-lg">Experience nightlife like never before</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {customerFeatures.map((feature, index) => (
            <Card key={index} className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Features */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">For Venues</h2>
          <p className="text-gray-300 text-lg">Powerful tools to grow your business</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessFeatures.map((feature, index) => (
            <Card key={index} className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
