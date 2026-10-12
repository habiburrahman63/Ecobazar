import { useEffect, useState } from "react";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { User, Mail, Phone, MapPin } from "../../components/common/Icons";
import { useAuth } from "../../context/AuthContext";
import { fetchUserById, updateUser } from "../../api/userApi";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    createdAt: user?.createdAt || null,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (user?._id) {
        try {
          const freshData = await fetchUserById(user._id);
          if (freshData) {
            setForm({
              name: freshData.name || "",
              email: freshData.email || "",
              phone: freshData.phone || "",
              address: freshData.address || "",
              city: freshData.city || "",
              postalCode: freshData.postalCode || "",
              createdAt: freshData.createdAt || null,
            });
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      }
    }
    loadData();
  }, [user?._id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSaved(false);
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setSaving(true);
    setApiError("");
    setSaved(false);

    try {
      const updated = await updateUser(user._id, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
      });

      updateUserProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setApiError(
        err.response?.data?.message || err.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const initials =
    (form.name || user?.name || "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center font-display text-xl font-semibold shrink-0 shadow-sm">
          {initials}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {form.name || user?.name}
          </h1>
          <p className="text-sm text-slate">
            Member since{" "}
            {form.createdAt
              ? new Date(form.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "2026"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-ink/10 p-5 sm:p-6 shadow-sm"
      >
        <h2 className="font-display text-lg font-semibold text-ink mb-5">
          Personal Information
        </h2>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Full name"
            name="name"
            icon={User}
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            value={form.email}
            disabled={true}
            placeholder="you@example.com"
          />
          <InputField
            label="Phone Number"
            name="phone"
            icon={Phone}
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="01700000000"
          />
          <InputField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Dhaka"
          />
          <div className="sm:col-span-2">
            <InputField
              label="Street Address"
              name="address"
              icon={MapPin}
              value={form.address}
              onChange={handleChange}
              placeholder="House, Road, Area"
            />
          </div>
          <InputField
            label="Postal Code"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            placeholder="1200"
          />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <Button type="submit" loading={saving} className="w-auto px-6">
            Save Changes
          </Button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">
              Profile updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
