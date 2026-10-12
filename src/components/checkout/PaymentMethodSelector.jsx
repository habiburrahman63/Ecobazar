import { CreditCard, Check, ShieldCheck, Zap } from "../common/Icons";

const methods = [
  {
    id: "aamarpay",
    label: "AamarPay Instant Online Payment",
    desc: "Pay securely via bKash, Nagad, Rocket, Visa, Mastercard & Internet Banking",
    icon: ShieldCheck,
    badges: ["bKash", "Nagad", "Rocket", "Visa", "Mastercard"],
  },
  {
    id: "cod",
    label: "Cash on Delivery (COD)",
    desc: "Inspect and pay cash directly to the delivery courier upon arrival",
    icon: CreditCard,
    badges: ["Pay on Delivery"],
  },
];

export default function PaymentMethodSelector({ selected, onChange }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
            Step 2 of 2
          </span>
          <h2 className="font-display text-xl font-bold text-ink mt-0.5">
            Select Payment Method
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>SSL Secured</span>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.id;
          return (
            <button
              type="button"
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between text-left p-5 rounded-2xl border-2 transition-all duration-200 gap-4 ${
                isSelected
                  ? "border-amber bg-amber/5 ring-4 ring-amber/15 shadow-sm"
                  : "border-slate-200/80 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-amber text-ink shadow-sm" : "bg-slate-100 text-slate"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-ink">
                      {method.label}
                    </p>
                    {method.id === "aamarpay" && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate mt-1 leading-relaxed">{method.desc}</p>
                  
                  {/* Visual badges */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                    {method.badges.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate border border-slate-200"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 self-end sm:self-center transition-colors ${
                  isSelected ? "border-amber bg-amber text-ink" : "border-slate-300"
                }`}
              >
                {isSelected && <Check size={14} className="stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}