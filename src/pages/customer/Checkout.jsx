import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AddressForm from "../../components/checkout/AddressForm";
import PaymentMethodSelector from "../../components/checkout/PaymentMethodSelector";
import OrderSummary from "../../components/checkout/OrderSummary";
import Button from "../../components/common/Button";
import { placeOrderApi } from "../../api/orderApi";
import { ShieldCheck, Lock, ShoppingCart, ArrowRight } from "../../components/common/Icons";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("aamarpay");
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || "",
        city: prev.city || user.city || "",
        postalCode: prev.postalCode || user.postalCode || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid 11-digit BD phone number";
    if (!form.address.trim()) errs.address = "Street address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.postalCode.trim()) errs.postalCode = "Postal code is required";
    return errs;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }

    setPlacing(true);
    setApiError("");

    try {
      const res = await placeOrderApi({
        userId: user._id,
        paymentMethod: paymentMethod,
        shippingAddress: form,
        cus_name: form.fullName.trim(),
        cus_email: user.email,
        cus_phone: form.phone.trim(),
        cus_add1: form.address.trim(),
        cus_city: form.city.trim(),
        cus_postcode: form.postalCode.trim(),
      });

      if (res.paymentMethod === "cod") {
        clearCart();
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        navigate(
          res.redirectUrl ||
            `/order-success?orderId=${res.orderId}&tranId=${res.tranId}`
        );
      } else if (res.paymentUrl) {
        // Redirect browser to AamarPay Payment Gateway
        window.location.href = res.paymentUrl;
      } else {
        throw new Error(
          res.message || "Could not retrieve payment gateway link."
        );
      }
    } catch (err) {
      console.error("Order placement error:", err);
      setApiError(
        err.response?.data?.message ||
          err.message ||
          "Failed to place order. Please try again."
      );
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber mx-auto mb-6 shadow-sm">
          <ShoppingCart size={36} />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Your Cart is Empty
        </h1>
        <p className="text-slate text-sm sm:text-base mt-2">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber to-amber-hover text-ink font-bold text-sm shadow-md"
        >
          Explore Catalog <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Header with Progress Stepper */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
            Secure Order Finalization
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mt-0.5">
            Express Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate mt-1">
            Complete your shipping address and choose your preferred payment method.
          </p>
        </div>

        {/* Stepper visualization */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-ink text-paper text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span className="text-xs font-bold text-ink hidden sm:inline">Shipping</span>
          </div>
          <span className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-amber text-ink text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="text-xs font-bold text-ink hidden sm:inline">Payment</span>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 font-semibold rounded-2xl border border-red-200 text-sm">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
      >
        <div className="lg:col-span-2 flex flex-col gap-8">
          <AddressForm form={form} errors={errors} onChange={handleChange} />
          <PaymentMethodSelector
            selected={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        <div className="lg:sticky lg:top-24">
          <OrderSummary items={items} subtotal={subtotal}>
            <Button
              type="submit"
              variant="accent"
              loading={placing}
              className="w-full py-4 text-sm font-bold rounded-2xl shadow-lg shadow-amber/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              {paymentMethod === "cod" ? (
                <>
                  <Lock size={15} /> Confirm Cash on Delivery
                </>
              ) : (
                <>
                  <Lock size={15} /> Pay with AamarPay Gateway
                </>
              )}
            </Button>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}