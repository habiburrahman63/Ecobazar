import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Mail,
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  User,
  ArrowRight,
  Check,
  Sparkles,
} from "./Icons";
import { fetchCategories } from "../../api/categoryApi";
import { fetchActiveProducts } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";

function getMainImage(product) {
  return (
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    ""
  );
}

const trustPoints = [
  {
    icon: Truck,
    label: "Express Delivery",
    desc: "Swift 24-72h nationwide shipping",
  },
  {
    icon: ShieldCheck,
    label: "AamarPay Verified",
    desc: "Bank-grade 256-bit encrypted checkout",
  },
  {
    icon: RotateCcw,
    label: "7-Day Easy Returns",
    desc: "Hassle-free replacement guarantee",
  },
  {
    icon: CreditCard,
    label: "Flexible Payments",
    desc: "bKash, Nagad, Cards & Cash on Delivery",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [cats, prods] = await Promise.allSettled([
          fetchCategories(),
          fetchActiveProducts(),
        ]);
        if (active) {
          if (cats.status === "fulfilled") {
            setCategories(cats.value.filter((c) => c.status !== "inactive"));
          }
          if (prods.status === "fulfilled") {
            setProducts(prods.value || []);
          }
        }
      } catch (err) {
        console.error("Footer data loading error:", err);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const bestSellers = [...products]
    .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
    .slice(0, 4);
  const newArrivals = [...products].reverse().slice(0, 4);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-[#0e1626] via-[#090e1a] to-[#050811] text-paper/80 mt-24 border-t border-white/[0.08] relative overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-64 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Trust points bar */}
      <div className="border-b border-white/[0.08] relative z-10 backdrop-blur-sm bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber/25 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0 text-amber shadow-[0_0_15px_rgba(235,161,28,0.15)]">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-paper tracking-tight">
                  {label}
                </p>
                <p className="text-xs text-paper/50 mt-0.5 truncate">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real Products Spotlight (if products exist) */}
      {products.length > 0 && (
        <div className="border-b border-white/[0.08] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Best Sellers */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                  <h3 className="text-xs font-bold text-paper tracking-wider uppercase">
                    Customer Favorites
                  </h3>
                </div>
                <Link
                  to="/products"
                  className="text-xs text-amber font-semibold hover:text-amber/80 flex items-center gap-1 transition-colors"
                >
                  Explore all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {bestSellers.map((p) => (
                  <Link
                    key={p._id}
                    to={`/products/${p._id}`}
                    className="group bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5 hover:border-amber/30 hover:bg-white/[0.06] transition-all"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white/5 mb-2 relative">
                      <img
                        src={getMainImage(p)}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs text-paper/85 font-medium line-clamp-1 group-hover:text-amber transition-colors">
                      {p.title}
                    </p>
                    <p className="text-xs text-amber font-bold mt-1">
                      ৳{p.salePrice.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* New Arrivals */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-amber" />
                  <h3 className="text-xs font-bold text-paper tracking-wider uppercase">
                    Latest Catalog Arrivals
                  </h3>
                </div>
                <Link
                  to="/products?sort=newest"
                  className="text-xs text-amber font-semibold hover:text-amber/80 flex items-center gap-1 transition-colors"
                >
                  Explore new <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {newArrivals.map((p) => (
                  <Link
                    key={p._id}
                    to={`/products/${p._id}`}
                    className="group bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5 hover:border-amber/30 hover:bg-white/[0.06] transition-all"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white/5 mb-2 relative">
                      <img
                        src={getMainImage(p)}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs text-paper/85 font-medium line-clamp-1 group-hover:text-amber transition-colors">
                      {p.title}
                    </p>
                    <p className="text-xs text-amber font-bold mt-1">
                      ৳{p.salePrice.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main footer navigation & newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand info & newsletter (Col 1-5) */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber to-amber/70 flex items-center justify-center font-bold text-ink shadow-[0_0_15px_rgba(235,161,28,0.3)]">
                E
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-paper">
                Eco<span className="text-amber">Bazaar</span>
              </span>
            </Link>

            <p className="text-sm text-paper/65 leading-relaxed max-w-sm">
              Your premier destination for verified authentic lifestyle goods,
              electronics, and daily essentials. Handcrafted quality backed by
              secure AamarPay checkout.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-sm">
              <p className="text-xs font-semibold text-paper uppercase tracking-wider mb-1">
                Join the EcoBazaar Club
              </p>
              <p className="text-xs text-paper/50 mb-3">
                Get instant flash deal alerts and member-only coupons.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber/15 border border-amber/30 text-amber text-xs font-medium">
                  <Check size={16} />
                  <span>You're subscribed! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-paper/40"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-paper placeholder:text-paper/40 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber to-amber/90 text-ink text-xs font-bold hover:shadow-[0_0_15px_rgba(235,161,28,0.35)] transition-all shrink-0 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Direct Contact info */}
            <div className="space-y-2 pt-2">
              <a
                href="tel:+8801816677503"
                className="flex items-center gap-3 text-xs text-paper/70 hover:text-amber transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-amber group-hover:bg-amber/15 transition-colors">
                  <Phone size={13} />
                </div>
                <span>+880 18166 77503 (9 AM - 10 PM)</span>
              </a>
              <a
                href="mailto:support@ecobazar.com"
                className="flex items-center gap-3 text-xs text-paper/70 hover:text-amber transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-amber group-hover:bg-amber/15 transition-colors">
                  <Mail size={13} />
                </div>
                <span>support@ecobazar.com</span>
              </a>
              <div className="flex items-start gap-3 text-xs text-paper/70">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-amber shrink-0 mt-0.5">
                  <MapPin size={13} />
                </div>
                <span>House 12, Road 5, Dhanmondi, Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Real Categories (Col 6-7) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-paper uppercase tracking-wider border-b border-white/[0.08] pb-2.5">
              Categories
            </h4>
            {categories.length === 0 ? (
              <p className="text-xs text-paper/40">No categories found</p>
            ) : (
              <ul className="space-y-2.5 text-xs">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat._id || cat.name}>
                    <Link
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="text-paper/65 hover:text-amber transition-colors flex items-center justify-between group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {cat.name}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/products"
                    className="text-amber font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    All categories <ArrowRight size={11} />
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Account & Profile (Col 8-9) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-paper uppercase tracking-wider border-b border-white/[0.08] pb-2.5">
              Customer Account
            </h4>
            <ul className="space-y-2.5 text-xs text-paper/65">
              {user ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="hover:text-amber transition-colors flex items-center gap-1.5"
                    >
                      <User size={13} className="text-amber" />
                      <span>{user.name || "My Profile"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-orders"
                      className="hover:text-amber transition-colors"
                    >
                      My Orders & Tracking
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      className="hover:text-amber transition-colors"
                    >
                      Shopping Cart
                    </Link>
                  </li>
                  {(user.role === "admin" || user.role === "manager") && (
                    <li>
                      <Link
                        to="/admin"
                        className="text-amber font-semibold hover:underline"
                      >
                        Admin Control Panel
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="hover:text-amber transition-colors"
                    >
                      Sign In to Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="hover:text-amber transition-colors"
                    >
                      Create Free Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      className="hover:text-amber transition-colors"
                    >
                      View Shopping Cart
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Help & Assurance (Col 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-paper uppercase tracking-wider border-b border-white/[0.08] pb-2.5">
              Assurance & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-paper/65">
              <li>
                <Link
                  to="/products"
                  className="hover:text-amber transition-colors"
                >
                  Browse Full Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/resend-verification"
                  className="hover:text-amber transition-colors"
                >
                  Resend Verification Email
                </Link>
              </li>
              <li>
                <Link
                  to="/forgot-password"
                  className="hover:text-amber transition-colors"
                >
                  Account Password Recovery
                </Link>
              </li>
            </ul>

            {/* Payment Partners & Security Badges */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-paper/80 uppercase tracking-wider mb-2">
                Supported Payments
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-1 rounded bg-white/[0.08] border border-white/[0.1] text-[10px] font-bold text-paper/90">
                  AamarPay
                </span>
                <span className="px-2 py-1 rounded bg-pink-500/20 border border-pink-500/30 text-[10px] font-bold text-pink-300">
                  bKash
                </span>
                <span className="px-2 py-1 rounded bg-orange-500/20 border border-orange-500/30 text-[10px] font-bold text-orange-300">
                  Nagad
                </span>
                <span className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-300">
                  Visa
                </span>
                <span className="px-2 py-1 rounded bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-300">
                  Mastercard
                </span>
                <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                  COD
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-paper/40">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>256-Bit SSL Encrypted & Verified Payments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-paper/45">
            © {new Date().getFullYear()} EcoBazaar Ltd. All rights reserved.
            Genuine Products Guaranteed.
          </p>

          {/* Social media links */}
          <div className="flex items-center gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-paper/60 hover:text-amber hover:border-amber/30 hover:bg-white/[0.08] transition-all"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-paper/60 hover:text-amber hover:border-amber/30 hover:bg-white/[0.08] transition-all"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-paper/60 hover:text-amber hover:border-amber/30 hover:bg-white/[0.08] transition-all"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-paper/60 hover:text-amber hover:border-amber/30 hover:bg-white/[0.08] transition-all"
            >
              <LinkedinIcon />
            </a>
            <a
              href="https://wa.me/8801816677503"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-paper/60 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-white/[0.08] transition-all"
            >
              <WhatsappIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}