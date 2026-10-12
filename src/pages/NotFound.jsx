import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-6xl font-semibold text-ink">404</h1>
      <p className="text-slate mt-3">This page doesn't exist.</p>
      <Link to="/" className="inline-block mt-6 text-amber font-medium hover:underline">
        Back to home
      </Link>
    </div>
  );
};