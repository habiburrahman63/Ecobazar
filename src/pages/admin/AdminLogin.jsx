import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Shield,
  Key,
} from "../../components/common/Icons";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ColorRing } from "react-loader-spinner";

export default function AdminLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin } = useAuth();

  const accessDenied = location.state?.accessDenied;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitError("");
  };

  const handleFillInitialAdmin = () => {
    setForm({
      email: "admin@gmail.com",
      password: "admin123456",
    });
    setErrors({});
    setSubmitError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Administrator email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email.trim()))
      errs.email = "Enter a valid email format.";
    if (!form.password) errs.password = "Password is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setSubmitError("");

    try {
      const user = await adminLogin(form.email.trim(), form.password);
      const redirectPath = location.state?.from?.pathname || "/admin";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          "Authentication failed. Please verify administrator credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1424] via-[#080d19] to-[#040711] text-paper flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-amber selection:text-ink">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10 pt-2">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber to-amber/70 flex items-center justify-center font-bold text-ink shadow-[0_0_20px_rgba(235,161,28,0.35)] group-hover:scale-105 transition-transform">
            E
          </span>
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-paper">
            Eco<span className="text-amber">Bazaar</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-amber text-xs font-semibold">
          <ShieldCheck size={14} />
          <span>Restricted Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-12 relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-3xl p-7 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
          {/* Emblem & Title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber/15 border border-amber/30 flex items-center justify-center text-amber mx-auto mb-4 shadow-[0_0_20px_rgba(235,161,28,0.2)]">
              <Shield size={26} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-paper tracking-tight">
              Admin Console Access
            </h1>
            <p className="text-paper/50 text-xs sm:text-sm mt-1.5 max-w-xs mx-auto">
              Please enter your authorized administrator credentials to proceed.
            </p>
          </div>

          {/* Access Denied Warning from route redirection */}
          {accessDenied && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber/10 border border-amber/25 text-amber text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>
                Standard customer sessions cannot enter the Administrative
                Console. Please authenticate with staff privileges.
              </span>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-paper/80 block mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/40"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs text-paper placeholder:text-paper/30 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-all"
                  autoComplete="username"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-paper/80 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/40"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs text-paper placeholder:text-paper/30 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-all"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Quick Initial Admin Fill Helper */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFillInitialAdmin}
                className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-semibold text-amber/90 hover:text-amber transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Key size={13} />
                <span>Fill Initial Admin Credentials (`admin@gmail.com`)</span>
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-3 w-full py-3 bg-gradient-to-r from-amber to-amber/90 text-ink rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(235,161,28,0.3)] hover:shadow-[0_0_25px_rgba(235,161,28,0.45)] transition-all cursor-pointer"
            >
              {loading ? (
                <ColorRing
                  visible={true}
                  height="22"
                  width="22"
                  ariaLabel="loading"
                  wrapperClass="inline-block"
                  colors={["#0a0f1d", "#0a0f1d", "#0a0f1d", "#0a0f1d", "#0a0f1d"]}
                />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Sign In as Administrator</span>
                  <ArrowRight size={15} />
                </span>
              )}
            </Button>
          </form>

          {/* Security notice */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-[11px] text-paper/40 leading-relaxed">
              Every login attempt is cryptographically signed, rate-limited, and
              recorded in the system audit log.
            </p>
          </div>
        </div>

        {/* Back to Customer Store link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs font-semibold text-paper/60 hover:text-amber transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Customer Storefront</span>
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-paper/30 relative z-10 pb-2">
        <span>© {new Date().getFullYear()} EcoBazaar Ltd. Administrative Security System.</span>
      </div>
    </div>
  );
}

