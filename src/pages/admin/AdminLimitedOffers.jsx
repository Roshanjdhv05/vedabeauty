import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, X, AlertCircle, Calendar, Percent, Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLimitedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Products related state
  const [products, setProducts] = useState([]);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productBrandFilter, setProductBrandFilter] = useState('');
  
  const defaultForm = {
    banner_url: '',
    start_time: '',
    end_time: '',
    discount_percentage: 10,
    is_active: true
  };
  
  const [form, setForm] = useState(defaultForm);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('limited_offers')
        .select(`
          *,
          limited_offer_products(product_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, brands(name)');
      
      if (error) throw error;
      
      const normalizedProducts = (data || []).map(p => {
        const resolvedBrandName = p.brands?.name || p.brand || p.brand_name;
        return {
          ...p,
          brand: resolvedBrandName
        };
      });
      setProducts(normalizedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddNew = () => {
    setForm(defaultForm);
    setSelectedProductIds([]);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (offer) => {
    setForm({
      banner_url: offer.banner_url,
      start_time: new Date(offer.start_time).toISOString().slice(0, 16),
      end_time: new Date(offer.end_time).toISOString().slice(0, 16),
      discount_percentage: offer.discount_percentage,
      is_active: offer.is_active
    });
    setSelectedProductIds(offer.limited_offer_products?.map(p => p.product_id) || []);
    setEditingId(offer.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      const { error } = await supabase.from('limited_offers').delete().eq('id', id);
      if (error) throw error;
      fetchOffers();
    } catch (error) {
      alert(`Error deleting offer: ${error.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const offerData = {
        banner_url: form.banner_url,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
        discount_percentage: parseFloat(form.discount_percentage),
        is_active: form.is_active
      };

      let currentOfferId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from('limited_offers')
          .update(offerData)
          .eq('id', editingId);
        if (error) throw error;
        
        // Clear existing product links
        await supabase.from('limited_offer_products').delete().eq('offer_id', editingId);
      } else {
        const { data, error } = await supabase
          .from('limited_offers')
          .insert([offerData])
          .select()
          .single();
        if (error) throw error;
        currentOfferId = data.id;
      }

      // Insert selected products
      if (selectedProductIds.length > 0) {
        const productLinks = selectedProductIds.map(pid => ({
          offer_id: currentOfferId,
          product_id: pid
        }));
        const { error: linkError } = await supabase
          .from('limited_offer_products')
          .insert(productLinks);
        if (linkError) throw linkError;
      }

      setIsModalOpen(false);
      fetchOffers();
      alert('Offer saved successfully!');
    } catch (error) {
      alert(`Error saving offer: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `offer_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setForm({ ...form, banner_url: data.publicUrl });
    } catch (error) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredOffers = offers.filter(o => 
    o.banner_url?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.id.includes(searchQuery)
  );

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
                          p.brand?.toLowerCase().includes(productSearchQuery.toLowerCase());
    const matchesBrand = productBrandFilter === '' || p.brand?.toLowerCase() === productBrandFilter.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-accent/50 shadow-sm"
            />
         </div>
         <button 
           onClick={handleAddNew}
           className="bg-black text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
         >
           <Plus size={18} className="text-accent" /> Create New Offer
         </button>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
             <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest">Loading Offers...</p>
          </div>
        ) : filteredOffers.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Banner</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Products</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="w-24 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                      {offer.banner_url ? (
                        <img src={offer.banner_url} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-900 font-medium">
                        Starts: {new Date(offer.start_time).toLocaleString()}
                      </span>
                      <span className="text-xs text-red-500 font-medium">
                        Ends: {new Date(offer.end_time).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-lg font-bold text-green-600">{offer.discount_percentage}% OFF</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500">
                      {offer.limited_offer_products?.length || 0} items
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {offer.is_active ? (
                      <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-bold uppercase tracking-widest">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[9px] font-bold uppercase tracking-widest">Inactive</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(offer)}
                        className="p-3 text-gray-400 hover:text-black hover:bg-white rounded-xl shadow-sm transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(offer.id)}
                        className="p-3 text-red-300 hover:text-red-500 hover:bg-white rounded-xl shadow-sm transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-10">
             <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-4">
                <AlertCircle size={32} />
             </div>
             <h4 className="text-lg font-serif font-bold text-gray-900">No Offers Found</h4>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 max-w-xs">
               Create a new limited offer to boost your sales.
             </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar flex flex-col"
            >
              <div className="flex justify-between items-start mb-8 shrink-0">
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900">
                      {editingId ? 'Edit Limited Offer' : 'Create Limited Offer'}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      Configure banner, schedule, and products
                    </p>
                 </div>
                 <button disabled={isSaving} onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black">
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Form Details */}
                <div className="flex-1 space-y-6">
                  {/* Banner */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Banner Image Vertical Layout*</label>
                    <div className="flex flex-col gap-4">
                      {form.banner_url && (
                        <div className="w-full h-40 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img src={form.banner_url} alt="Banner Preview" className="h-full object-contain" />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-all cursor-pointer"
                      />
                      {isUploading && <p className="text-[10px] text-accent font-bold mt-2 animate-pulse">Uploading image...</p>}
                      <input 
                        type="url" 
                        value={form.banner_url} 
                        onChange={(e) => setForm({...form, banner_url: e.target.value})}
                        placeholder="Or enter image URL (recommend vertical image)"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-6 text-sm focus:outline-none focus:border-accent/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Start Time*</label>
                      <input 
                        type="datetime-local" 
                        required 
                        value={form.start_time} 
                        onChange={(e) => setForm({...form, start_time: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-6 text-sm focus:outline-none focus:border-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">End Time*</label>
                      <input 
                        type="datetime-local" 
                        required 
                        value={form.end_time} 
                        onChange={(e) => setForm({...form, end_time: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-6 text-sm focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>

                  {/* Discount & Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Discount (%)*</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="100" 
                        required 
                        value={form.discount_percentage} 
                        onChange={(e) => setForm({...form, discount_percentage: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-6 text-sm focus:outline-none focus:border-accent/50"
                      />
                    </div>
                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={form.is_active} 
                          onChange={(e) => setForm({...form, is_active: e.target.checked})}
                          className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="text-sm font-bold text-gray-700">Offer is Active</span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100 mt-6">
                    <button 
                      type="submit" 
                      disabled={isSaving || isUploading}
                      className="w-full bg-black text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                         <Plus size={16} />
                      )}
                      Save Offer
                    </button>
                  </div>
                </div>

                {/* Right Column: Product Selection */}
                <div className="flex-1 flex flex-col bg-gray-50 rounded-2xl p-6 border border-gray-100 min-h-[400px]">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4 flex justify-between items-center">
                    <span>Select Products</span>
                    <span className="bg-accent/20 text-accent px-2 py-1 rounded text-[10px]">{selectedProductIds.length} Selected</span>
                  </h4>
                  
                  {/* Filters */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="text"
                        placeholder="Search product..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-accent/50"
                      />
                    </div>
                    <select 
                      value={productBrandFilter}
                      onChange={(e) => setProductBrandFilter(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-accent/50 max-w-[120px]"
                    >
                      <option value="">All Brands</option>
                      {uniqueBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product List for Selection */}
                  <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 p-2 space-y-1 no-scrollbar h-[350px]">
                    {filteredProducts.map(product => {
                      const isSelected = selectedProductIds.includes(product.id);
                      return (
                        <div 
                          key={product.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedProductIds(selectedProductIds.filter(id => id !== product.id));
                            } else {
                              setSelectedProductIds([...selectedProductIds, product.id]);
                            }
                          }}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${
                            isSelected ? 'bg-accent/10 border-accent/30' : 'hover:bg-gray-50 border-transparent'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            className="rounded border-gray-300 text-accent focus:ring-accent"
                          />
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {(product.image || product.image_url) ? (
                              <img src={product.image || product.image_url} alt="" className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{product.brand}</p>
                          </div>
                          <div className="text-xs font-bold text-gray-900">
                            ₹{product.price}
                          </div>
                        </div>
                      )
                    })}
                    {filteredProducts.length === 0 && (
                      <div className="text-center p-4 text-xs text-gray-500">No products match your search.</div>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLimitedOffers;
