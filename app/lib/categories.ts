/**
 * Category configuration:
 * - Canonical category list used by dropdowns
 * - Shared color mapping for badges/bars
 *
 * If the sheet contains an unknown category, UI usually falls back to "Lainnya".
 */
export type CategoryName = "Donasi" | "Date" | "Main" | "Kerja" | "Lainnya";

export const CATEGORY_OPTIONS: CategoryName[] = [
  "Donasi",
  "Date",
  "Main",
  "Kerja",
  "Lainnya",
];

export function getCategoryBadgeClassName(category: string) {
  switch (category) {
    case "Donasi":
      return "bg-sky-200 text-sky-800";
    case "Date":
      return "bg-pink-200 text-pink-800";
    case "Main":
      return "bg-green-200 text-green-800";
    case "Kerja":
      return "bg-neutral-200 text-neutral-800";
    case "Lainnya":
      return "bg-neutral-800 text-white";
    default:
      return "bg-surface-container-high text-on-surface";
  }
}

export function getCategoryBarClassName(category: string) {
  switch (category) {
    case "Donasi":
      return "bg-sky-400";
    case "Date":
      return "bg-pink-400";
    case "Main":
      return "bg-green-400";
    case "Kerja":
      return "bg-neutral-400";
    case "Lainnya":
      return "bg-neutral-800";
    default:
      return "bg-outline-variant";
  }
}
