import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight } from "../../components/common/Icons";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ColorRing } from "react-loader-spinner";

function getPasswordStrength(password) {
  if (!password) return { label: "", width: "0%", color: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Weak", width: "25%", color: "bg-red-500" },
    { label: "Fair", width: "50%", color: "bg-amber" },
    { label: "Good", width: "75%", color: "bg-amber" },
    { label: "Strong", width: "100%", color: "bg-emerald-500" },
  ];
  return levels[Math.min(score, 3)];
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();
  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email.trim()))
      errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setSubmitError("");
    setSuccessMsg("");

    try {
      const res = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setSuccessMsg(
        res?.message ||
          "Registration successful! Please check your email for the verification link."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join EcoBazaar for fast checkout, tracked deliveries, and members-only deals."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <InputField
          label="Full Name"
          name="name"
          icon={User}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Zahid Hasan"
          autoComplete="name"
        />

        <InputField
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          {form.password && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-ink/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate/70 w-12 text-right">
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
          autoComplete="new-password"
        />

        {submitError && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
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
              <span>Create Free Account</span>
              <ArrowRight size={15} />
            </span>
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-ink/10 flex-1" />
        <span className="text-[11px] font-semibold text-slate/50 uppercase tracking-wider">
          Already a Member?
        </span>
        <div className="h-px bg-ink/10 flex-1" />
      </div>

      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl border border-ink/15 text-xs font-bold text-ink hover:bg-ink/[0.03] hover:border-amber/40 transition-all"
        >
          Sign In to Existing Account
        </Link>
      </div>
    </AuthLayout>
  );
}
