import { memo } from "react";
import { Link } from "react-router";
import * as Icons from "../common/Icons";

// Helper to safely resolve icon component
function resolveIcon(iconName) {
  if (typeof iconName === "function") return iconName;
  if (typeof iconName === "string" && Icons[iconName]) {
    return Icons[iconName];
  }
  return Icons.Package;
}

function CategoryGrid({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
      {categories.map((cat) => {
        const IconComponent = resolveIcon(cat.icon);
        const subCount = cat.subcategories?.length || 0;
        return (
          <Link
            key={cat._id || cat.name}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative flex flex-col items-center text-center gap-3 bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-amber hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Subtle corner light highlight on hover */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-full blur-xl group-hover:bg-amber/15 transition-all duration-300 -mr-6 -mt-6 pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber/15 to-amber/5 border border-amber/20 flex items-center justify-center group-hover:bg-amber group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              <IconComponent
                size={24}
                className="text-amber group-hover:text-ink transition-colors"
              />
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-ink group-hover:text-amber transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate/70 mt-0.5">
                {subCount > 0 ? `${subCount} Collections` : "Explore Catalog"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default memo(CategoryGrid);