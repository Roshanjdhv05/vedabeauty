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
import { getProductImageCandidates } from '../../lib/imageResolver';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState(['All']);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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
    gallery_images: [],
    description: '',
    has_variants: false,
    is_offer: false,
    discount: 0
  };
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [productVariants, setProductVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({
    name: '',
    type: 'shade',
    color_code: '',
    image_url: '',
    price: '',
    stock: 0,
    sub_product_name: ''
  });
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBrandImage, setIsUploadingBrandImage] = useState(false);
  const [registeredBrandObjects, setRegisteredBrandObjects] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isUploadingVariantImage, setIsUploadingVariantImage] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch Products first to extract unique brands as a fallback
      // Also join with brands table to get the brand name if products use brand_id
      const { data: productsData } = await supabase.from('products').select('*, brands(name)');
      let productBrands = [];
      if (productsData) {
        // Normalize the brand name into the product object so filters work easily
        const normalizedProducts = productsData.map(p => {
          const resolvedBrandName = p.brands?.name || p.brand || p.brand_name;
          return {
            ...p,
            brand_name: resolvedBrandName // Ensure we always have a brand_name
          };
        });
        setProducts(normalizedProducts);
        productBrands = Array.from(new Set(normalizedProducts.map(p => p.brand_name).filter(Boolean)));
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
      gallery_images: product.gallery_images || [],
      description: product.description || '',
      has_variants: product.has_variants || false,
      is_offer: product.is_offer || false,
      discount: product.discount || 0
    });
    // Fetch variants for this product
    fetchProductVariants(product.id);
    setIsModalOpen(true);
  };

  const fetchProductVariants = async (productId) => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);
      if (error) throw error;
      setProductVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setProductForm(defaultProductForm);
    setProductVariants([]);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSavingProduct(true);
    try {
      let productId = editingProduct?.id;
      if (editingProduct) {
        const { error } = await supabase.from('products').update(productForm).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert([productForm]).select();
        if (error) throw error;
        productId = data[0].id;
      }

      // Save Variants if enabled
      if (productForm.has_variants) {
        console.log("📤 SAVING VARIANTS TO DATABASE:", productVariants);
        const { saveProductVariants } = await import('../../services/productService');
        const { error: variantError } = await saveProductVariants(productId, productVariants);
        if (variantError) throw variantError;
      }

      alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
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

  const handleGalleryImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const newUrls = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        if (data?.publicUrl) {
          newUrls.push(data.publicUrl);
        }
      }
      
      setProductForm({ 
        ...productForm, 
        gallery_images: [...(productForm.gallery_images || []), ...newUrls] 
      });
    } catch (error) {
      console.error('Gallery Upload Error:', error);
      alert(`Error uploading gallery images: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVariantImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingVariantImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `variant_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      console.log("Attempting upload to Supabase Storage:", fileName);

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      
      if (data?.publicUrl) {
        setNewVariant(prev => ({ ...prev, image_url: data.publicUrl }));
        console.log("Variant image successfully uploaded. Public URL:", data.publicUrl);
        window.alert(`✅ Uploaded successfully!\nURL: ${data.publicUrl}`);
      } else {
        throw new Error("Could not generate public URL");
      }
    } catch (error) {
      console.error("Variant upload error details:", error);
      alert(`❌ Error uploading image: ${error.message}`);
    } finally {
      setIsUploadingVariantImage(false);
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

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) return;

    try {
      // First delete associated variants if any
      // Note: If your Supabase schema has ON DELETE CASCADE on the foreign key, 
      // this manual step might not be strictly necessary but it's safer.
      if (product.has_variants) {
        const { error: variantError } = await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', product.id);
        if (variantError) {
          console.error('Error deleting variants:', variantError);
          // We continue anyway, as the main product deletion might still succeed or fail based on FK constraints
        }
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);
      
      if (error) throw error;
      
      alert('Product deleted successfully!');
      fetchInitialData();
    } catch (error) {
      if (error.code === '42501') {
        alert('Database Security Error: You do not have permission to delete products.');
      } else {
        alert(`Error deleting product: ${error.message}`);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedProductIds.length} products? This action cannot be undone.`)) return;

    setIsBulkDeleting(true);
    try {
      // 1. Delete variants for all selected products
      const { error: variantError } = await supabase
        .from('product_variants')
        .delete()
        .in('product_id', selectedProductIds);
      
      if (variantError) console.error('Error deleting variants in bulk:', variantError);

      // 2. Delete products
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProductIds);

      if (error) throw error;

      alert(`${selectedProductIds.length} products deleted successfully!`);
      setSelectedProductIds([]);
      fetchInitialData();
    } catch (error) {
      if (error.code === '42501') {
        alert('Database Security Error: You do not have permission to delete products.');
      } else {
        alert(`Error deleting products: ${error.message}`);
      }
    } finally {
      setIsBulkDeleting(false);
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
           <div className="flex items-center gap-4">
             {selectedProductIds.length > 0 && (
               <button 
                 onClick={handleBulkDelete}
                 disabled={isBulkDeleting}
                 className="bg-red-500 text-white px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-red-600 transition-all shadow-xl disabled:opacity-50"
               >
                 {isBulkDeleting ? (
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 ) : (
                   <Trash2 size={18} />
                 )}
                 Delete Selected ({selectedProductIds.length})
               </button>
             )}
             <button 
               onClick={handleAddNew}
               className="bg-black text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
             >
               <Plus size={18} className="text-accent" /> Add New Product
             </button>
           </div>
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
                  <th className="px-8 py-6 w-10">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProductIds(filteredProducts.map(p => p.id));
                        } else {
                          setSelectedProductIds([]);
                        }
                      }}
                      checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                      className="rounded border-gray-300 text-accent focus:ring-accent cursor-pointer"
                    />
                  </th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Info</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price (INR)</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selectedProductIds.includes(p.id) ? 'bg-gray-50' : ''}`}>
                    <td className="px-8 py-6 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedProductIds.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds([...selectedProductIds, p.id]);
                          } else {
                            setSelectedProductIds(selectedProductIds.filter(id => id !== p.id));
                          }
                        }}
                        className="rounded border-gray-300 text-accent focus:ring-accent cursor-pointer"
                      />
                    </td>
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
                        <button 
                          onClick={() => handleDeleteProduct(p)}
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

                  {/* VARIANT TOGGLE - PLACED PROMINENTLY */}
                  <div className="col-span-2 bg-pink-50/30 p-6 rounded-[2rem] border-2 border-dashed border-pink-200 my-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <Tag size={16} className="text-pink-500" />
                          Enable Product Variants
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Add Shades, Sizes, or Volume options</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setProductForm({...productForm, has_variants: !productForm.has_variants})}
                        className={`w-14 h-8 rounded-full transition-all relative ${productForm.has_variants ? 'bg-black' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${productForm.has_variants ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
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
                  <div className="col-span-2 md:col-span-1">
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
                        <div className="relative w-16 h-16 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50 group">
                          <img src={productForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              let newImageUrl = '';
                              let newGallery = [...(productForm.gallery_images || [])];
                              
                              if (newGallery.length > 0) {
                                newImageUrl = newGallery[0];
                                newGallery.splice(0, 1);
                              } else if (editingProduct) {
                                const autoCandidates = getProductImageCandidates(editingProduct).filter(img => 
                                  img !== productForm.image_url && 
                                  img !== '/favicon.jpeg' &&
                                  !(productForm.gallery_images || []).includes(img)
                                );
                                if (autoCandidates.length > 0) {
                                  newImageUrl = autoCandidates[0];
                                }
                              }

                              setProductForm({ 
                                ...productForm, 
                                image_url: newImageUrl,
                                gallery_images: newGallery
                              });
                            }}
                            className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          >
                            <X size={12} />
                          </button>
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

                  {/* Gallery Images */}
                  <div className="col-span-2 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-4">Gallery Images (Optional)</label>
                    
                    {productForm.gallery_images && productForm.gallery_images.length > 0 && (
                      <div className="flex flex-wrap gap-4 mb-4">
                        {productForm.gallery_images.map((url, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm group">
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const newGallery = [...productForm.gallery_images];
                                newGallery.splice(idx, 1);
                                setProductForm({ ...productForm, gallery_images: newGallery });
                              }}
                              className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                      <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input 
                          type="file" 
                          multiple
                          accept="image/*"
                          onChange={handleGalleryImageUpload}
                          disabled={isUploading}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:border file:border-gray-200 file:text-gray-700 hover:file:bg-gray-50 transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auto-resolved Images (Read-only) */}
                  {editingProduct && (() => {
                    const autoCandidates = getProductImageCandidates(editingProduct).filter(img => 
                      img !== editingProduct.image_url && 
                      img !== '/favicon.jpeg' &&
                      !(editingProduct.gallery_images || []).includes(img)
                    );
                    
                    if (autoCandidates.length === 0) return null;
                    
                    return (
                      <div className="col-span-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-widest mb-1">Folder Images (Auto-Resolved)</label>
                        <p className="text-[10px] text-blue-600 mb-4">These images are automatically loaded from your public folders (e.g. public/mars/) and cannot be deleted here.</p>
                        
                        <div className="flex flex-wrap gap-4">
                          {autoCandidates.map((url, idx) => (
                            <div key={`auto-${idx}`} className="relative w-20 h-20 rounded-xl border border-blue-200 overflow-hidden bg-white shadow-sm group">
                              <img 
                                src={url} 
                                alt={`Auto ${idx}`} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!window.confirm('Are you sure you want to permanently delete this file from your computer?')) return;
                                  try {
                                    const res = await fetch(`/api/delete-image?path=${encodeURIComponent(url)}`, { method: 'DELETE' });
                                    if (res.ok) {
                                      // Force a re-render by triggering a fake update
                                      setProductForm({ ...productForm });
                                      alert('File deleted successfully!');
                                    } else {
                                      alert('Could not delete file. Make sure you are running the local Vite server.');
                                    }
                                  } catch (err) {
                                    alert('Error deleting file: ' + err.message);
                                  }
                                }}
                                className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                title="Delete file permanently"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Description</label>
                    <textarea 
                      value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 min-h-[100px] resize-none"
                    />
                  </div>

                  {/* Variant Builder UI */}
                  {productForm.has_variants && (
                    <div className="col-span-2 space-y-6">
                      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Variant Builder</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          {/* ONLY FOR OFFERS: Combo Item Name */}
                          {(productForm.brand_name === 'Offer' || productForm.is_offer) && (
                            <div className="col-span-1 md:col-span-3">
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Combo Product Name (e.g. Liquid Foundation)</label>
                              <input 
                                type="text"
                                placeholder="Enter the product name this shade belongs to..."
                                value={newVariant.sub_product_name || ''}
                                onChange={(e) => setNewVariant({...newVariant, sub_product_name: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent/50"
                              />
                            </div>
                          )}
                          <div className="col-span-1">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Variant Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. L3 Gobi"
                              value={newVariant.name}
                              onChange={(e) => setNewVariant({...newVariant, name: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent/50"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Type</label>
                            <select 
                              value={newVariant.type}
                              onChange={(e) => setNewVariant({...newVariant, type: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent/50"
                            >
                              <option value="shade">Shade</option>
                              <option value="size">Size</option>
                              <option value="volume">Volume</option>
                            </select>
                          </div>

                          {newVariant.type === 'shade' && (
                            <div className="col-span-1">
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Color Code (Hex)</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text"
                                  placeholder="#F5CBA7"
                                  value={newVariant.color_code}
                                  onChange={(e) => setNewVariant({...newVariant, color_code: e.target.value})}
                                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent/50"
                                />
                                <input 
                                  type="color"
                                  value={newVariant.color_code || '#ffffff'}
                                  onChange={(e) => setNewVariant({...newVariant, color_code: e.target.value})}
                                  className="w-10 h-10 rounded-lg overflow-hidden border-none cursor-pointer"
                                />
                              </div>
                            </div>
                          )}
                          <div className="col-span-1">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Price Override (Optional)</label>
                            <input 
                              type="number"
                              placeholder="Leave blank to use base price"
                              value={newVariant.price}
                              onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-accent/50"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Variant Image (Optional)</label>
                            <div className="flex items-center gap-2">
                              {newVariant.image_url && (
                                <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50">
                                  <img src={newVariant.image_url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleVariantImageUpload}
                                disabled={isUploadingVariantImage}
                                className="flex-1 text-[10px] text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-50 file:text-gray-700 cursor-pointer"
                              />
                            </div>
                            {isUploadingVariantImage && <p className="text-[8px] text-accent font-bold mt-1 animate-pulse">Uploading...</p>}
                            {!isUploadingVariantImage && newVariant.image_url && <p className="text-[8px] text-green-500 font-bold mt-1 flex items-center gap-1"><CheckCircle2 size={10} /> Image Uploaded!</p>}
                          </div>
                          <div className="col-span-1 flex items-end">
                            <button 
                              type="button"
                              onClick={() => {
                                if (!newVariant.name) return alert('Variant name is required');
                                setProductVariants([...productVariants, { ...newVariant }]);
                                setNewVariant({ name: '', type: 'shade', color_code: '', image_url: '', price: '', sub_product_name: '' });
                              }}
                              className="w-full bg-black text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all"
                            >
                              Add Variant
                            </button>
                          </div>
                        </div>

                        {/* Variants List */}
                        {productVariants.length > 0 && (
                          <div className="space-y-3 mt-8 pt-8 border-t border-gray-50">
                            <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Current Variants</h5>
                            {productVariants.map((v, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                  <div className="flex items-center gap-3">
                                  {v.image_url ? (
                                    <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden">
                                      <img src={v.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  ) : v.color_code && (
                                    <div className="w-10 h-10 rounded-full border border-gray-200" style={{ backgroundColor: v.color_code }} />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-900">{v.name}</span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                      {v.type} {v.price ? `• ₹${v.price}` : ''} {v.sub_product_name ? `• ${v.sub_product_name}` : ''}
                                    </span>
                                  </div>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => setProductVariants(productVariants.filter((_, i) => i !== idx))}
                                  className="px-3 py-2 flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest"
                                  title="Delete Variant"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
