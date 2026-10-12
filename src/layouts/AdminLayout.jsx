import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  User,
  Settings,
} from "../components/common/Icons";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/users", label: "Customers & Staff", icon: Users },
  { to: "/admin/orders", label: "Orders & Shipments", icon: ShoppingBag },
  { to: "/admin/settings", label: "Settings & Admins", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-amber to-amber/90 text-ink shadow-[0_4px_16px_rgba(235,161,28,0.25)] font-bold"
        : "text-paper/70 hover:bg-white/[0.06] hover:text-paper"
    }`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex selection:bg-amber selection:text-ink">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-[#0e1626] via-[#090e1a] to-[#050811] text-paper shrink-0 border-r border-white/[0.08] relative z-20">
        {/* Brand header */}
        <div className="px-6 h-20 flex items-center justify-between border-b border-white/[0.08]">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber to-amber/70 flex items-center justify-center font-bold text-ink shadow-[0_0_15px_rgba(235,161,28,0.3)]">
              E
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-paper">
                Eco<span className="text-amber">Bazaar</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber/80 -mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Current Admin Identity Pill */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber/15 border border-amber/25 flex items-center justify-center text-amber shrink-0 font-bold text-sm">
            {user?.name ? user.name[0].toUpperCase() : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-paper truncate">
              {user?.name || "Administrator"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-paper/50 capitalize">
                {user?.role || "Admin"} • Verified
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="px-3 pt-2">
          <p className="text-[10px] font-bold text-paper/40 uppercase tracking-wider px-3 mb-2">
            Management
          </p>
          <nav className="flex flex-col gap-1.5">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Live Storefront quick launch */}
        <div className="px-3 mt-auto pt-4 border-t border-white/[0.08]">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-paper/75 hover:text-paper text-xs font-semibold transition-all mb-2"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-amber" />
              <span>Live Customer Store</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber/20 text-amber font-bold">
              View
            </span>
          </Link>
        </div>

        {/* Bottom sign out */}
        <div className="p-3 border-t border-white/[0.08]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#090e1a]/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-[#0e1626] via-[#090e1a] to-[#050811] text-paper flex flex-col z-10 border-r border-white/[0.1]">
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/[0.08]">
              <Link to="/admin" className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber to-amber/70 flex items-center justify-center font-bold text-ink">
                  E
                </span>
                <span className="font-display text-lg font-bold text-paper">
                  Eco<span className="text-amber">Bazaar</span>
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-paper/60 hover:text-paper hover:bg-white/[0.06]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 mx-3 my-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber/15 border border-amber/25 flex items-center justify-center text-amber shrink-0 font-bold text-sm">
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-paper truncate">
                  {user?.name || "Administrator"}
                </p>
                <p className="text-[10px] text-paper/50 capitalize">
                  {user?.role || "Admin"}
                </p>
              </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 p-4">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-white/[0.08] space-y-2">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.04] text-paper/75 text-xs font-semibold w-full"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink size={14} className="text-amber" />
                  <span>View Customer Store</span>
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors w-full cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden h-16 bg-white border-b border-ink/10 flex items-center px-4 justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl border border-ink/10 flex items-center justify-center text-ink hover:bg-ink/[0.03]"
          >
            <Menu size={20} />
          </button>
          <span className="font-display text-base font-bold text-ink">
            Eco<span className="text-amber">Bazaar</span> Admin
          </span>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-xl border border-ink/10 flex items-center justify-center text-slate hover:text-ink hover:bg-ink/[0.03]"
          >
            <ExternalLink size={16} />
          </Link>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}