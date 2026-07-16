export const CATEGORIES = ["caifan", "salad"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  caifan: "🍚 Caifan",
  salad: "🥗 Salad",
};

export const CBD_CENTER = { lat: 1.281, lng: 103.8505 };
