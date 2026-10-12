import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Lock, AlertCircle, CheckCircle2, ArrowRight } from "../../components/common/Icons";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { resetPasswordApi } from "../../api/authApi";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const errs = {};
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
    setApiError("");

    try {
      await resetPasswordApi(token, form.password, form.confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Ensure your new password has at least 6 characters."
    >
      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-base font-bold text-ink">
              Password updated successfully!
            </p>
            <p className="text-xs text-slate mt-1">
              Redirecting you to the login screen...
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber hover:underline"
          >
            Click here if not redirected automatically →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="New Password"
            name="password"
            type="password"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            icon={Lock}
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            autoComplete="new-password"
          />

          {apiError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="mt-2 w-full py-3 bg-gradient-to-r from-ink via-[#182438] to-ink hover:from-[#182438] hover:to-ink text-paper rounded-xl font-semibold shadow-md transition-all cursor-pointer"
          >
            <span className="flex items-center justify-center gap-2">
              <span>Save New Password</span>
              <ArrowRight size={15} />
            </span>
          </Button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate hover:text-ink transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
