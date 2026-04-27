import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/* ─────────────────────────────────────────────
   SEO Meta (injected via document.title)
───────────────────────────────────────────── */
const PAGE_TITLE    = 'Contact Veda Beauty';
const PAGE_DESC     = 'Get in touch with Veda Beauty. We are located at Jasmine Plaza, Thane West. Call us or drop a message and we will respond within 24 hours.';

/* ─────────────────────────────────────────────
   CONTACT DETAILS
───────────────────────────────────────────── */
const CONTACT_CARDS = [
  {
    icon: MapPin,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    label: 'Our Address',
    lines: [
      'B,3 Jasmine Plaza',
      'Opp Radha Krishna',
      'Jambhali Naka Station Road',
      'Thane West – 400601',
    ],
    href: null,
  },
  {
    icon: Phone,
    color: 'text-[#D4AF37]',
    bg: 'bg-yellow-50',
    label: 'Call Us',
    lines: ['8169292310'],
    href: 'tel:8169292310',
    note: 'Mon–Sat, 10am – 7pm',
  },
];

/* ─────────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────────── */
const ContactPage = () => {
  const navigate = useNavigate();

  // Update page title
  React.useEffect(() => {
    document.title = PAGE_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', PAGE_DESC);
  }, []);

  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus]   = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errors, setErrors]   = useState({});

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');

    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name:    form.name.trim(),
        email:   form.email.trim(),
        phone:   form.phone.trim() || null,
        message: form.message.trim(),
      }]);
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    if (status !== 'idle') setStatus('idle');
  };

  /* ── Reusable input classes ── */
  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white
     placeholder:text-gray-400 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC]
     ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── HERO ── */}
      <section
        className="relative w-full py-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F8C8DC 0%, #fde9f3 60%, #fff0f7 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-[#D4AF37]/10 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-black/70" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg mx-auto"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/40 mb-3">
            Veda Beauty
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black tracking-tight mb-3">
            Contact Us
          </h1>
          <p className="text-sm md:text-base text-black/60 font-medium">
            We'd love to hear from you 💬
          </p>
          <p className="text-xs text-black/40 mt-2">
            We usually respond within 24 hours
          </p>
        </motion.div>
      </section>

      <div className="max-w-xl mx-auto px-4 space-y-5 mt-6">

        {/* ── CONTACT DETAIL CARDS ── */}
        <div className="space-y-3">
          {CONTACT_CARDS.map((card, i) => {
            const Icon = card.icon;
            const content = (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-start gap-4 border border-gray-100"
              >
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{card.label}</p>
                  {card.lines.map((line, j) => (
                    <p key={j} className="text-sm font-semibold text-black leading-snug">{line}</p>
                  ))}
                  {card.note && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {card.note}
                    </p>
                  )}
                </div>
              </motion.div>
            );

            return card.href
              ? <a key={i} href={card.href} className="block hover:opacity-90 transition-opacity">{content}</a>
              : <div key={i}>{content}</div>;
          })}
        </div>

        {/* ── GOOGLE MAP ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100"
        >
          <iframe
            title="Veda Beauty Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.3!2d72.9614!3d19.1905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8e0b59e1a9f%3A0x5a15c87e3b5f5c6b!2sJasmine%20Plaza%2C%20Thane%20West%2C%20Maharashtra%20400601!5e0!3m2!1sen!2sin!4v1714220000000!5m2!1sen!2sin"
            width="100%"
            height="240"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* ── CONTACT FORM ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <h2 className="text-lg font-bold text-black mb-1">Send Us a Message</h2>
          <p className="text-xs text-gray-400 mb-5">Fill in the form and we'll get back to you</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Name <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputCls('name')}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Email <span className="text-pink-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputCls('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Phone <span className="text-gray-300 font-normal normal-case">(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className={inputCls('phone')}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Message <span className="text-pink-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                rows={4}
                className={`${inputCls('message')} resize-none`}
              />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>

            {/* Success / Error banners */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-green-700">Your message has been sent successfully!</p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-red-700">Something went wrong. Please try again.</p>
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white font-bold text-sm rounded-xl
                         hover:bg-[#1a1a1a] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-gray-400">
              We usually respond within <span className="font-bold text-black">24 hours</span>
            </p>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default ContactPage;
