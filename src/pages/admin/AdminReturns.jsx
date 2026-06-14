import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Search, Image as ImageIcon, CheckCircle2, XCircle, AlertCircle, Clock, ExternalLink, X } from 'lucide-react';

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .like('name', 'RETURN_REQUEST|%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReturns(data || []);
    } catch (err) {
      console.error('Error fetching returns:', err);
    }
    setLoading(false);
  };

  const updateStatus = async (msgId, newStatus) => {
    // Store the new status in the phone field suffix for now
    // We update phone to include status
    try {
      const ret = returns.find(r => r.id === msgId);
      if (!ret) return;
      const baseUrl = ret.phone?.split('|STATUS:')[0] || ret.phone;
      const { error } = await supabase
        .from('contact_messages')
        .update({ phone: `${baseUrl}|STATUS:${newStatus}` })
        .eq('id', msgId);
      if (error) throw error;
      setReturns(returns.map(r => r.id === msgId 
        ? { ...r, phone: `${baseUrl}|STATUS:${newStatus}` } 
        : r
      ));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const parseReturn = (r) => {
    const orderId = r.name?.replace('RETURN_REQUEST|', '') || '';
    const parts = r.phone?.split('|STATUS:') || [];
    const imageUrl = parts[0] || '';
    const status = parts[1] || 'pending';
    return { orderId, reason: r.email, description: r.message, imageUrl, status };
  };

  const filteredReturns = returns.filter(r => {
    const parsed = parseReturn(r);
    const matchesSearch = parsed.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          parsed.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || parsed.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 w-max"><CheckCircle2 size={12} /> Approved</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 w-max"><XCircle size={12} /> Rejected</span>;
      default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 w-max"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Return Requests</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-black transition-colors w-64"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReturns.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl border border-gray-100 text-center">
          <AlertCircle size={40} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Returns Found</h3>
          <p className="text-sm text-gray-500">There are no return requests matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReturns.map(r => {
            const { orderId, reason, description, imageUrl, status } = parseReturn(r);
            return (
            <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
               
               {/* Image Thumbnail */}
               <div className="w-full md:w-32 h-32 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 relative group cursor-pointer"
                    onClick={() => setSelectedImage(imageUrl)}>
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Return Evidence" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <ImageIcon className="text-white w-6 h-6" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                       <ImageIcon size={24} />
                    </div>
                  )}
               </div>

               {/* Details */}
               <div className="flex-1 flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                         <div className="flex items-center gap-2">
                           <h4 className="text-sm font-black text-gray-900">#{orderId.slice(0, 8).toUpperCase()}</h4>
                           <a href={`/admin/orders`} className="text-blue-500 hover:text-blue-700" title="Go to Orders">
                             <ExternalLink size={14} />
                           </a>
                         </div>
                       </div>
                       {getStatusBadge(status)}
                    </div>
                    
                    <h5 className="text-sm font-bold text-red-600 mb-1">{reason}</h5>
                    <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {description}
                    </p>
                 </div>

                 <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       Submitted on: {new Date(r.created_at).toLocaleDateString()}
                    </span>
                    
                    {status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateStatus(r.id, 'rejected')}
                          className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => updateStatus(r.id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors shadow-md shadow-green-600/20"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                 </div>
               </div>
            </div>
          )})}        </div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative max-w-4xl max-h-[90vh] w-full"
               onClick={e => e.stopPropagation()}
             >
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
                >
                  <X size={32} />
                </button>
                <img src={selectedImage} alt="Enlarged Return Evidence" className="w-full h-full object-contain rounded-xl" />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminReturns;
