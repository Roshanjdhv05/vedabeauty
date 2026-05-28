import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Sparkles, ShoppingBag, Zap } from 'lucide-react';

const offers = [
  {
    id: 'insight',
    brand: 'Insight Cosmetics',
    name: 'Insight Combo Offer',
    desc: 'A curated professional combo — everything you need for a flawless look, bundled together for maximum savings.',
    image: '/insight_combo_offer.png',
    mrp: 1163,
    price: 814,
    route: '/product/e1f8c14a-5f6b-4e1a-8c1d-9e2f3a4b5c6d',
    accent: '#e95578',
    accentDark: '#c2185b',
    accentLight: '#fce8ef',
    accentShadow: 'rgba(233,85,120,',
    glow: 'rgba(233,85,120,0.13)',
  },
  {
    id: 'sugarpop',
    brand: 'SugarPop',
    name: '5 Minute College Ready Kit',
    desc: 'Get that effortless, campus-ready look in just 5 minutes — your ultimate go-to combo for busy mornings.',
    image: '/sugarpop_combo_offer.png',
    mrp: 1076,
    price: 860,
    route: '/product/a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6e',
    accent: '#f97316',
    accentDark: '#c2410c',
    accentLight: '#fff4ed',
    accentShadow: 'rgba(249,115,22,',
    glow: 'rgba(249,115,22,0.12)',
  },
  {
    id: 'mars',
    brand: 'Offer',
    name: '5 Minutes Daily Makeup Kit',
    desc: 'Your everyday essential kit for a polished, put-together look — crafted for the modern woman on the move.',
    image: '/mars_combo_offer.png',
    mrp: 999,
    price: 749,
    route: '/product/b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7f',
    accent: '#8b5cf6',
    accentDark: '#6d28d9',
    accentLight: '#f5f0ff',
    accentShadow: 'rgba(139,92,246,',
    glow: 'rgba(139,92,246,0.12)',
  },
  {
    id: 'pilgrim',
    brand: 'Pilgrim',
    name: 'Morning Glow & Protect Kit',
    desc: 'Start your day with radiant, protected skin — this complete morning ritual kit has everything you need.',
    image: '/pilgrim_combo_offer.png',
    mrp: 1565,
    price: 1179,
    route: '/product/c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f',
    accent: '#0ea5e9',
    accentDark: '#0369a1',
    accentLight: '#eff8ff',
    accentShadow: 'rgba(14,165,233,',
    glow: 'rgba(14,165,233,0.12)',
  },
];

