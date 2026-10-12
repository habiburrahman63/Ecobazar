import { useState } from "react";
import { Link } from "react-router";
import { Mail, AlertCircle, CheckCircle2, ArrowRight } from "../../components/common/Icons";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { forgotPasswordApi } from "../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Enter a valid email address");

    setLoading(true);
    setApiError("");
    try {
      await forgotPasswordApi(email.trim());
      setSent(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process request."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle={`We've dispatched a secure password reset link to ${email}.`}
      >
        <div className="p-4 rounded-2xl bg-amber/10 border border-amber/25 text-ink text-xs space-y-2 mb-6">
          <div className="flex items-center gap-2 font-semibold text-amber">
            <CheckCircle2 size={16} />
            <span>Reset Link Sent</span>
          </div>
          <p className="text-slate leading-relaxed">
            Please check your email and click the link to choose a new password.
            If you don't see it in a few minutes, check your spam folder.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setSent(false)}
            className="w-full py-2.5 px-4 rounded-xl border border-ink/15 text-xs font-bold text-ink hover:bg-ink/[0.03] transition-all cursor-pointer"
          >
            Try another email address
          </button>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-xs font-semibold text-slate hover:text-ink transition-colors"
          >
            <span>← Back to login</span>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your account email and we'll send you an encrypted recovery link."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setApiError("");
          }}
          error={error}
          placeholder="you@example.com"
          autoComplete="email"
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
          className="mt-1 w-full py-3 bg-gradient-to-r from-ink via-[#182438] to-ink hover:from-[#182438] hover:to-ink text-paper rounded-xl font-semibold shadow-md transition-all cursor-pointer"
        >
          <span className="flex items-center justify-center gap-2">
            <span>Send Recovery Link</span>
            <ArrowRight size={15} />
          </span>
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-xs font-semibold text-slate hover:text-ink transition-colors"
        >
          ← Return to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
