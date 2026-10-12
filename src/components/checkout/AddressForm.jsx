import InputField from "../common/InputField";
import { MapPin, Phone, User } from "../common/Icons";

export default function AddressForm({ form, errors, onChange }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
          Step 1 of 2
        </span>
        <h2 className="font-display text-xl font-bold text-ink mt-0.5">
          Delivery & Shipping Address
        </h2>
        <p className="text-xs text-slate mt-1">
          Where should we deliver your order? All details are kept confidential.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
        <InputField
          label="Full Name"
          name="fullName"
          icon={User}
          value={form.fullName}
          onChange={onChange}
          error={errors.fullName}
          placeholder="e.g. Tanvir Ahmed"
        />
        <InputField
          label="Mobile Phone Number"
          name="phone"
          icon={Phone}
          value={form.phone}
          onChange={onChange}
          error={errors.phone}
          placeholder="01XXXXXXXXX"
        />

        <div className="sm:col-span-2">
          <InputField
            label="Street Address / House & Road"
            name="address"
            icon={MapPin}
            value={form.address}
            onChange={onChange}
            error={errors.address}
            placeholder="House #12, Road #4, Sector #3, Uttara"
          />
        </div>

        <InputField
          label="City / District"
          name="city"
          value={form.city}
          onChange={onChange}
          error={errors.city}
          placeholder="Dhaka"
        />
        <InputField
          label="Postal / Zip Code"
          name="postalCode"
          value={form.postalCode}
          onChange={onChange}
          error={errors.postalCode}
          placeholder="1230"
        />
      </div>

      <div className="mt-5">
        <label className="text-xs font-semibold text-ink block mb-2">
          Delivery Instructions / Landmarks (Optional)
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={onChange}
          rows={2}
          placeholder="Nearby landmark, gate code, or specific drop-off instructions..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-ink placeholder:text-slate/40
            focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all resize-none shadow-inner"
        />
      </div>
    </div>
  );
}