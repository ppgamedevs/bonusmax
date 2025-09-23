'use client';
const KEY = 'bmx_compare_ids';
export function getCompareIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}
export function setCompareIds(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids)).slice(0, 4)));
}
export function toggleCompare(id: string) {
  const ids = getCompareIds();
  const ix = ids.indexOf(id);
  if (ix >= 0) ids.splice(ix, 1);
  else ids.push(id);
  setCompareIds(ids);
  return ids;
}
