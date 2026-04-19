import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter, 
  ChevronRight, 
  Image as ImageIcon,
  Tag,
  Star,
  CheckCircle2,
  X,
  AlertCircle,
  Pen
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState(['All']);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Brand State
  const [newBrand, setNewBrand] = useState({
    name: '',
    logo_url: '',
    description: ''
  });
  const defaultProductForm = {
    name: '',
    brand_name: '',
    category: '',
    price: '',
    image_url: '',
    description: ''
  };
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBrandImage, setIsUploadingBrandImage] = useState(false);
  const [registeredBrandObjects, setRegisteredBrandObjects] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch Products first to extract unique brands as a fallback
      const { data: productsData } = await supabase.from('products').select('*');
      let productBrands = [];
      if (productsData) {
        setProducts(productsData);
        productBrands = Array.from(new Set(productsData.map(p => p.brand || p.brand_name).filter(Boolean)));
      }

      // Fetch Brands from brands table
      const { data: brandsData } = await supabase.from('brands').select('*');
      let registeredBrands = [];
      if (brandsData) {
        setRegisteredBrandObjects(brandsData);
        registeredBrands = brandsData.map(b => b.name);
      }

      // Combine and deduplicate
      const allUniqueBrands = Array.from(new Set([...registeredBrands, ...productBrands]));
      setBrands(['All', ...allUniqueBrands.sort()]);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => {
    // Check brand matching (case-insensitive for safety)
    const matchesBrand = selectedBrand === 'All' || 
                        p.brand?.toLowerCase() === selectedBrand.toLowerCase() ||
                        p.brand_name?.toLowerCase() === selectedBrand.toLowerCase();
                        
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      brand_name: product.brand_name || product.brand || '',
      category: product.category || '',
      price: product.price || '',
      image_url: product.image_url || product.image || '',
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setProductForm(defaultProductForm);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSavingProduct(true);
    try {
      if (editingProduct) {
        const { error } = await supabase.from('products').update(productForm).eq('id', editingProduct.id);
        if (error) throw error;
        alert('Product updated successfully!');
      } else {
        const { error } = await supabase.from('products').insert([productForm]);
        if (error) throw error;
        alert('Product added successfully!');
      }
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error) {
      if (error.code === '42501') {
        alert('Database Security Error (RLS): You do not have permission to modify products.');
      } else {
        alert(`Error saving product: ${error.message}`);
      }
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      
      setProductForm({ ...productForm, image_url: data.publicUrl });
    } catch (error) {
      console.error('Upload Error:', error);
      alert(`Error uploading image: ${error.message}. Please ensure you have a public storage bucket named 'product-images' in Supabase.`);
    } finally {
      setIsUploading(false);
    }
  };


  const handleBrandImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingBrandImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      
      setNewBrand({ ...newBrand, [field]: data.publicUrl });
    } catch (error) {
      alert(`Error uploading image: ${error.message}. Please check storage permissions.`);
    } finally {
      setIsUploadingBrandImage(false);
    }
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.name) return;

    setIsSavingBrand(true);
    try {
      if (editingBrand) {
        const { error } = await supabase
          .from('brands')
          .update({
            name: newBrand.name,
            logo_url: newBrand.logo_url || '/brands/default_logo.png',
            description: newBrand.description
          })
          .eq('id', editingBrand.id);
        if (error) throw error;
        alert('Brand updated successfully!');
      } else {
        const { error } = await supabase
          .from('brands')
          .insert([{
            name: newBrand.name,
            logo_url: newBrand.logo_url || '/brands/default_logo.png',
            description: newBrand.description
          }]);
        if (error) throw error;
        alert('Brand registered successfully!');
      }

      setNewBrand({ name: '', logo_url: '', description: '' });
      setEditingBrand(null);
      setIsBrandModalOpen(false);
      fetchInitialData();
    } catch (error) {
      if (error.code === '42501') {
        alert('Database Security Error (RLS): You do not have permission to modify brands. Please check your Supabase RLS policies.');
      } else {
        alert(`Error saving brand: ${error.message}`);
      }
    } finally {
      setIsSavingBrand(false);
    }
  };

  const handleDeleteBrand = async (brandObj) => {
    if (!window.confirm(`Are you sure you want to delete the brand "${brandObj.name}"? This action cannot be undone.`)) return;

    try {
      const { error } = await supabase.from('brands').delete().eq('id', brandObj.id);
      if (error) throw error;
      
      alert('Brand deleted successfully!');
      if (selectedBrand === brandObj.name) setSelectedBrand('All');
      fetchInitialData();
    } catch (error) {
      if (error.code === '42501') {
        alert('Database Security Error: You do not have permission to delete brands.');
      } else {
        alert(`Error deleting brand: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex gap-10">
      {/* Brands Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm sticky top-32">
          <div className="flex items-center gap-2 mb-8">
            <Filter size={18} className="text-accent" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Inventory Brands</h3>
          </div>
          <div className="space-y-1">
            {brands.map(brand => {
              const brandObj = registeredBrandObjects.find(b => b.name === brand);
              
              return (
                <div key={brand} className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedBrand(brand)}
                    className={`flex-1 flex items-center justify-between p-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                      selectedBrand === brand 
                      ? 'bg-black text-white shadow-lg' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span>{brand}</span>
                    <ChevronRight size={14} className={selectedBrand === brand ? 'opacity-100' : 'opacity-0'} />
                  </button>
                  
                  {/* Show Edit/Register button for all brands except 'All' */}
                  {brand !== 'All' && (
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (brandObj) {
                            setEditingBrand(brandObj);
                            setNewBrand({ name: brandObj.name, logo_url: brandObj.logo_url, description: brandObj.description });
                          } else {
                            // It's a fallback brand from products, so we act like registering a new one with prefilled name
                            setEditingBrand(null);
                            setNewBrand({ name: brand, logo_url: '', description: '' });
                          }
                          setIsBrandModalOpen(true);
                        }}
                        className="p-2 bg-gray-50 rounded-lg hover:bg-gray-200 transition-colors text-gray-400 hover:text-black"
                        title={brandObj ? "Edit Brand" : "Register Brand Setup"}
                      >
                        <Pen size={12} />
                      </button>
                      
                      {brandObj && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBrand(brandObj);
                          }}
                          className="p-2 bg-gray-50 rounded-lg hover:bg-red-100 transition-colors text-gray-400 hover:text-red-500"
                          title="Delete Brand"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => {
              setEditingBrand(null);
              setNewBrand({ name: '', logo_url: '', description: '' });
              setIsBrandModalOpen(true);
            }}
            className="w-full mt-10 py-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Register New Brand
          </button>
        </div>
      </aside>

      {/* Product Management Area */}
      <div className="flex-1 space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search live inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-accent/50 shadow-sm"
              />
           </div>
           <button 
             onClick={handleAddNew}
             className="bg-black text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
           >
             <Plus size={18} className="text-accent" /> Add New Product
           </button>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
               <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Fetching Database...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Info</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price (INR)</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                          <img 
                            src={p.image || p.image_url} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=100';
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</span>
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{p.brand || p.brand_name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-gray-900">₹{p.price}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(p)}
                          className="p-3 text-gray-400 hover:text-black hover:bg-white rounded-xl shadow-sm transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="p-3 text-red-300 hover:text-red-500 hover:bg-white rounded-xl shadow-sm transition-all">
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
               <h4 className="text-lg font-serif font-bold text-gray-900">No Products Found</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 max-w-xs">
                 We couldn't find any products for {selectedBrand}. Add your first product to get started.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal (Simplified for real use) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              {/* Modal Content - Reusing the previous styling but linking to state/handlers */}
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      Live Database Sync Active
                    </p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black">
                   <X size={20} />
                 </button>
              </div>

              {/* Product Form */}
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Product Name*</label>
                    <input 
                      type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Brand Name*</label>
                    <input 
                      type="text" required value={productForm.brand_name} onChange={(e) => setProductForm({...productForm, brand_name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Category</label>
                    <input 
                      type="text" value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Price (₹)*</label>
                    <input 
                      type="number" required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Product Image</label>
                    <div className="flex items-center gap-4">
                      {productForm.image_url && (
                        <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50">
                          <img src={productForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-all cursor-pointer"
                        />
                        {isUploading && <p className="text-[10px] text-accent font-bold mt-2 ml-2 animate-pulse">Uploading image to Supabase...</p>}
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3 ml-4">
                      Or paste an external Image URL:
                    </p>
                    <input 
                      type="text" value={productForm.image_url} onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                      placeholder="https://example.com/image.png"
                      className="w-full mt-2 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-6 text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Description</label>
                    <textarea 
                      value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={isSavingProduct}
                  className="w-full bg-black text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSavingProduct ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                    <>
                      <CheckCircle2 size={16} />
                      {editingProduct ? 'Save Changes' : 'Add Product'}
                    </>
                  )}
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Brand Registration Modal */}
      <AnimatePresence>
        {isBrandModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBrandModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900">{editingBrand ? 'Edit Brand' : 'Register New Brand'}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      {editingBrand ? 'Update brand details' : 'Add a new brand to your inventory'}
                    </p>
                 </div>
                 <button onClick={() => setIsBrandModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black">
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSaveBrand} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Brand Name*</label>
                  <input 
                    type="text"
                    required
                    value={newBrand.name}
                    onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50"
                    placeholder="e.g. LAKME, MARS, etc."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Brand Logo</label>
                  <div className="flex items-center gap-4">
                    {newBrand.logo_url && (
                      <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50 p-2">
                        <img src={newBrand.logo_url} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleBrandImageUpload(e, 'logo_url')}
                        disabled={isUploadingBrandImage}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-all cursor-pointer"
                      />
                      {isUploadingBrandImage && <p className="text-[10px] text-accent font-bold mt-2 ml-2 animate-pulse">Uploading...</p>}
                    </div>
                  </div>
                  <input 
                    type="text"
                    value={newBrand.logo_url}
                    onChange={(e) => setNewBrand({...newBrand, logo_url: e.target.value})}
                    className="w-full mt-2 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-6 text-sm focus:outline-none focus:border-accent/50"
                    placeholder="Or paste external logo URL..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Description</label>
                  <textarea 
                    value={newBrand.description}
                    onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 min-h-[100px] resize-none"
                    placeholder="Enter brand legacy/description..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSavingBrand || isUploadingBrandImage}
                  className="w-full bg-black text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSavingBrand ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {editingBrand ? 'Save Changes' : 'Confirm Registration'}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
