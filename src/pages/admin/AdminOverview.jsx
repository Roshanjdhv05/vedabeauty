import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  Activity,
  Package,
  ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { supabase } from '../../lib/supabase';

const StatCard = ({ title, value, icon, color, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
    </div>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-3xl font-serif font-bold text-gray-900">{value}</h3>
    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">{description}</p>
  </motion.div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    profit: 0,
    products: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users Count
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      
      // 2. Fetch Orders & Profit
      const { data: ordersData } = await supabase.from('orders').select('profit_amount, total_amount, created_at');
      const totalProfit = ordersData?.reduce((acc, curr) => acc + (curr.profit_amount || 0), 0) || 0;
      const totalOrders = ordersData?.length || 0;

      // 3. Fetch Product Count
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

      setStats({
        users: userCount || 0,
        orders: totalOrders,
        profit: totalProfit,
        products: productCount || 0
      });

      // Format Chart Data (Last 7 days)
      if (ordersData && ordersData.length > 0) {
        // Simple grouping logic for real data
        const grouped = ordersData.reduce((acc, order) => {
          const day = new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short' });
          acc[day] = (acc[day] || 0) + (order.profit_amount || 0);
          return acc;
        }, {});
        
        const formatted = Object.keys(grouped).map(day => ({
          name: day,
          profit: grouped[day]
        }));
        setChartData(formatted);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
         <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
         <p className="text-xs font-bold uppercase tracking-[0.2em]">Synchronizing Master Terminal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Clients" 
          value={stats.users} 
          icon={<Users size={24} />} 
          color="bg-blue-500" 
          description="Registered Professional Accounts"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.orders} 
          icon={<ShoppingBag size={24} />} 
          color="bg-purple-500" 
          description="Wholesale Shipments to Date"
        />
        <StatCard 
          title="Net Profits" 
          value={`₹${stats.profit.toLocaleString()}`} 
          icon={<IndianRupee size={24} />} 
          color="bg-green-500" 
          description="Consolidated Business Earnings"
        />
        <StatCard 
          title="Live Inventory" 
          value={stats.products} 
          icon={<Package size={24} />} 
          color="bg-orange-500" 
          description="Active Products in Database"
        />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 gap-8">
        {chartData.length > 0 ? (
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">Live Profit Tracking</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time database performance</p>
               </div>
               <TrendingUp className="text-accent" size={24} />
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: 'none', 
                      borderRadius: '16px', 
                      fontSize: '12px',
                      color: '#fff' 
                    }}
                    itemStyle={{ color: '#FFD700' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#FFD700" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorProfit)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
                <ShieldAlert size={40} />
             </div>
             <h3 className="text-2xl font-serif font-bold text-gray-900">Analytics Offline</h3>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 max-w-sm mx-auto">
               No transaction data found in the 'orders' table. Charts will automatically activate once you receive your first wholesale order.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
