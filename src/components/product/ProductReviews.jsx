import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode } from 'swiper/modules';
import { getProductReviews, submitReview } from '../../services/reviewService';
import { supabase } from '../../lib/supabase';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchReviews();
    checkUser();
  }, [productId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    const data = await getProductReviews(productId);
    setReviews(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment || !userName) return;

    setSubmitting(true);
    const { error } = await submitReview({
      product_id: productId,
      user_id: user?.id,
      user_name: userName,
      rating,
      comment,
      is_verified: !!user
    });

    if (!error) {
      setComment('');
      setShowForm(false);
      fetchReviews();
    }
    setSubmitting(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <span className="text-green-700 font-bold">{averageRating}</span>
                <Star className="w-4 h-4 fill-green-700 text-green-700" />
              </div>
              <span className="text-gray-400 text-sm font-medium">{reviews.length} total reviews</span>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-black text-white text-sm font-bold rounded-2xl hover:bg-black/90 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {showForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-black mb-6">Your Experience</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Sarah J."
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-8 h-8 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Review Details
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or disliked..."
                    required
                    rows={4}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 text-sm focus:border-black outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-10 py-4 bg-black text-white text-sm font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-black/90 transition-all"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 w-full md:w-[calc(33.33%-16px)] animate-pulse flex flex-col gap-3">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-40 w-full bg-gray-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="relative group">
            <Swiper
              modules={[Pagination, FreeMode]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              freeMode={true}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                }
              }}
              className="pb-12"
            >
              {reviews.map((rev) => (
                <SwiperSlide key={rev.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">{rev.user_name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{new Date(rev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-100'}`} />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed italic mb-4 line-clamp-4">"{rev.comment}"</p>

                    {rev.is_verified && (
                      <div className="flex items-center gap-1.5 pt-4 border-t border-gray-50 mt-auto">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Verified Buyer</span>
                      </div>
                    )}
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
