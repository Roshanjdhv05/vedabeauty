import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const RETURN_REASONS = [
  "Product received in damaged condition.",
  "Product received with expired or near-expiry date.",
  "Product received is different from the item ordered."
];

const ReturnOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason || !description.trim() || !imageFile) {
      setError("Please select a reason, provide a description, and upload an image.");
      return;
    }

    if (!user) {
      setError("You must be logged in to submit a return.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `returns/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

      // 3. Save return request into existing contact_messages table
      const { error: dbError } = await supabase.from('contact_messages').insert([{
        name: `RETURN_REQUEST|${id}`,
        email: selectedReason,
        phone: publicUrl,
        message: description
      }]);

      if (dbError) throw new Error(`Failed to submit request: ${dbError.message}`);

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAFAFA]">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Return Request Submitted</h2>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
          We have received your return request for Order #{id.slice(0, 8).toUpperCase()}. Our team will inspect the details and get back to you within 48 hours.
        </p>
        <button 
          onClick={() => navigate('/orders')} 
          className="px-10 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="bg-white px-4 py-6 border-b border-gray-100 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-xl transition-all">
          <ArrowLeft size={20} className="text-[#DB2777]" />
        </button>
        <h1 className="text-xl font-bold text-[#DB2777] uppercase tracking-wider">Return / Replace</h1>
      </div>

      <div className="px-4 mt-6 max-w-xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
           <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Select Reason</h3>
           <div className="space-y-3">
              {RETURN_REASONS.map((reason, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedReason === reason 
                    ? 'border-[#DB2777] bg-pink-50/30' 
                    : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="returnReason" 
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1 w-4 h-4 text-[#DB2777] border-gray-300 focus:ring-[#DB2777]"
                  />
                  <span className="text-xs font-semibold text-gray-800 leading-relaxed">{reason}</span>
                </label>
              ))}
           </div>
        </div>

        {selectedReason && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Explain the Issue</h3>
               <textarea
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="Please provide details about the problem with the product..."
                 rows={4}
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#DB2777] transition-colors resize-none"
               />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-widest">Upload Image</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Please upload a clear picture of the product</p>
               
               <input 
                 type="file" 
                 accept="image/*"
                 capture="environment"
                 ref={fileInputRef}
                 onChange={handleFileChange}
                 className="hidden"
               />

               {!imagePreview ? (
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#DB2777] transition-all"
                 >
                   <Camera size={32} className="text-gray-400 mb-2" />
                   <span className="text-xs font-bold text-gray-500">Tap to Take Photo or Upload</span>
                 </div>
               ) : (
                 <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-gray-50" />
                    <button 
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 bg-white text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                    >
                      Remove
                    </button>
                 </div>
               )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
                 <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                 <p className="text-xs font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason || !description.trim() || !imageFile}
              className="w-full py-5 bg-[#DB2777] text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReturnOrderPage;
