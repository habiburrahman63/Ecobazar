import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import { verifyEmailApi } from "../../api/authApi";
import { CheckCircle2, AlertCircle, Loader2 } from "../../components/common/Icons";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function verify() {
      try {
        await verifyEmailApi(token);
        if (active) setStatus("success");
      } catch (err) {
        if (active) {
          setStatus("error");
          setErrorMessage(
            err.response?.data?.message ||
              err.message ||
              "Verification link is invalid or has expired."
          );
        }
      }
    }

    if (token) {
      verify();
    } else {
      setStatus("error");
      setErrorMessage("No verification token provided in the URL.");
    }

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthLayout
      title={
        status === "verifying"
          ? "Verifying your account..."
          : status === "success"
          ? "Account verified!"
          : "Verification failed"
      }
      subtitle={
        status === "verifying"
          ? "Please wait a moment while we validate your token."
          : status === "success"
          ? "Your email has been confirmed. You now have full access to your account."
          : errorMessage
      }
    >
      {status === "verifying" && (
        <div className="py-10 text-center flex flex-col items-center justify-center">
          <Loader2 size={32} className="text-amber animate-spin mb-3" />
          <p className="text-xs text-slate">Contacting authentication server...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 size={28} />
          </div>

          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-ink via-[#182438] to-ink hover:from-[#182438] hover:to-ink text-paper rounded-xl text-center text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Sign In to Your Account →
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 mx-auto">
            <AlertCircle size={28} />
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              to="/resend-verification"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-ink text-paper rounded-xl text-center text-xs font-bold hover:bg-ink/90 transition-all"
            >
              Request a New Activation Link
            </Link>
            <Link
              to="/login"
              className="text-center text-xs font-semibold text-slate hover:text-ink transition-colors mt-1"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
