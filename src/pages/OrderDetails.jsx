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

  const currentIdx = foundIdx;

  return (
    <div className="relative flex justify-center items-center gap-6 md:gap-12 px-4 py-2">
      {/* Background Line */}
      <div className="absolute top-[20px] left-12 right-12 h-[2px] bg-gray-100 z-0" />
      
      {/* Progress Line */}
      <div 
        className="absolute top-[20px] left-12 h-[2px] bg-pink-500 z-0 transition-all duration-1000 ease-out" 
        style={{ width: `${currentIdx >= 0 ? (currentIdx / (stages.length - 1)) * (100 - 24) : 0}%` }}
      />
      
      {stages.map((stage, i) => {
        const isActive = i <= currentIdx;
        const isCurrent = i === currentIdx;
        
        return (
          <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${
               isActive 
                ? 'bg-pink-500 text-white shadow-lg' 
                : 'bg-white border border-gray-100 text-gray-300'
             } ${isCurrent ? 'ring-4 ring-pink-50' : ''}`}>
                <stage.icon size={16} />
             </div>
             <div className="text-center min-w-[60px]">
               <span className={`text-[8px] font-black uppercase tracking-wider transition-colors duration-500 ${isActive ? 'text-pink-600' : 'text-gray-300'}`}>
                 {stage.label}
               </span>
             </div>
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
            <ArrowLeft size={20} className="text-[#DB2777]" />
          </button>
          <h1 className="text-xl font-bold text-[#DB2777] uppercase tracking-wider">Order Details</h1>
        </div>
        <button 
          onClick={fetchOrderDetails}
          className="p-2 hover:bg-pink-50 rounded-xl text-[#DB2777] transition-all"
          title="Refresh Progress"
        >
          <RotateCcw size={18} />
        </button>
      </div>


      <div className="px-4 mt-6 max-w-xl mx-auto space-y-5">
        
        {/* A. Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black text-[#DB2777] uppercase tracking-widest mb-1">Order ID</p>
              <h4 className="text-lg font-black text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</h4>
            </div>
            <div className="px-3 py-1 bg-pink-50 text-[#DB2777] rounded-full text-[9px] font-bold uppercase tracking-widest border border-pink-100">
              {order.status || 'pending'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
             <div className="flex items-center gap-3">
               <Calendar size={14} className="text-[#DB2777]" />
               <span className="text-[10px] font-bold text-gray-600">{new Date(order.created_at).toLocaleDateString()}</span>
             </div>
             <div className="flex items-center gap-3">
               <Store size={14} className="text-[#DB2777]" />
               <span className="text-[10px] font-bold text-gray-600 uppercase">Veda Beauty</span>
             </div>
          </div>
        </div>

        {/* B. Tracking Progress */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 overflow-hidden">
           <h3 className="text-sm md:text-base font-serif italic font-bold text-[#DB2777] uppercase tracking-[0.4em] mb-10 text-center">Tracking Progress</h3>
           <TrackingStepper status={order.status} />
        </div>

        {/* C. Items Ordered */}
        <div className="space-y-3">
           <h3 className="text-xs font-bold text-[#DB2777] uppercase tracking-widest px-1">Items Ordered ({items.length})</h3>
           {items.map((item, i) => (
             <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                      <span className="text-sm font-black text-[#DB2777]">₹{item.variant?.price || item.price}</span>
                   </div>
                   {(item.variant?.name || item.variant_name) && (
                     <div className="mt-2 p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                       <p className="text-[9px] text-[#DB2777] font-bold uppercase tracking-widest mb-2 border-b border-pink-100/50 pb-1">Selected Items:</p>
                       <div className="space-y-2">
                         {(item.variant?.name || item.variant_name).split('+').map((v, idx) => {
                           const parts = v.split(':');
                           if (parts.length === 2) {
                             return (
                               <div key={idx} className="flex flex-col">
                                 <span className="text-[10px] font-bold text-gray-800">{parts[0].trim()}</span>
                                 <span className="text-[10px] font-semibold text-gray-500 italic flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-pink-300 ml-1"></div>
                                    {parts[1].trim()}
                                 </span>
                               </div>
                             );
                           }
                           return <div key={idx} className="text-[10px] font-semibold text-gray-600">• {v.trim()}</div>;
                         })}
                       </div>
                     </div>
                   )}
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                </div>
             </div>
           ))}
        </div>

        {/* D. Delivery Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
           <div className="flex items-center gap-3 mb-6">
              <MapPin size={18} className="text-[#DB2777]" />
              <h3 className="text-sm font-bold text-[#DB2777] uppercase tracking-widest">Delivery Details</h3>
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
              <div className="inline-block px-3 py-1 bg-pink-50 text-[#DB2777] rounded-lg text-[8px] font-bold uppercase tracking-widest border border-pink-100">
                Home Delivery
              </div>
           </div>
        </div>

        {/* E. Payment Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
           <h3 className="text-sm font-bold text-[#DB2777] uppercase tracking-widest mb-6">Payment Summary</h3>
           <div className="space-y-3">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Subtotal</span>
                <span>₹{(order.total_amount - (order.shipping_fee || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Delivery Charge</span>
                {order.shipping_fee > 0 ? (
                  <span className="text-black font-bold">₹{order.shipping_fee}.00</span>
                ) : (
                  <span className="text-[#D4AF37]">FREE</span>
                )}
              </div>
              <div className="pt-4 mt-4 border-t border-gray-50">
                <div className="flex justify-center mb-2">
                  <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Tax are included in this order</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Grand Total</span>
                  <span className="text-xl font-black text-[#DB2777]">₹{order.total_amount}.00</span>
                </div>
              </div>
           </div>
        </div>

        {/* F. Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-8">
           <button 
             onClick={() => navigate(`/order/${id}/invoice`)}
             className="py-4 bg-[#DB2777] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-pink-100"
           >
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

