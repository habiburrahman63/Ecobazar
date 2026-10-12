import { useEffect, useState, useRef } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  ChevronDown,
  Mail,
  Phone,
  Truck,
  Package,
  Sparkles,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from "./Icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { fetchCategories } from "../../api/categoryApi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openMobileCat, setOpenMobileCat] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [categories, setCategories] = useState([]);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    let active = true;
    async function loadCats() {
      try {
        const data = await fetchCategories();
        if (active) {
          setCategories(data.filter((c) => c.status !== "inactive"));
        }
      } catch (err) {
        console.error("Failed to load categories in navbar:", err);
      }
    }
    loadCats();
    return () => {
      active = false;
    };
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const activeCategoryParam = searchParams.get("category");
  const activeSubParam = searchParams.get("sub");
  const activeCategory = categories.find((c) => c.name === activeCategoryParam);
  const showRefineBar =
    location.pathname === "/products" &&
    activeCategory &&
    activeCategory.subcategories?.length > 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const toggleMobileCat = (name) => {
    setOpenMobileCat((prev) => (prev === name ? null : name));
  };

  const handleSubClick = (sub) => {
    const next = new URLSearchParams(searchParams);
    if (activeSubParam === sub) {
      next.delete("sub");
    } else {
      next.set("sub", sub);
    }
    setSearchParams(next);
  };

  const userDisplayName = user?.fullname || user?.name || "My Account";
  const userInitials = userDisplayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <>
      {/* Top luxury utility announcement bar — scrolls naturally with page */}
      <div className="hidden sm:block bg-gradient-to-r from-ink via-slate-900 to-ink text-paper/80 text-[11px] font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-paper/90">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <Truck size={13} className="text-amber shrink-0" />
              Express nationwide delivery across Bangladesh
            </span>
            <span className="hidden md:inline-block text-paper/30">|</span>
            <span className="hidden md:flex items-center gap-1 text-paper/80">
              <ShieldCheck size={13} className="text-amber shrink-0" />
              100% Genuine & Authentic Products
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="mailto:support@ecobazar.com"
              className="hidden lg:flex items-center gap-1.5 hover:text-amber transition-colors"
            >
              <Mail size={12} className="text-amber shrink-0" />
              support@ecobazar.com
            </a>
            <a
              href="tel:+8801816677503"
              className="flex items-center gap-1.5 hover:text-amber transition-colors"
            >
              <Phone size={12} className="text-amber shrink-0" />
              +880 18166 77503
            </a>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-amber font-semibold hover:text-amber/80 transition-colors bg-white/10 px-2 py-0.5 rounded"
              >
                <LayoutDashboard size={11} /> Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main sticky header with GPU hardware acceleration to eliminate scroll jitter */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] [transform:translateZ(0)]">
        {/* Main navbar bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 sm:gap-8 h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ink to-slate-800 border border-slate-700/40 flex items-center justify-center text-amber shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={20} className="text-amber group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight text-ink group-hover:text-amber-hover transition-colors">
                Eco<span className="text-amber">Bazaar</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-slate/70 uppercase -mt-1">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Search bar — desktop with glass styling */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full group">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/60 group-focus-within:text-amber transition-colors"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search premium products by title, category, brand..."
                className="w-full pl-11 pr-12 py-2.5 rounded-full border border-slate-200 bg-slate-50/70 text-sm text-ink placeholder:text-slate/50
                  focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate/40 hover:text-slate"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Account / Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl text-sm font-medium text-ink hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ink to-slate-700 text-paper flex items-center justify-center font-bold text-xs shadow-sm">
                    {userInitials}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-ink line-clamp-1 max-w-[100px]">
                      {userDisplayName}
                    </span>
                    <span className="text-[10px] text-slate/70 capitalize">
                      {user.role || "Member"}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate/60 transition-transform ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Account popover dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-semibold text-ink line-clamp-1">
                        {userDisplayName}
                      </p>
                      <p className="text-[11px] text-slate line-clamp-1 mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink/80 hover:text-ink hover:bg-slate-50 transition-colors"
                      >
                        <User size={14} className="text-slate" /> My Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink/80 hover:text-ink hover:bg-slate-50 transition-colors"
                      >
                        <Package size={14} className="text-slate" /> My Orders
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber hover:bg-amber/5 transition-colors"
                        >
                          <LayoutDashboard size={14} /> Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-ink hover:text-amber bg-slate-100 hover:bg-slate-200/80 transition-all border border-slate-200/60"
              >
                <User size={15} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Shopping Cart Pill Button */}
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-ink text-paper hover:bg-amber hover:text-ink active:scale-95 transition-all shadow-sm"
              aria-label="View shopping cart"
            >
              <div className="relative">
                <ShoppingCart size={15} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber text-ink text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* Mobile Hamburger toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-ink hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle mobile menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Strip — desktop with modern badges */}
      <nav className="hidden md:block border-t border-slate-100 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-wrap gap-x-6 gap-y-0 min-h-12">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-xs font-semibold uppercase tracking-wider py-3 border-b-2 transition-all ${
                  isActive
                    ? "text-amber border-amber"
                    : "text-slate border-transparent hover:text-ink hover:border-slate-300"
                }`
              }
            >
              All Products
            </NavLink>

            {categories.map((cat) => {
              const isActiveTab = activeCategoryParam === cat.name;
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;
              return (
                <div
                  key={cat._id || cat.name}
                  className="relative group/cat"
                  onMouseEnter={() => setHoveredCat(cat.name)}
                  onMouseLeave={() => setHoveredCat(null)}
                >
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider py-3 whitespace-nowrap border-b-2 transition-all ${
                      isActiveTab || hoveredCat === cat.name
                        ? "text-amber border-amber"
                        : "text-slate border-transparent hover:text-ink hover:border-slate-300"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {hasSubs && <ChevronDown size={12} className="opacity-60" />}
                  </Link>

                  {/* Mega-menu dropdown */}
                  {hasSubs && hoveredCat === cat.name && (
                    <div className="absolute top-full left-0 bg-white border border-slate-200 rounded-2xl shadow-xl min-w-52 py-2.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-1.5 text-[10px] font-bold text-slate/50 uppercase tracking-wider border-b border-slate-100 mb-1">
                        {cat.name} Collections
                      </div>
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/products?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`}
                          className="block px-4 py-2 text-xs font-medium text-ink/80 hover:text-amber hover:bg-slate-50 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Refine bar — sticky subcategory pills on /products */}
      {showRefineBar && (
        <div className="border-t border-amber/15 bg-gradient-to-r from-amber/5 via-amber/10 to-amber/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-ink uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber" />
                {activeCategory.name}
                <span className="text-slate font-normal lowercase">collections:</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {activeCategory.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSubClick(sub)}
                    className={`text-xs font-medium px-3.5 py-1 rounded-full whitespace-nowrap transition-all shadow-sm ${
                      activeSubParam === sub
                        ? "bg-amber text-ink font-semibold ring-2 ring-amber/30"
                        : "bg-white border border-slate-200 text-slate hover:border-amber hover:text-amber"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-6 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in duration-200">
          <form onSubmit={handleSearch} className="pt-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber/30"
              />
            </div>
          </form>

          <nav className="flex flex-col pt-4 divide-y divide-slate-100">
            <NavLink
              to="/products"
              className="text-sm font-semibold py-3 text-ink hover:text-amber flex items-center justify-between"
              onClick={() => setOpen(false)}
            >
              <span>All Products</span>
              <span className="text-xs text-slate font-normal">Browse catalog →</span>
            </NavLink>

            {categories.map((cat) => {
              const isOpen = openMobileCat === cat.name;
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;
              return (
                <div key={cat._id || cat.name} className="py-2.5">
                  <div className="w-full flex items-center justify-between text-sm text-ink/80">
                    <Link
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 font-medium"
                    >
                      <Package size={16} className="text-amber" />
                      {cat.name}
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={() => toggleMobileCat(cat.name)}
                        className="p-1.5 text-slate"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {hasSubs && isOpen && (
                    <div className="pl-6 pt-2 flex flex-col gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/products?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`}
                          onClick={() => setOpen(false)}
                          className="text-xs text-slate hover:text-amber py-1"
                        >
                          • {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-semibold bg-slate-100 rounded-xl text-ink"
                >
                  My Profile
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-semibold bg-slate-100 rounded-xl text-ink"
                >
                  My Orders
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-semibold bg-amber text-ink rounded-xl"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-center text-xs font-semibold bg-ink text-paper rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-center text-xs font-semibold bg-slate-100 text-ink rounded-xl"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
}
