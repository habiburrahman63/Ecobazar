import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AccountLayout from "../layouts/AccountLayout";
import AdminLayout from "../layouts/AdminLayout";

// Common
import ProtectedRoute from "../components/common/ProtectedRoute";
import { PageLoader } from "../components/common/Loader";

// Critical storefront landing page (loaded directly for instant initial paint)
import Home from "../pages/customer/Home";

// Customer pages (Code-split for on-demand downloading)
const ProductListing = lazy(() => import("../pages/customer/ProductListing"));
const ProductDetails = lazy(() => import("../pages/customer/ProductDetails"));
const Cart = lazy(() => import("../pages/customer/Cart"));
const Checkout = lazy(() => import("../pages/customer/Checkout"));
const OrderSuccess = lazy(() => import("../pages/customer/OrderSuccess"));
const OrderFailed = lazy(() => import("../pages/customer/OrderFailed"));
const MyOrders = lazy(() => import("../pages/customer/MyOrders"));
const Profile = lazy(() => import("../pages/customer/Profile"));

// Auth pages (Code-split)
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const ResendVerification = lazy(() => import("../pages/auth/ResendVerification"));

// Admin pages (Code-split so customers never download admin code)
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const ManageProducts = lazy(() => import("../pages/admin/ManageProducts"));
const ManageCategories = lazy(() => import("../pages/admin/ManageCategories"));
const AddProduct = lazy(() => import("../pages/admin/AddProduct"));
const BulkProductUpload = lazy(() => import("../pages/admin/BulkProductUpload"));
const EditProduct = lazy(() => import("../pages/admin/EditProduct"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const UserDetails = lazy(() => import("../pages/admin/UserDetails"));
const ManageOrders = lazy(() => import("../pages/admin/ManageOrders"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));

// Fallback
const NotFound = lazy(() => import("../pages/NotFound"));

/**
 * Helper to wrap lazy-loaded components in Suspense with smooth loader
 */
const suspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: suspense(ProductListing) },
      { path: "products/:id", element: suspense(ProductDetails) },
      { path: "cart", element: suspense(Cart) },
      { path: "checkout", element: suspense(Checkout) },
      { path: "order-success", element: suspense(OrderSuccess) },
      { path: "order-failed", element: suspense(OrderFailed) },

      // Account section — logged-in roles can access
      {
        path: "",
        element: (
          <ProtectedRoute allowedroles={["user", "manager", "admin"]}>
            <AccountLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "profile", element: suspense(Profile) },
          { path: "my-orders", element: suspense(MyOrders) },
        ],
      },

      { path: "*", element: suspense(NotFound) },
    ],
  },

  // Dedicated Admin Login portal
  { path: "/admin/login", element: suspense(AdminLogin) },

  // Admin Dashboard section — protected for Manager + Admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedroles={["manager", "admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: suspense(Dashboard) },
      { path: "products", element: suspense(ManageProducts) },
      { path: "products/create", element: suspense(AddProduct) },
      { path: "products/bulk-upload", element: suspense(BulkProductUpload) },
      { path: "products/edit/:id", element: suspense(EditProduct) },
      { path: "categories", element: suspense(ManageCategories) },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedroles={["admin"]}>
            {suspense(ManageUsers)}
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <ProtectedRoute allowedroles={["admin"]}>
            {suspense(UserDetails)}
          </ProtectedRoute>
        ),
      },
      { path: "orders", element: suspense(ManageOrders) },
      {
        path: "settings",
        element: (
          <ProtectedRoute allowedroles={["admin"]}>
            {suspense(AdminSettings)}
          </ProtectedRoute>
        ),
      },
      { path: "*", element: suspense(NotFound) },
    ],
  },

  // Customer Auth pages
  { path: "/login", element: suspense(Login) },
  { path: "/register", element: suspense(Register) },
  { path: "/forgot-password", element: suspense(ForgotPassword) },
  { path: "/resetpassword/:token", element: suspense(ResetPassword) },
  { path: "/verifyemail/:token", element: suspense(VerifyEmail) },
  { path: "/verifyemal/:token", element: suspense(VerifyEmail) }, // backward-compatibility alias
  { path: "/resend-verification", element: suspense(ResendVerification) },
]);

export default router;
