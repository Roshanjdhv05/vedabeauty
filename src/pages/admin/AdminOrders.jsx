import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  ChevronRight, 
  Calendar,
  CreditCard,
  Inbox,
  AlertCircle,
  X,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  Truck,
  XCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const StatusBadge = ({ status }) => {
  const styles = {
    delivered: 'bg-green-50 text-green-600 border-green-100',
    shipped: 'bg-blue-50 text-blue-600 border-blue-100',
    accepted: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
    pending: 'bg-orange-50 text-orange-600 border-orange-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',

  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${styles[status] || styles.pending}`}>
      {status || 'pending'}
    </span>
  );
};

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Order Details</span>
               <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">{order.customer_name}</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl shadow-sm border border-black/5 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side: Items & Status */}
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Package size={12} className="text-accent" />
                  Order Items
                </h3>
                <div className="space-y-4">
                  {Array.isArray(order.items) ? order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-black/5 flex-shrink-0">
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic">No item data available</p>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Manage Order Status</h3>
                <div className="flex flex-wrap gap-3">
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <>
                      {(!order.status || order.status === 'pending') && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'accepted')}
                          className="flex-1 flex items-center justify-center gap-3 p-4 bg-[#D4AF37] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-gold/20"
                        >
                          <CheckCircle2 size={18} />
                          Accept Order
                        </button>
                      )}
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'shipped')}
                          className="flex-1 flex items-center justify-center gap-3 p-4 bg-blue-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20"
                        >
                          <Truck size={18} />
                          Ship Order
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'delivered')}
                          className="flex-1 flex items-center justify-center gap-3 p-4 bg-green-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20"
                        >
                          <Package size={18} />
                          Mark Delivered
                        </button>
                      )}
                    </>
                  )}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'cancelled')}
                      className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      Cancel Order
                    </button>
                  )}
                  {(order.status === 'delivered' || order.status === 'cancelled') && (
                    <div className={`flex-1 p-4 rounded-2xl border text-center font-bold text-[10px] uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
                    }`}>
                      Order is {order.status}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right side: Address & Payment */}
            <div className="space-y-8">
              <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl">
                 <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <MapPin size={12} className="text-accent" />
                    Delivery Address
                 </h3>
                 <div className="space-y-4">
                    <div>
                      <p className="text-xs text-white/60 mb-1">Customer Name</p>
                      <p className="text-sm font-bold">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Street Address</p>
                      <p className="text-sm font-bold leading-relaxed">
                        {order.address_line1}
                        {order.address_line2 && <><br />{order.address_line2}</>}
                        {order.landmark && <><br /><span className="text-white/40 italic">Near: {order.landmark}</span></>}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                         <p className="text-xs text-white/60 mb-1">City, State</p>
                         <p className="text-sm font-bold">{order.city}, {order.state}</p>
                       </div>
                       <div>
                         <p className="text-xs text-white/60 mb-1">Pincode</p>
                         <p className="text-sm font-bold tracking-widest">{order.pincode}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-gray-100 p-8 rounded-[2rem]">
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <CreditCard size={12} className="text-black" />
                    Payment Summary
                 </h3>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Items Total</span>
                      <span className="font-bold">₹{order.total_amount - Math.round(order.total_amount * 0.15)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">GST & Taxes</span>
                      <span className="font-bold">₹{Math.round(order.total_amount * 0.15)}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center mt-4">
                      <span className="text-xs font-bold uppercase tracking-widest">Paid via COD</span>
                      <span className="text-xl font-bold text-black">₹{order.total_amount}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (order.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || order.status?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8">
      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by ID, Customer or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-accent/50 shadow-sm"
            />
         </div>
         <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
            {['All', 'Pending', 'Accepted', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'
              }`}>
                {tab}
              </button>
            ))}
         </div>

      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
             <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest">Retrieving Orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedOrder(order)}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-black/5 transition-all group cursor-pointer"
            >
              <div className="flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-accent group-hover:text-black transition-colors">
                    <Package size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ID: {order.id.slice(0, 8)}</span>
                    <h4 className="text-lg font-serif font-bold text-gray-900">{order.customer_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={10} className="text-accent" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.city}, {order.state}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-10">
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Calendar size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Date</span>
                     </div>
                     <span className="text-xs font-bold text-gray-900">
                       {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                     </span>
                  </div>
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <CreditCard size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Value</span>
                     </div>
                     <span className="text-sm font-bold text-gray-900">₹{order.total_amount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <StatusBadge status={order.status} />
                  <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-10">
             <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-4">
                <Inbox size={32} />
             </div>
             <h4 className="text-lg font-serif font-bold text-gray-900">No Orders Registered</h4>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
               There are no active {activeTab !== 'All' ? activeTab.toLowerCase() : ''} orders in the database.
             </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onUpdateStatus={updateOrderStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;

