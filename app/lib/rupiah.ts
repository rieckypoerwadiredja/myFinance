/**
 * Currency formatting helpers (Indonesian Rupiah).
 *
 * Notes:
 * - formatRupiah: full format like Rp6.586.400
 * - formatSignedRupiah: +/- prefix for deltas
 * - formatJutaCompact: short label for charts (rb/jt/m) without "Rp" to keep it small
 */
export function formatRupiah(value: number) {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(abs);
  return `Rp${formatted}`;
}

export function formatSignedRupiah(value: number) {
  if (value === 0) return formatRupiah(0);
  return `${value > 0 ? "+" : "-"}${formatRupiah(value)}`;
}

export function formatRupiahCompact(value: number) {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(abs)
    .replace(/\s/g, "");
  return `Rp${formatted}`;
}

export function formatJutaCompact(value: number) {
  const abs = Math.abs(value);
  if (abs === 0) return "";

  if (abs >= 1_000_000_000) {
    const n = Math.round((abs / 1_000_000_000) * 10) / 10;
    return `${String(n).replace(".", ",")}m`;
  }

  if (abs >= 1_000_000) {
    const n = Math.round((abs / 1_000_000) * 10) / 10;
    return `${String(n).replace(".", ",")}jt`;
  }

  if (abs >= 1_000) {
    const n = Math.round((abs / 1_000) * 10) / 10;
    return `${String(n).replace(".", ",")}rb`;
  }

  return String(abs);
}
