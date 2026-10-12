import { useState } from "react";
import { Link } from "react-router";
import { Mail, AlertCircle, CheckCircle2, ArrowRight } from "../../components/common/Icons";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { resendVerificationApi } from "../../api/authApi";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email");

    setLoading(true);
    setApiError("");

    try {
      await resendVerificationApi(email.trim());
      setSent(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          err.message ||
          "Failed to resend verification email."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Verification email dispatched"
        subtitle={`We've dispatched a fresh activation link to ${email}.`}
      >
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs space-y-2 mb-6">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 size={16} />
            <span>Email Dispatched</span>
          </div>
          <p className="leading-relaxed">
            Please click the activation link in your email to verify your
            account. Once verified, you will be able to log in immediately.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setSent(false)}
            className="w-full py-2.5 px-4 rounded-xl border border-ink/15 text-xs font-bold text-ink hover:bg-ink/[0.03] transition-all cursor-pointer"
          >
            Send to another address
          </button>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-xs font-semibold text-slate hover:text-ink transition-colors"
          >
            <span>← Return to Login</span>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter your registration email and we'll send a fresh activation link."
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
            <span>Send Activation Link</span>
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