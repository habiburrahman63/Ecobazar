import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Mail, Lock, AlertCircle, ArrowRight } from "../../components/common/Icons";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ColorRing } from "react-loader-spinner";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email.trim()))
      errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setSubmitError("");

    try {
      const user = await login(form.email.trim(), form.password);
      const redirectPath =
        user?.role === "admin" || user?.role === "manager"
          ? "/admin"
          : location.state?.from?.pathname || "/";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your verified credentials to access your orders and saved items."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="name@example.com"
          autoComplete="email"
        />

        <div>
          <InputField
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-amber hover:text-amber/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {submitError && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <Button
          type="submit"
          className="mt-2 w-full py-3 bg-gradient-to-r from-ink via-[#182438] to-ink hover:from-[#182438] hover:to-ink text-paper rounded-xl font-semibold shadow-md transition-all cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <ColorRing
              visible={true}
              height="24"
              width="24"
              ariaLabel="loading"
              wrapperClass="inline-block"
              colors={["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]}
            />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Sign In</span>
              <ArrowRight size={15} />
            </span>
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-ink/10 flex-1" />
        <span className="text-[11px] font-semibold text-slate/50 uppercase tracking-wider">
          New to EcoBazaar?
        </span>
        <div className="h-px bg-ink/10 flex-1" />
      </div>

      <div className="text-center">
        <Link
          to="/register"
          className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl border border-ink/15 text-xs font-bold text-ink hover:bg-ink/[0.03] hover:border-amber/40 transition-all"
        >
          Create a New Account
        </Link>
      </div>
    </AuthLayout>
  );
}
