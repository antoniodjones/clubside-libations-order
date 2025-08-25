import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, Activity, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface MonthlyData {
  month: string;
  spending: number;
  orders: number;
  avgBac: number;
  biometricReadings: number;
}

export const AccountDashboard = () => {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalSpending: 0,
    totalOrders: 0,
    avgMonthlySpending: 0,
    biometricSessions: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = [];
      let totalSpending = 0;
      let totalOrders = 0;
      let totalBiometricSessions = 0;

      // Generate last 24 months
      for (let i = 23; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const monthKey = format(monthDate, 'MMM yyyy');

        // Fetch orders for this month
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('user_id', user.id)
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        // Fetch drinking sessions for this month
        const { data: sessions } = await supabase
          .from('drinking_sessions')
          .select('estimated_bac')
          .eq('user_id', user.id)
          .gte('started_at', monthStart.toISOString())
          .lte('started_at', monthEnd.toISOString());

        // Fetch biometric readings for this month
        const { data: biometrics } = await supabase
          .from('biometric_readings')
          .select('id')
          .eq('user_id', user.id)
          .gte('recorded_at', monthStart.toISOString())
          .lte('recorded_at', monthEnd.toISOString());

        const monthSpending = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const monthOrders = orders?.length || 0;
        const avgBac = sessions?.length ? sessions.reduce((sum, s) => sum + Number(s.estimated_bac || 0), 0) / sessions.length : 0;
        const biometricCount = biometrics?.length || 0;

        totalSpending += monthSpending;
        totalOrders += monthOrders;
        totalBiometricSessions += biometricCount;

        data.push({
          month: monthKey,
          spending: monthSpending,
          orders: monthOrders,
          avgBac: avgBac,
          biometricReadings: biometricCount
        });
      }

      setMonthlyData(data);
      setTotals({
        totalSpending,
        totalOrders,
        avgMonthlySpending: totalSpending / 24,
        biometricSessions: totalBiometricSessions
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6">
                <div className="h-20 bg-muted/20 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Account Dashboard
          </h1>
          <p className="text-white/80 mt-2">Track your spending, orders, and biometric data over the last 24 months</p>
        </div>
        <Badge className="bg-primary text-black border-primary hover:bg-primary/90 font-semibold">
          <Calendar className="w-4 h-4 mr-2" />
          Last 24 Months
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-purple-900/60 backdrop-blur-sm border-purple-600/50 hover:border-primary/70 transition-all duration-300 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total Spending</p>
                <p className="text-3xl font-bold text-accent mt-1">${totals.totalSpending.toFixed(2)}</p>
              </div>
              <div className="bg-primary/30 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/60 backdrop-blur-sm border-purple-600/50 hover:border-primary/70 transition-all duration-300 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-primary mt-1">{totals.totalOrders}</p>
              </div>
              <div className="bg-primary/30 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/60 backdrop-blur-sm border-purple-600/50 hover:border-primary/70 transition-all duration-300 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Avg Monthly Spending</p>
                <p className="text-3xl font-bold text-accent mt-1">${totals.avgMonthlySpending.toFixed(2)}</p>
              </div>
              <div className="bg-primary/30 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/60 backdrop-blur-sm border-purple-600/50 hover:border-primary/70 transition-all duration-300 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Biometric Sessions</p>
                <p className="text-3xl font-bold text-primary mt-1">{totals.biometricSessions}</p>
              </div>
              <div className="bg-primary/30 p-3 rounded-full">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="spending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-purple-900/80 backdrop-blur-sm border-purple-600/50">
          <TabsTrigger value="spending" className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/80 font-semibold">
            Spending Trends
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/80 font-semibold">
            Order Volume
          </TabsTrigger>
          <TabsTrigger value="biometrics" className="data-[state=active]:bg-primary data-[state=active]:text-black text-white/80 font-semibold">
            Biometric Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spending">
          <Card className="bg-purple-900/60 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-white font-semibold">Monthly Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-purple-900/60 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-white font-semibold">Monthly Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biometrics">
          <Card className="bg-purple-900/60 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-white font-semibold">Biometric Activity & Average BAC</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="readings"
                    orientation="left"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="bac"
                    orientation="right"
                    stroke="hsl(var(--destructive))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    yAxisId="readings"
                    type="monotone" 
                    dataKey="biometricReadings" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Biometric Readings"
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    yAxisId="bac"
                    type="monotone" 
                    dataKey="avgBac" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    name="Average BAC"
                    dot={{ fill: 'hsl(var(--destructive))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};