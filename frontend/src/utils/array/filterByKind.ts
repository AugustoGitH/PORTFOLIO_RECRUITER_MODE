/**
 * Filters a flat list by a tab/`kind` value.
 *
 * Used by the tab sections whose tabs behave as filters: pass the active tab's
 * value and, when the domain has an "all" tab, its sentinel value — selecting it
 * returns every item. Domains that are a true partition (no "all" tab) simply
 * omit `allKind` and always filter by the exact kind.
 */
export const filterByKind = <T extends { kind: number }>(
  items: T[],
  kind: number,
  allKind?: number,
): T[] => (kind === allKind ? items : items.filter((item) => item.kind === kind))
