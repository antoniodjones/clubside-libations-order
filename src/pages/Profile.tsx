import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Mail, Phone, User, Calendar, CreditCard, Star, TrendingUp } from "lucide-react";

const Profile = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                  Edit
                </Button>
              </div>
              
              <div className="text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl">JW</AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-xl font-bold">Jenny Wilson</h2>
                  <p className="text-primary-foreground/80">03.22.1990 (34)</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Main Street, New York</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>jenny.w@gmail.com</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Cell: (817) 234-3244</span>
                  </div>
                  <div className="pl-6 text-primary-foreground/80">
                    <p>Home: (817) 234-0000</p>
                    <p>Work: (817) 100-0000</p>
                    <p>Other: (817) 210-0000</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-primary-foreground/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Sex: Female</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member Since: May 2022</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Premium Member</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 text-xs text-primary-foreground/60">
                Last active on Dec 13, 2024 at 8:45pm
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Night Out Stats</h3>
                  <select className="text-sm border rounded px-2 py-1">
                    <option>This Month</option>
                    <option>This Year</option>
                    <option>All Time</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex items-center justify-center w-32 h-32 mx-auto relative">
                      <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-primary" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 35%, 50% 50%)'}}></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">28</div>
                        <div className="text-xs text-muted-foreground">visits</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="font-semibold">21</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-muted-foreground">Planned:</span>
                        <span className="font-semibold">7</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-muted-foreground">Cancelled:</span>
                        <span className="font-semibold">3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">No-shows:</span>
                        <span className="font-semibold">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Total Spend</h3>
                  <select className="text-sm border rounded px-2 py-1">
                    <option>All Time</option>
                    <option>This Year</option>
                    <option>This Month</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex items-center justify-center w-32 h-32 mx-auto relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20"></div>
                      <div className="absolute inset-0 rounded-full bg-primary/40" style={{clipPath: 'circle(45px at center)'}}></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">$2,840</div>
                        <div className="text-xs text-primary/60">$95</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Bar Spend:</span>
                      <span className="font-semibold">$2,840</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average per Visit:</span>
                      <span className="font-semibold">$95</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs Section */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="visits" className="w-full">
                <div className="border-b px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="visits">Visits</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="friends">Friends</TabsTrigger>
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="visits" className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Recent Visits</h3>
                      <select className="text-sm border rounded px-2 py-1 mt-2">
                        <option>Upcoming Visits</option>
                        <option>Past Visits</option>
                        <option>All Visits</option>
                      </select>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">+ New Visit</Button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { date: "25.12.2024", status: "Booked", time: "9:30 PM", venue: "The Rooftop Lounge", location: "Downtown NYC", type: "VIP Table" },
                      { date: "27.12.2024", status: "Booked", time: "10:00 PM", venue: "Neon Nights Club", location: "Midtown Manhattan", type: "General Entry" },
                      { date: "30.12.2024", status: "Booked", time: "8:00 PM", venue: "Skybar NYC", location: "Upper East Side", type: "Bar Seating" },
                      { date: "15.12.2024", status: "Cancelled", time: "9:30 PM", venue: "Club Underground", location: "Brooklyn Heights", type: "VIP Booth" },
                      { date: "21.12.2024", status: "Completed", time: "7:30 PM", venue: "The Whiskey Bar", location: "SoHo NYC", type: "Happy Hour" },
                    ].map((visit, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium">{visit.date}</div>
                          <Badge variant={visit.status === "Completed" ? "default" : visit.status === "Cancelled" ? "destructive" : "secondary"}>
                            {visit.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">{visit.time}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <div className="font-medium">{visit.venue}</div>
                            <div className="text-muted-foreground">{visit.location} • {visit.type}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">4.5</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites" className="p-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">Your Favorite Venues</h3>
                    <p className="text-muted-foreground">Save venues you love for quick access</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="p-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">Your Reviews</h3>
                    <p className="text-muted-foreground">Share your experiences and help others discover great venues</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="friends" className="p-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">Friends & Groups</h3>
                    <p className="text-muted-foreground">Connect with friends and plan group outings</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="rewards" className="p-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">Rewards & Loyalty</h3>
                    <p className="text-muted-foreground">Track your points and unlock exclusive benefits</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;