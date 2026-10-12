import { Outlet, NavLink, useNavigate } from "react-router";
import { User, Package, LogOut, ShieldCheck } from "../components/common/Icons";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/profile", label: "My Profile & Details", icon: User },
  { to: "/my-orders", label: "Order History", icon: Package },
];

export default function AccountLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userDisplayName = user?.fullname || user?.name || "Member";
  const userInitials = userDisplayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* User Account Navigation Sidebar */}
        <aside className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          {/* User Profile Badge */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ink to-slate-700 text-paper flex items-center justify-center font-bold text-base shadow-sm">
              {userInitials}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-ink truncate">
                {userDisplayName}
              </h2>
              <p className="text-xs text-slate truncate">
                {user?.email || "Customer"}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber capitalize mt-0.5">
                <ShieldCheck size={11} /> {user?.role || "Member"}
              </span>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1.5 pt-4 overflow-x-auto lg:overflow-visible">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-ink text-paper shadow-sm"
                      : "text-slate hover:text-ink hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap mt-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Account Outlet Content */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
