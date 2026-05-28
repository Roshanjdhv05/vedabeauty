import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Tag, Plus, Trash2, Calendar, Percent, Loader2, X, ShoppingBag, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Detail view state
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoOrders, setPromoOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    expiry_date: ''
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromoOrders = async (promo) => {
    setSelectedPromo(promo);
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_id, customer_name, total_amount, discount_amount, created_at, status')
        .eq('promo_code_id', promo.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoOrders(data || []);
    } catch (error) {
      console.error('Error fetching promo orders:', error);
      setPromoOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount_percentage || !formData.expiry_date) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('promo_codes')
        .insert([{
          code: formData.code.toUpperCase().trim(),
          discount_percentage: parseInt(formData.discount_percentage),
          expiry_date: new Date(formData.expiry_date).toISOString()
        }]);

      if (error) throw error;

      setFormData({ code: '', discount_percentage: '', expiry_date: '' });
      setIsModalOpen(false);
      fetchPromoCodes();
    } catch (error) {
      console.error('Error creating promo code:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this promo code?')) return;

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      alert('Failed to delete promo code');
    }
  };

  const totalOrders = promoOrders.length;
  const totalRevenue = promoOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalDiscountGiven = promoOrders.reduce((sum, o) => sum + (o.discount_amount || 0), 0);
  const uniqueCustomers = new Set(promoOrders.map(o => o.customer_name)).size;

  // ── Detail View ──
  if (selectedPromo) {
    const isExpired = new Date(selectedPromo.expiry_date) < new Date();
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedPromo(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6 font-bold text-sm"
        >
          <ArrowLeft size={18} /> Back to Promo Codes
        </button>

        {/* Promo Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Tag size={18} className="text-accent" />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter">{selectedPromo.code}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                isExpired ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}>
                {isExpired ? 'Expired' : 'Active'}
              </span>
            </div>
            <p className="text-gray-500 ml-13">
              {selectedPromo.discount_percentage}% discount · Expires {new Date(selectedPromo.expiry_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: totalOrders, icon: <ShoppingBag size={20} />, color: 'bg-blue-50 text-blue-600' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'bg-green-50 text-green-600' },
            { label: 'Discount Given', value: `₹${totalDiscountGiven.toLocaleString()}`, icon: <Percent size={20} />, color: 'bg-rose-50 text-rose-600' },
            { label: 'Unique Customers', value: uniqueCustomers, icon: <Users size={20} />, color: 'bg-purple-50 text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-lg">Orders Using This Code</h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{totalOrders} orders</span>
          </div>
          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : promoOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-40" />
              <p className="font-bold">No orders found for this promo code yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Discount</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {promoOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-sm text-accent">{order.order_id}</td>
                      <td className="p-4 text-sm font-medium">{order.customer_name}</td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-bold text-green-600">
                        -₹{order.discount_amount || 0}
                      </td>
                      <td className="p-4 font-bold text-sm">₹{order.total_amount?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-yellow-50 text-yellow-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Main Promo Codes List ──
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Promo Codes</h1>
          <p className="text-gray-500 mt-1">Click a code to view its order analytics</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all"
        >
          <Plus size={16} /> Create Code
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Code</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Discount</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Expiry</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No promo codes found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  promoCodes.map((promo) => {
                    const isExpired = new Date(promo.expiry_date) < new Date();
                    return (
                      <tr
                        key={promo.id}
                        onClick={() => fetchPromoOrders(promo)}
                        className="border-b border-gray-50 hover:bg-accent/5 transition-colors cursor-pointer group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                              <Tag size={16} className="text-accent" />
                            </div>
                            <div>
                              <span className="font-bold text-sm tracking-wide block">{promo.code}</span>
                              <span className="text-[10px] text-gray-400 font-medium">Click to view orders →</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 font-bold">
                            {promo.discount_percentage}% <Percent size={12} className="text-gray-400" />
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar size={14} />
                            {new Date(promo.expiry_date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            isExpired ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {isExpired ? 'Expired' : 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => handleDelete(promo.id, e)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create Promo Code</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. SUMMER30"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Discount Percentage (%)</label>
                  <input
                    type="number"
                    required
                    min="1" max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                    placeholder="e.g. 15"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Expiry Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-gray-100 text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {saving ? 'Saving...' : 'Save Code'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPromoCodes;
