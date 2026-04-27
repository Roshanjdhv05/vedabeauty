import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Printer, ChevronLeft, AlertCircle } from 'lucide-react';

const InvoicePage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Order not found');

      setOrder(data);
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading Invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || "The requested order invoice could not be loaded."}</p>
        <button 
          onClick={() => navigate('/orders')}
          className="px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  // Fallbacks for older orders that might not have the new IDs
  const displayOrderId = order?.order_id || `VB-${new Date(order?.created_at).getFullYear()}-XXXX`;
  const displayPO = order?.purchase_order_id || `PO-XXXXXX`;
  const displayInvoice = order?.invoice_id || `INV-${new Date(order?.created_at).getFullYear()}-XXXX`;
  
  const orderDate = order?.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : 'N/A';

  const items = Array.isArray(order?.items) ? order.items : [];
  const totalAmount = parseFloat(order?.total_amount || 0);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white pb-10 print:pb-0 font-sans">
      
      {/* ACTION BAR (Hidden on Print) */}
      <div className="max-w-[800px] mx-auto px-4 py-4 print:hidden flex items-center justify-between gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg"
        >
          <Printer size={16} /> Print / Download
        </button>
      </div>

      {/* INVOICE CONTENT */}
      <div className="max-w-[800px] mx-auto bg-white print:w-full print:m-0 print:shadow-none shadow-xl border border-black overflow-hidden print:border-black mb-10">
        
        {/* 1. SHIPPING LABEL SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black">
          {/* Left: Customer & Return Addresses */}
          <div className="border-b sm:border-b-0 sm:border-r border-black">
            <div className="p-3 border-b border-black">
              <h3 className="text-[8px] md:text-[10px] font-extrabold uppercase mb-1 text-gray-500">Customer Address</h3>
              <p className="text-xs md:text-sm font-black uppercase">{order?.customer_name || 'N/A'}</p>
              <p className="text-[9px] md:text-[11px] leading-tight font-medium uppercase mt-1">
                {order?.address_line1}, {order?.address_line2 && order.address_line2}<br />
                {order?.landmark && `Near ${order.landmark},`}<br />
                {order?.city}, {order?.state}, {order?.pincode}
              </p>
            </div>
            <div className="p-3">
              <h3 className="text-[8px] md:text-[10px] font-extrabold uppercase mb-1 text-gray-500">If undelivered, return to:</h3>
              <p className="text-[9px] md:text-[11px] font-bold">VEDA BEAUTY</p>
              <p className="text-[8px] md:text-[10px] leading-tight font-medium mt-1 uppercase">
                B,3 Jasmine Plaza, Opp Radha Krishna<br />
                Jambhali Naka Station Road<br />
                Thane West, Maharashtra - 400601
              </p>
            </div>
          </div>

          {/* Right: COD & Shipping Info */}
          <div className="flex flex-col">
            <div className="bg-black text-white p-1.5 md:p-2 text-center">
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-tight">COD: Check the payable amount on the app</p>
            </div>
            <div className="flex-1 p-3 md:p-4 flex flex-col justify-center bg-gray-50/50">
              <h2 className="text-xl md:text-2xl font-black italic tracking-tighter mb-2 uppercase">Veda Delivery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                <div>
                  <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase">Destination Code</p>
                  <p className="text-xs md:text-sm font-black">THN-{order?.pincode || '400601'}</p>
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase">Return Code</p>
                  <p className="text-xs md:text-sm font-black">{order?.id?.slice(0, 10).toUpperCase() || 'REF-VOID'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PRODUCT DETAILS SUMMARY */}
        <div className="p-3 border-b border-black overflow-x-auto no-scrollbar">
          <h3 className="text-[8px] md:text-[10px] font-extrabold uppercase mb-2 text-gray-500">Product Details</h3>
          <div className="min-w-[400px]">
            <div className="grid grid-cols-5 text-[8px] md:text-[10px] font-bold uppercase text-gray-400 mb-1">
              <span>SKU</span>
              <span>Category</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Order No.</span>
            </div>
            {items.slice(0, 1).map((item, i) => {
              const itemPrice = parseFloat(item.price || item.variant?.price || 0);
              return (
                <div key={i} className="grid grid-cols-5 text-[10px] md:text-xs font-black uppercase">
                  <span className="truncate pr-2">{item.name?.slice(0, 15) || 'PRODUCT'}</span>
                  <span>{item.category || 'Beauty'}</span>
                  <span>{item.quantity}</span>
                  <span>₹{itemPrice.toFixed(2)}</span>
                  <span className="truncate">{displayOrderId}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOLD LINE */}
        <div className="relative h-6 flex items-center justify-center border-b border-black border-dashed bg-gray-50 print:bg-white">
          <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest px-4 bg-gray-50 print:bg-white z-10">Fold Here</span>
          <div className="absolute w-full h-[1px] border-t border-black border-dashed top-1/2 -translate-y-1/2"></div>
        </div>

        {/* 3. TAX INVOICE SECTION */}
        <div className="p-1.5 bg-black text-white flex justify-between px-4 items-center">
          <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest">TAX INVOICE</h2>
          <span className="text-[8px] md:text-[9px] font-bold uppercase">Original For Recipient</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-black text-[9px] md:text-[10px]">
          <div className="p-3 border-b sm:border-b-0 sm:border-r border-black">
            <h4 className="font-black mb-1 underline uppercase">BILL TO</h4>
            <p className="font-bold uppercase">{order?.customer_name}</p>
            <p className="font-medium text-gray-600 mt-0.5 leading-tight uppercase">
              {order?.city}, {order?.state}, {order?.pincode}<br />
              Place of Supply: {order?.state || 'Maharashtra'}
            </p>
          </div>
          <div className="p-3 border-b sm:border-b-0 sm:border-r border-black">
            <h4 className="font-black mb-1 underline uppercase">SHIP TO</h4>
            <p className="font-bold uppercase">{order?.customer_name}</p>
            <p className="font-medium text-gray-600 mt-0.5 leading-tight uppercase">
              {order?.address_line1}, {order?.city},<br />
              {order?.state}, {order?.pincode}
            </p>
          </div>
          <div className="p-3 leading-tight uppercase bg-gray-50/30">
            <p><span className="font-bold">Sold by:</span> VEDA BEAUTY, Thane, 400601</p>
            <p><span className="font-bold">GSTIN:</span> 27ALAPC0109R1Z9</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <p className="font-bold text-[8px] text-gray-400">PO No</p>
                <p className="font-black truncate">{displayPO}</p>
              </div>
              <div>
                <p className="font-bold text-[8px] text-gray-400">Invoice No</p>
                <p className="font-black truncate">{displayInvoice}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-2 gap-2">
              <div><p className="font-bold text-[8px] text-gray-400">Order Date</p><p className="font-black">{orderDate}</p></div>
              <div><p className="font-bold text-[8px] text-gray-400">Inv Date</p><p className="font-black">{new Date().toLocaleDateString()}</p></div>
            </div>
          </div>
        </div>

        {/* INVOICE TABLE */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-[8px] md:text-[9px] border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 border-b border-black">
                <th className="p-2 border-r border-black font-black uppercase">Description</th>
                <th className="p-2 border-r border-black font-black uppercase w-8 text-center">Qty</th>
                <th className="p-2 border-r border-black font-black uppercase w-16 text-right">Gross</th>
                <th className="p-2 border-r border-black font-black uppercase w-16 text-right">Disc.</th>
                <th className="p-2 border-r border-black font-black uppercase w-16 text-right">Taxable</th>
                <th className="p-2 border-r border-black font-black uppercase w-20 text-right">Taxes</th>
                <th className="p-2 font-black uppercase w-20 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const itemPrice = parseFloat(item.price || item.variant?.price || 0);
                const taxable = itemPrice / 1.18;
                const tax = itemPrice - taxable;
                return (
                  <tr key={i} className="border-b border-black border-opacity-10">
                    <td className="p-2 border-r border-black font-bold truncate max-w-[150px] uppercase">
                      {item.product_name || item.name}
                    </td>
                    <td className="p-2 border-r border-black text-center">{item.quantity}</td>
                    <td className="p-2 border-r border-black text-right">₹{itemPrice.toFixed(2)}</td>
                    <td className="p-2 border-r border-black text-right">₹0.00</td>
                    <td className="p-2 border-r border-black text-right">₹{taxable.toFixed(2)}</td>
                    <td className="p-2 border-r border-black text-right uppercase">GST@18%<br/>₹{tax.toFixed(2)}</td>
                    <td className="p-2 font-bold text-right">₹{(itemPrice * item.quantity).toFixed(2)}</td>
                  </tr>
                );
              })}
              {/* Total Row */}
              <tr className="bg-gray-100 font-black border-t border-black">
                <td colSpan={5} className="p-2 border-r border-black text-right uppercase">Shipping / Delivery Charge</td>
                <td className="p-2 border-r border-black text-right">-</td>
                <td className="p-2 text-right">₹{parseFloat(order?.shipping_fee || 0).toFixed(2)}</td>
              </tr>
              <tr className="bg-black text-white font-black border-t border-black">
                <td colSpan={5} className="p-2 border-r border-white text-right uppercase">Grand Total</td>
                <td className="p-2 border-r border-white text-right">₹{(totalAmount - (totalAmount / 1.18)).toFixed(2)}</td>
                <td className="p-2 text-right">₹{totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DISCLAIMER */}
        <div className="p-3 bg-gray-50 print:bg-white text-[7px] md:text-[8px] leading-tight font-medium border-t border-black uppercase">
          <p>
            Tax is not payable on reverse charge basis. This is a computer generated invoice and does not require signature. 
            Other charges are charges that are applicable to your order and include charges for logistics fee (where applicable). 
            Includes discounts for your city and/or for online payments (as applicable).
          </p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .max-w-\[800px\] { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
          button { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default InvoicePage;
