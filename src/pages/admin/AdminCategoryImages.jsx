import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Upload, 
  Save, 
  RefreshCcw, 
  Plus, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronDown,
  Globe,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import OptimizedImage from '../../components/ui/OptimizedImage';
import { getBrands } from '../../services/productService';
import { useState, useEffect } from 'react';

const AdminCategoryImages = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState('global');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [selectedBrandId]);

  const fetchInitialData = async () => {
    setLoading(true);
    const brandsData = await getBrands();
    setBrands(brandsData);
    await fetchCategories();
    setLoading(false);
  };

  const fetchCategories = async () => {
    const query = supabase
      .from('category_settings')
      .select('*')
      .order('display_order', { ascending: true });

    if (selectedBrandId === 'global') {
      query.is('brand_id', null);
    } else {
      query.eq('brand_id', selectedBrandId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      setMessage({ type: 'error', text: 'Failed to load categories.' });
    } else {
      setCategories(data || []);
    }
  };

  const handleImageUpload = async (categoryId, file) => {
    if (!file) return;

    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `category_${categoryId}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // 3. Update Table
      const { error: updateError } = await supabase
        .from('category_settings')
        .update({ image_url: publicUrl, updated_at: new Date() })
        .eq('id', categoryId);

      if (updateError) throw updateError;

      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      fetchCategories();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: error.message || 'Upload failed.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const updateCategoryName = async (id, newName) => {
    const { error } = await supabase
      .from('category_settings')
      .update({ name: newName, updated_at: new Date() })
      .eq('id', id);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update name.' });
    } else {
      setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', imageFile: null, brandId: 'global' });

  const handleAddCategory = () => {
    // Capture the brand ID at the exact moment the button is clicked
    setNewCategoryData({ name: '', imageFile: null, brandId: selectedBrandId });
    setIsModalOpen(true);
  };

  const submitNewCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryData.name) {
      setMessage({ type: 'error', text: 'Category name is required.' });
      return;
    }

    try {
      setSaving(true);
      let imageUrl = 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400';

      // 1. If image file exists, upload it first
      if (newCategoryData.imageFile) {
        const file = newCategoryData.imageFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `category_new_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `categories/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // 2. Insert into table — use the brandId captured when modal was opened
      const finalBrandId = newCategoryData.brandId === 'global' ? null : newCategoryData.brandId;
      
      console.log('Registering category for brand:', finalBrandId);

      const newCat = {
        name: newCategoryData.name,
        image_url: imageUrl,
        display_order: categories.length + 1,
        brand_id: finalBrandId,
        is_active: true
      };

      const { error } = await supabase
        .from('category_settings')
        .insert([newCat]);

      if (error) throw error;

      setMessage({ type: 'success', text: `Registered under ${selectedBrandId === 'global' ? 'Global' : 'Brand'} successfully!` });
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Add error details:', error);
      setMessage({ 
        type: 'error', 
        text: `Registration failed: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category banner?')) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('category_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Category deleted!' });
      fetchCategories();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete category.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('category_settings')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setCategories(categories.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const initializeBrandCategories = async () => {
    if (selectedBrandId === 'global') return;
    
    try {
      setSaving(true);
      const { data: globals } = await supabase
        .from('category_settings')
        .select('*')
        .is('brand_id', null);

      if (!globals || globals.length === 0) {
        setMessage({ type: 'error', text: 'No global categories found to copy from.' });
        return;
      }

      const newCategories = globals.map(g => ({
        name: g.name,
        image_url: g.image_url,
        display_order: g.display_order,
        brand_id: selectedBrandId
      }));

      const { error } = await supabase
        .from('category_settings')
        .insert(newCategories);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Brand categories initialized!' });
      fetchCategories();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initialize categories.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <RefreshCcw className="w-8 h-8 animate-spin mb-4 text-accent" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Synchronizing Visual Assets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Brand Selection Header */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-accent shadow-lg">
              {selectedBrandId === 'global' ? <Globe size={24} /> : <ImageIcon size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-gray-900">Categories Banner</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                {selectedBrandId === 'global' ? 'Managing Global Homepage Categories' : `Managing Categories for Brand: ${brands.find(b => b.id === selectedBrandId)?.name}`}
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select 
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full pl-6 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest appearance-none focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
            >
              <option value="global">🌍 Global (Homepage)</option>
              <optgroup label="Specific Brands">
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 px-6 py-3 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest ${
              message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </motion.div>
        )}
      </div>

      {/* Empty State for Brand */}
      {!loading && categories.length === 0 && selectedBrandId !== 'global' && (
        <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
            <ImageIcon size={40} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-900">No Custom Banner Set</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-4 mb-8">
            This brand is currently using the default global category images. Would you like to create a custom visual set for this brand page?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={initializeBrandCategories}
              disabled={saving}
              className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent hover:text-black transition-all disabled:opacity-50"
            >
              Initialize from Global
            </button>
            <button 
              onClick={handleAddCategory}
              disabled={saving}
              className="px-10 py-4 bg-white text-black border border-gray-200 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Start from Scratch
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <motion.div 
            key={cat.id}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group/card"
          >
            {/* Image Preview */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-gray-50 border border-gray-100">
              <OptimizedImage 
                src={cat.image_url} 
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <label className="cursor-pointer p-3 bg-white text-black rounded-full shadow-xl hover:scale-110 transition-transform">
                  <Upload size={20} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(cat.id, e.target.files[0])}
                    disabled={saving}
                  />
                </label>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-3 bg-red-500 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Category Label</label>
                <input 
                  type="text" 
                  value={cat.name}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={() => toggleActive(cat.id, cat.is_active)}
                  className={`text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all ${
                    cat.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {cat.is_active ? 'Active' : 'Hidden'}
                </button>
                <p className="text-[8px] text-gray-300 font-mono">ID: {cat.id.substring(0, 8)}...</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Category Button */}
        {(categories.length > 0 || selectedBrandId === 'global') && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddCategory}
            disabled={saving}
            className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-accent transition-colors h-full min-h-[300px]"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-accent group-hover:shadow-lg transition-all mb-4">
              <Plus size={32} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Register New Category</p>
            <p className="text-[9px] text-gray-300 mt-2">Add a new section for this {selectedBrandId === 'global' ? 'Homepage' : 'Brand'}</p>
          </motion.button>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
         <div className="flex gap-4 items-start">
            <AlertCircle className="text-accent flex-shrink-0" size={20} />
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              <span className="text-black font-bold">Pro Tip:</span> If you select a brand and initialize categories, the brand page will stop using the global images and start using its own unique set. This allows you to have different "Lips" or "Face" banners for MARS vs. other brands.
            </p>
         </div>
      </div>
      
      {/* ADD CATEGORY MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                      <Plus size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-black">New Category</h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Adding to: {selectedBrandId === 'global' ? 'Global Homepage' : brands.find(b => b.id === selectedBrandId)?.name}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={submitNewCategory} className="space-y-6">
                  {/* Category Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category Label</label>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="e.g. Lips, Eyes, Face..."
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      value={newCategoryData.name}
                      onChange={(e) => setNewCategoryData({...newCategoryData, name: e.target.value})}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Cover Image</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        id="new-cat-image"
                        onChange={(e) => setNewCategoryData({...newCategoryData, imageFile: e.target.files[0]})}
                      />
                      <label 
                        htmlFor="new-cat-image"
                        className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer group-hover:border-accent transition-all overflow-hidden"
                      >
                        {newCategoryData.imageFile ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={URL.createObjectURL(newCategoryData.imageFile)} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              Change Image
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:text-accent group-hover:shadow-lg transition-all mb-3">
                              <Upload size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Image</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-8 py-4 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={saving || !newCategoryData.name}
                      className="flex-1 px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-accent hover:text-black transition-all disabled:opacity-50 shadow-xl"
                    >
                      {saving ? 'Creating...' : 'Register Category'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategoryImages;
