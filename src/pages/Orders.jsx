import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ChevronRight, 
  ArrowLeft,
  Search,
  Clock,
  MapPin,
  Package,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { getCartItemImageCandidates, FALLBACK_IMAGE } from '../lib/imageResolver';
import SmartProductImage from '../components/ui/SmartProductImage';

const OrderCard = ({ order, onDetails, onInvoice }) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const statusColor = {
    pending: 'text-[#D4AF37] bg-[#D4AF37]/10',
    accepted: 'text-[#DB2777] bg-pink-50',
    shipped: 'text-blue-500 bg-blue-50',
    delivered: 'text-green-500 bg-green-50',
    cancelled: 'text-red-500 bg-red-50',
  }[order.status?.toLowerCase()] || 'text-gray-400 bg-gray-50';


  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 mb-4 hover:border-pink-100 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[#DB2777] text-[10px] font-black uppercase tracking-widest mb-1">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${statusColor}`}>
          {order.status || 'pending'}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
            <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-gray-100 flex-shrink-0">
              <SmartProductImage
                candidates={getCartItemImageCandidates(item)}
                fallbackSrc={FALLBACK_IMAGE}
                alt={item.name}
                objectFit="cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-[11px] font-bold text-gray-900 leading-tight truncate">{item.name}</h4>
                <span className="text-[11px] font-black text-[#DB2777] flex-shrink-0">₹{item.price}</span>
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-400">
           <MapPin size={10} />
           <span className="text-[9px] font-bold uppercase tracking-widest truncate">{order.city}</span>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Total Pay</p>
          <p className="text-sm font-black text-[#DB2777]">₹{order.total_amount}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onDetails(order.id)}
          className="w-full py-3 bg-[#DB2777] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all active:scale-95 shadow-md shadow-pink-100"
        >
          Track Order
        </button>
        <button 
          onClick={() => onInvoice(order.id)}
          className="w-full py-3 bg-white text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-pink-50 border border-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <FileText size={14} className="text-[#DB2777]" />
          Invoice
        </button>
      </div>

    </motion.div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await getUserOrders(user.id);
    setOrders(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate('/profile')} className="p-2 hover:bg-gray-50 rounded-xl transition-all">
          <ArrowLeft size={20} className="text-[#DB2777]" />
        </button>
        <h1 className="text-xl font-bold text-[#DB2777] uppercase tracking-wider">My Orders</h1>
      </div>

      <div className="px-4 mt-6 max-w-xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-3 border-[#DB2777] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onDetails={(id) => navigate(`/orders/${id}`)}
                onInvoice={(id) => navigate(`/order/${id}/invoice`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-pink-50 shadow-sm">
             <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#DB2777] mx-auto mb-4">
                <ShoppingBag size={32} />
             </div>
             <h3 className="text-lg font-bold text-[#DB2777]">No Orders Yet</h3>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
               Start shopping to build your order history
             </p>
             <button 
               onClick={() => navigate('/')}
               className="mt-6 px-8 py-3 bg-[#DB2777] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all"
             >
               Go to Shop
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

