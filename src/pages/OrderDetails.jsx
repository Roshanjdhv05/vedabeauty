import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Store, 
  FileText,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  RotateCcw
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TrackingStepper = ({ status }) => {
  const stages = [
    { id: 'accepted', label: 'Accepted', icon: Clock },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const statusLower = status?.toLowerCase();
  const foundIdx = stages.findIndex(s => {
    if (s.id === 'shipped' && statusLower === 'dispatched') return true;
    return s.id === statusLower;
  });

  
  // If the order is delivered, all stages are active
  // If the order is shipped, first 2 stages are active
  // If the order is accepted, first stage is active
  const currentIdx = foundIdx;

  return (
    <div className="relative flex justify-between items-center px-2">
      <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-100 z-0" />
      <div 
        className="absolute top-4 left-0 h-[2px] bg-[#F8C8DC] z-0 transition-all duration-700" 
        style={{ width: `${currentIdx >= 0 ? (currentIdx / (stages.length - 1)) * 100 : 0}%` }}
      />
      
      {stages.map((stage, i) => {
        const isActive = i <= currentIdx;
        const isCurrent = i === currentIdx;
        
        return (
          <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3">
             <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
               isActive ? 'bg-[#F8C8DC] border-[#F8C8DC] text-white' : 'bg-white border-gray-100 text-gray-300'
             } ${isCurrent ? 'ring-4 ring-[#F8C8DC]/20 scale-110 shadow-lg' : ''}`}>
                <stage.icon size={14} />
             </div>
             <span className={`text-[8px] font-bold uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
               {stage.label}
             </span>
          </div>
        );
      })}
    </div>
  );
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
      if (error) throw error;
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
       <div className="w-8 h-8 border-3 border-[#F8C8DC] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="p-10 text-center flex flex-col items-center gap-4">
      <p className="font-bold text-gray-400">Order not found.</p>
      <button onClick={() => navigate('/orders')} className="text-[#F8C8DC] font-bold underline">Go back</button>
    </div>
  );

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-50 rounded-xl transition-all">
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
        </div>
        <button 
          onClick={fetchOrderDetails}
          className="p-2 hover:bg-gray-50 rounded-xl text-[#F8C8DC] transition-all"
          title="Refresh Progress"
        >
          <RotateCcw size={18} />
        </button>
      </div>


      <div className="px-4 mt-6 max-w-xl mx-auto space-y-5">
        
        {/* A. Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
              <h4 className="text-lg font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</h4>
            </div>
            <div className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-[9px] font-bold uppercase tracking-widest">
              orders.{order.status || 'pending'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
             <div className="flex items-center gap-3">
               <Calendar size={14} className="text-[#F8C8DC]" />
               <span className="text-[10px] font-bold text-gray-600">{new Date(order.created_at).toLocaleDateString()}</span>
             </div>
             <div className="flex items-center gap-3">
               <Store size={14} className="text-[#F8C8DC]" />
               <span className="text-[10px] font-bold text-gray-600 uppercase">Veda Beauty</span>
             </div>
          </div>
        </div>

        {/* B. Tracking Progress */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Tracking Progress</h3>
           <TrackingStepper status={order.status} />
        </div>

        {/* C. Items Ordered */}
        <div className="space-y-3">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Items Ordered ({items.length})</h3>
           {items.map((item, i) => (
             <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                      <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                </div>
             </div>
           ))}
        </div>

        {/* D. Delivery Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
           <div className="flex items-center gap-3 mb-6">
              <MapPin size={18} className="text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Delivery Details</h3>
           </div>
           <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-0.5">{order.customer_name}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                  {order.address_line1}, {order.address_line2 && order.address_line2 + ','} {order.landmark && `Near ${order.landmark},`} {order.city}, {order.state} - {order.pincode}
                </p>
              </div>
              <div className="flex items-center gap-2">
                 <Phone size={10} className="text-gray-400" />
                 <span className="text-[10px] font-bold text-gray-400 tracking-widest">+91 98765 43210</span>
              </div>
              <div className="inline-block px-3 py-1 bg-[#F8C8DC]/10 text-[#F8C8DC] rounded-lg text-[8px] font-bold uppercase tracking-widest">
                Home Delivery
              </div>
           </div>
        </div>

        {/* E. Payment Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
           <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Payment Summary</h3>
           <div className="space-y-3">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Subtotal</span>
                <span>₹{order.total_amount}.00</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Delivery Charge</span>
                <span className="text-[#D4AF37]">FREE</span>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Grand Total</span>
                <span className="text-xl font-bold text-[#F8C8DC]">₹{order.total_amount}.00</span>
              </div>
           </div>
        </div>

        {/* F. Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-8">
           <button className="py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 active:scale-95">
              <FileText size={16} />
              View Invoice
           </button>
           <button className="py-4 bg-[#F8C8DC]/20 text-[#F8C8DC] text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#F8C8DC] hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95">
              <RotateCcw size={16} />
              Reorder
           </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;

