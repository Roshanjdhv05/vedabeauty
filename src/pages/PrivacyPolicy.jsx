import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Shield className="w-10 h-10 text-black" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">Privacy Policy</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Last Updated: June 2026</p>
      </div>

      <div className="prose prose-sm md:prose-base max-w-none text-gray-600 space-y-12">
        
        <section>
          <p className="text-lg leading-relaxed mb-8">
            Welcome to <strong className="text-black">Veda Beauty</strong>. Your privacy and trust are important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit or shop on our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">01</span> Information We Collect
          </h2>
          <p className="mb-4">When you place an order or contact us, we may collect:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-gray-300">
            <li>Full Name</li>
            <li>Mobile Number</li>
            <li>Email Address</li>
            <li>Shipping and Billing Address</li>
            <li>Payment Information (processed securely through payment providers)</li>
            <li>Order History</li>
            <li>Device and Browser Information for website performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">02</span> How We Use Your Information
          </h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-gray-300 mb-6">
            <li>Process and deliver your orders</li>
            <li>Provide customer support</li>
            <li>Send order updates and shipping notifications</li>
            <li>Improve our products and services</li>
            <li>Prevent fraud and unauthorized activities</li>
          </ul>
          <p className="font-medium text-black">We do not sell or rent your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">03</span> Data Security
          </h2>
          <p>
            We implement reasonable security measures to protect your personal information. However, no method of online transmission or storage is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">04</span> Cookies
          </h2>
          <p className="mb-4">
            Our website may use cookies to improve your browsing experience, remember preferences, and enhance website performance.
          </p>
          <p>You can disable cookies through your browser settings if you prefer.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">05</span> Third-Party Services
          </h2>
          <p className="mb-4">We may use trusted third-party services for:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-gray-300 mb-6">
            <li>Payment processing</li>
            <li>Shipping and logistics</li>
            <li>Website analytics</li>
            <li>Customer support</li>
          </ul>
          <p>These providers have their own privacy policies governing the use of your information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">06</span> Return & Replacement Policy
          </h2>
          <p className="mb-6">Customer satisfaction is important to us. Returns or replacements are accepted only under the following conditions:</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <h3 className="text-sm font-bold text-green-800 uppercase tracking-widest mb-4">Eligible Return Cases</h3>
              <ul className="space-y-3">
                <li className="flex gap-2 items-start"><span className="text-green-500">✅</span> <span>Product received in damaged condition.</span></li>
                <li className="flex gap-2 items-start"><span className="text-green-500">✅</span> <span>Product received with expired or near-expiry date.</span></li>
                <li className="flex gap-2 items-start"><span className="text-green-500">✅</span> <span>Product received is different from the item ordered.</span></li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h3 className="text-sm font-bold text-red-800 uppercase tracking-widest mb-4">Non-Eligible Return Cases</h3>
              <ul className="space-y-3">
                <li className="flex gap-2 items-start"><span className="text-red-500">❌</span> <span>Change of mind.</span></li>
                <li className="flex gap-2 items-start"><span className="text-red-500">❌</span> <span>Incorrect product selection by the customer.</span></li>
                <li className="flex gap-2 items-start"><span className="text-red-500">❌</span> <span>Opened, used, or damaged products after delivery.</span></li>
                <li className="flex gap-2 items-start"><span className="text-red-500">❌</span> <span>Products without proper proof of purchase.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">07</span> Return Inspection & Refund
          </h2>
          <ul className="list-disc pl-6 space-y-3 marker:text-gray-300">
            <li>All return requests are subject to inspection and verification.</li>
            <li>Once the returned product is received and approved, the refund will be processed.</li>
            <li>The return payment/refund will be completed within <strong className="text-black">4-5 business days after successful inspection</strong>.</li>
            <li>Refunds will be credited to the original payment method whenever possible.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">08</span> Shipping Policy
          </h2>
          <p>
            Delivery timelines may vary depending on the location and courier availability. Veda Beauty is not responsible for delays caused by logistics partners or unforeseen circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">09</span> Changes to This Policy
          </h2>
          <p>
            We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page.
          </p>
        </section>

        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 flex items-center gap-4">
            <span className="text-accent text-sm font-bold">10</span> Contact Us
          </h2>
          <p className="mb-6">If you have any questions regarding this Privacy Policy or your order, please contact us.</p>
          
          <div className="space-y-4 text-black">
            <p><strong className="font-bold text-lg tracking-tight">Veda Beauty</strong></p>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Address</p>
              <p>B,3 Jasmine Plaza, Opp. Radha Krishna,<br/>Jambhali Naka, Station Road,<br/>Thane (W), Maharashtra - 400601</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Phone</p>
              <p>+91 8169292310</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Email</p>
              <p><a href="mailto:vedabeautyofficial@gmail.com" className="text-blue-600 hover:underline">vedabeautyofficial@gmail.com</a></p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Website</p>
              <p>vedabeauty.in</p>
            </div>
          </div>
        </section>
        
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-xl font-bold text-black tracking-tight">Thank you for shopping with Veda Beauty.</p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