const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const discount = Math.round(((offer.mrp - offer.price) / offer.mrp) * 100);
  const save = offer.mrp - offer.price;

  return (
    <div
      className={`oc-card oc-card--${offer.id} ${hovered ? 'oc-card--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        '--accent': offer.accent,
        '--accent-dark': offer.accentDark,
        '--accent-light': offer.accentLight,
        '--accent-shadow': offer.accentShadow,
        '--accent-glow': offer.glow,
      }}
    >
      {/* Discount badge */}
      <div className="oc-badge">
        <Tag size={10} strokeWidth={2.5} />
        <span>{discount}% OFF</span>
      </div>

      {/* Image */}
      <div className="oc-image-wrap">
        <img
          src={offer.image}
          alt={offer.name}
          className="oc-image"
        />
        <div className="oc-image-overlay" />
      </div>

      {/* Content */}
      <div className="oc-body">
        <div className="oc-brand-pill">
          <Sparkles size={10} strokeWidth={2.5} />
          <span>{offer.brand}</span>
        </div>

        <h3 className="oc-name">{offer.name}</h3>
        <p className="oc-desc">{offer.desc}</p>

        <div className="oc-pricing">
          <span className="oc-price">₹{offer.price.toLocaleString('en-IN')}</span>
          <div className="oc-price-meta">
            <span className="oc-mrp">₹{offer.mrp.toLocaleString('en-IN')}</span>
            <span className="oc-save">Save ₹{save}</span>
          </div>
        </div>

        <button
          className="oc-btn"
          onClick={() => navigate(offer.route)}
          id={`${offer.id}-combo-offer-cta`}
        >
          <ShoppingBag size={14} strokeWidth={2.5} />
          <span>Shop Now</span>
        </button>
      </div>
    </div>
  );
};

const OfferSection = () => {
  return (
    <section className="os-wrapper">
      {/* Decorative blobs */}
      <div className="os-blob os-blob--1" />
      <div className="os-blob os-blob--2" />
      <div className="os-blob os-blob--3" />

      {/* Header */}
      <div className="os-header">
        <div className="os-pill">
          <Zap size={12} strokeWidth={2.5} />
          <span>Exclusive Combos</span>
        </div>
        <h2 className="os-title">🎁 Special Combo Offers</h2>
        <p className="os-sub">Handpicked brand combos at unbeatable prices — limited time only</p>
      </div>

      {/* Cards grid */}
      <div className="os-grid">
        {offers.map(offer => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      <style>{`
        /* ── Wrapper ── */
        .os-wrapper {
          width: 100%;
          padding: 64px 20px 80px;
          background: linear-gradient(155deg, #fff6f8 0%, #fce9f0 35%, #f3eeff 70%, #eef6ff 100%);
          position: relative;
          overflow: hidden;
        }

        /* ── Decorative blobs ── */
        .os-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          opacity: 0.55;
        }
        .os-blob--1 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(233,85,120,0.18) 0%, transparent 70%);
          top: -100px; right: -80px;
        }
        .os-blob--2 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%);
          bottom: -80px; left: -60px;
        }
        .os-blob--3 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }

        /* ── Header ── */
        .os-header {
          max-width: 1100px;
          margin: 0 auto 48px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .os-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #e95578, #c2185b);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 14px;
          box-shadow: 0 4px 16px rgba(233,85,120,0.38);
        }
        .os-title {
          font-size: clamp(26px, 5vw, 42px);
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: -0.025em;
          line-height: 1.12;
          margin: 0 0 10px;
          font-family: serif;
        }
        .os-sub {
          font-size: 13px;
          color: #888;
          font-weight: 500;
        }

        /* ── Grid ── */
        .os-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        /* ── Card ── */
        .oc-card {
          position: relative;
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid rgba(0,0,0,0.06);
          overflow: hidden;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          box-shadow: 0 6px 30px rgba(0,0,0,0.07);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          cursor: default;
        }
        .oc-card--hovered {
          transform: translateY(-7px) scale(1.012);
          box-shadow: 0 20px 55px var(--accent-glow, rgba(0,0,0,0.12)), 0 4px 14px rgba(0,0,0,0.08);
          border-color: var(--accent);
        }

        /* ── Discount badge ── */
        .oc-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--accent);
          color: #fff;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          z-index: 3;
          box-shadow: 0 3px 12px rgba(0,0,0,0.18);
          animation: oc-pulse 2.8s ease-in-out infinite;
        }
        @keyframes oc-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.88; transform: scale(1.04); }
        }

        /* ── Image ── */
        .oc-image-wrap {
          position: relative;
          width: 40%;
          min-width: 130px;
          flex-shrink: 0;
          background: var(--accent-light, #f8f8f8);
          overflow: hidden;
        }
        .oc-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.5s ease;
        }
        .oc-card--hovered .oc-image {
          transform: scale(1.07);
        }
        .oc-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 55%, rgba(255,255,255,0.65) 100%);
          pointer-events: none;
        }

        /* ── Body ── */
        .oc-body {
          flex: 1;
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          min-width: 0;
        }

        .oc-brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--accent);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .oc-name {
          font-size: clamp(14px, 2vw, 18px);
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: -0.015em;
          line-height: 1.25;
          margin: 0;
          font-family: serif;
        }

        .oc-desc {
          font-size: 11.5px;
          color: #888;
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .oc-pricing {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 2px;
        }
        .oc-price {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 900;
          color: #1a1a2e;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .oc-price-meta {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .oc-mrp {
          font-size: 13px;
          font-weight: 600;
          color: #ccc;
          text-decoration: line-through;
          line-height: 1;
        }
        .oc-save {
          font-size: 9.5px;
          font-weight: 800;
          color: #16a34a;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        /* ── CTA Button ── */
        .oc-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 11px 20px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          margin-top: 4px;
          align-self: flex-start;
          transition: all 0.28s ease;
          box-shadow: 0 5px 16px var(--accent-shadow, rgba(0,0,0,) 0.3);
          position: relative;
          overflow: hidden;
        }
        .oc-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%);
          pointer-events: none;
        }
        .oc-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
          box-shadow: 0 10px 28px var(--accent-shadow, rgba(0,0,0,) 0.42);
        }
        .oc-btn:active {
          transform: translateY(0);
          filter: brightness(0.95);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .os-grid {
            grid-template-columns: 1fr;
            max-width: 560px;
          }
        }
        @media (max-width: 560px) {
          .os-wrapper {
            padding: 44px 12px 56px;
          }
          .oc-card {
            flex-direction: column;
          }
          .oc-image-wrap {
            width: 100%;
            min-width: unset;
            height: 200px;
          }
          .oc-image-overlay {
            background: linear-gradient(to bottom, transparent 55%, rgba(255,255,255,0.65) 100%);
          }
          .oc-body {
            padding: 18px 16px;
          }
          .oc-btn {
            align-self: stretch;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default OfferSection;
