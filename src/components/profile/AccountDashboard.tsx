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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Dashboard</h1>
          <p className="text-muted-foreground">Track your spending, orders, and biometric data over the last 24 months</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary/30">
          <Calendar className="w-4 h-4 mr-2" />
          Last 24 Months
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Spending</p>
                <p className="text-2xl font-bold text-foreground">${totals.totalSpending.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{totals.totalOrders}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Monthly Spending</p>
                <p className="text-2xl font-bold text-foreground">${totals.avgMonthlySpending.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Biometric Sessions</p>
                <p className="text-2xl font-bold text-foreground">{totals.biometricSessions}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="spending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/30 backdrop-blur-sm">
          <TabsTrigger value="spending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Spending Trends
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Order Volume
          </TabsTrigger>
          <TabsTrigger value="biometrics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Biometric Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spending">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Spending Trends</CardTitle>
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
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Order Volume</CardTitle>
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
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Biometric Activity & Average BAC</CardTitle>
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