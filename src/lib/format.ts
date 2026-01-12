// src/lib/format.ts
// 数値フォーマット用のユーティリティ関数

/**
 * 円を万円単位に変換してカンマ区切りで表示
 * @param yen 円単位の金額
 * @returns "3,400万円" のような文字列
 */
export function formatBudget(yen: number | null | undefined): string {
  if (!yen) return "-";
  const manYen = Math.round(yen / 10000);
  return `${manYen.toLocaleString("ja-JP")}万円`;
}

/**
 * 数値を3桁カンマ区切りで表示
 * @param num 数値
 * @returns "1,234" のような文字列
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "-";
  return num.toLocaleString("ja-JP");
}

/**
 * 面積を表示（小数点1桁）
 * @param area 面積（平方メートル）
 * @returns "120.5㎡" のような文字列
 */
export function formatArea(area: number | null | undefined): string {
  if (!area) return "-";
  return `${area.toFixed(1)}㎡`;
}
