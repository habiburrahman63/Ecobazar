// Central icon file — all icons used across the app should be imported from here,
// not directly from lucide-react. This keeps icon usage consistent and makes it
// easy to swap/fix icons in one place if a package export ever changes.

import {
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Eye,
  EyeOff,
  Lock,
  Truck,
  ShieldCheck,
  Shield,
  RotateCcw,
  CreditCard,
  SlidersHorizontal,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Trash2,
  Edit,
  Check,
  CheckCircle2,
  AlertCircle,
  Package,
  Star,
  Clock,
  LogOut,
  LayoutDashboard,
  Users,
  ShoppingBag,
  ImagePlus,
  ArrowRight,
  Headphones,
  Zap,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  BookOpen,
  Sparkles,
  Dumbbell,
  ShoppingBasket,
  Gamepad2,
  Car,
  HeartPulse,
  Gem,
  PawPrint,
  Tag,
  TrendingUp,
  ExternalLink,
  Settings,
  Key,

  // Bulk product upload
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  Download,
} from "lucide-react";

// ---- Re-exported lucide icons (safe, non-brand) ----
export {
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Eye,
  EyeOff,
  Lock,
  Truck,
  ShieldCheck,
  Shield,
  RotateCcw,
  CreditCard,
  SlidersHorizontal,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Trash2,
  Edit,
  Edit as Edit2,
  Check,
  CheckCircle2,
  AlertCircle,
  Package,
  Star,
  Clock,
  LogOut,
  LayoutDashboard,
  Users,
  ShoppingBag,
  ImagePlus,
  ArrowRight,
  Headphones,
  Zap,
  Smartphone,
  Shirt,
  HomeIcon,
  BookOpen,
  Sparkles,
  Dumbbell,
  ShoppingBasket,
  Gamepad2,
  Car,
  HeartPulse,
  Gem,
  PawPrint,
  Tag,
  TrendingUp,
  ExternalLink,
  Settings,
  Key,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  Download,
};

// ---- Custom brand/social icons (not available in lucide-react) ----

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" {...props}>
      <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9V12h2.6V9.8c0-2.56 1.53-3.98 3.87-3.98 1.12 0 2.29.2 2.29.2v2.5h-1.29c-1.27 0-1.67.79-1.67 1.6V12h2.84l-.45 2.88h-2.39v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      width="17"
      height="17"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" {...props}>
      <path d="M18.9 3H21l-6.6 7.6L22.2 21h-6.8l-5.3-6.9L4 21H1.9l7-8.1L1 3h6.9l4.8 6.3L18.9 3Zm-1.2 16.2h1.9L7.4 4.7H5.4l12.3 14.5Z" />
    </svg>
  );
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export function WhatsappIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" {...props}>
      <path d="M17.47 14.38c-.29-.15-1.71-.85-1.98-.94-.27-.1-.46-.15-.66.14-.19.29-.75.94-.92 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.58-.9-2.17-.24-.57-.48-.49-.66-.5h-.56c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3 .15.19 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34ZM12.02 22h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.64-.24-.37A9.86 9.86 0 0 1 2.05 12C2.05 6.5 6.53 2.02 12.02 2.02c2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.9 6.98c0 5.5-4.48 10.1-9.88 10.1Zm8.4-18.5A11.82 11.82 0 0 0 12.02 0C5.4 0 0 5.4 0 12.02c0 2.12.55 4.19 1.61 6.02L0 24l6.11-1.6a11.98 11.98 0 0 0 5.9 1.5h.01c6.62 0 12.02-5.4 12.02-12.02 0-3.21-1.25-6.23-3.52-8.5-.71-.7-1.42-1.24-2.1-1.9Z" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" {...props}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.5V8.5l6.4 3.5-6.4 3.5Z" />
    </svg>
  );
}