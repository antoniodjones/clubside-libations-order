
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
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Customer Features */}
        <div className="text-center mb-20">
          <div className="mb-6">
            <span className="text-yellow-400 text-sm font-medium tracking-[0.2em] uppercase">For Customers</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
            Experience nightlife
            <br />
            <span className="font-normal">like never before</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Skip the wait and enjoy premium service at your fingertips
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {customerFeatures.map((feature, index) => (
            <Card key={index} className="group bg-white/5 backdrop-blur-sm border-0 hover:bg-white/10 transition-all duration-500 hover:transform hover:scale-[1.02] p-8">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-400/20 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <CardTitle className="text-white text-2xl font-light tracking-wide">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-300 text-lg leading-relaxed font-light">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Features */}
        <div className="text-center mb-20">
          <div className="mb-6">
            <span className="text-purple-400 text-sm font-medium tracking-[0.2em] uppercase">For Venues</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
            Powerful tools to
            <br />
            <span className="font-normal">grow your business</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Increase revenue, reduce wait times, and delight your customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {businessFeatures.map((feature, index) => (
            <Card key={index} className="group bg-white/5 backdrop-blur-sm border-0 hover:bg-white/10 transition-all duration-500 hover:transform hover:scale-[1.02] p-8">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-purple-400/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-400/20 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-purple-400" />
                </div>
                <CardTitle className="text-white text-2xl font-light tracking-wide">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-300 text-lg leading-relaxed font-light">
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
