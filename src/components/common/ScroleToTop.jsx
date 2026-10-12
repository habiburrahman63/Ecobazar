
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export default function ScroleToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  // Configure browser scroll restoration once on initial mount
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Only reset scroll when navigating to a different page route (pathname change)
  // This prevents violent jumping/jittering when user adjusts search filters or query parameters
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  return null;
}

