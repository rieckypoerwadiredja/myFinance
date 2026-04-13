import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold mb-3 text-on-surface-variant uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full appearance-none bg-surface-container-low border border-outline-variant/15 px-3 py-2 rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary focus:outline-none transition-shadow cursor-pointer",
              {
                "border-error focus:ring-error": error,
                "px-5 py-4 text-base rounded-xl border-0": !label // Fallback for larger selects if no label
              },
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
            size={20}
          />
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };