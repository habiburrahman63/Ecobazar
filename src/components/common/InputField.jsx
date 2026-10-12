import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
    label,
    type = "text",
    name,
    value,
    onChange,
    error,
    placeholder,
    icon: Icon,
    ...rest
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-sm font-medium text-ink">
                {label}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        size={17}
                        strokeWidth={2}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50 pointer-events-none"
                    />
                )}

                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full py-2.5 rounded-lg border bg-white text-ink placeholder:text-slate/40 text-sm
            ${Icon ? "pl-10" : "pl-3.5"} ${isPassword ? "pr-10" : "pr-3.5"}
            focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber
            transition-all duration-150
            ${error ? "border-red-400" : "border-ink/15 hover:border-ink/25"}`}
                    {...rest}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate/50 hover:text-ink transition-colors"
                    >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                )}
            </div>

            {error && (
                <span className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                    {error}
                </span>
            )}
        </div>
    );
};