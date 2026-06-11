export const palette = {
  bg: "#FAFAF8",
  bgSubtle: "#F1F1ED",
  bgInset: "#E8E8E2",
  ink: "#1B1B1B",
  inkMuted: "#5A5A57",
  inkSoft: "#8A8A85",
  line: "#D9D9D2",
  lineStrong: "#B4B4AC",
  accent: "#6FB8DC",
  accentStrong: "#3E96BE",
  accentSoft: "#D6ECF7",
  danger: "#B23A48",
  ok: "#3F7D58",
} as const;

export const spacing = {
  px: "1px",
  0.5: "2px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  full: "9999px",
} as const;

export const typography = {
  heading: { size: "1.5rem", weight: 600, lineHeight: 1.3 },
  subheading: { size: "1.125rem", weight: 600, lineHeight: 1.4 },
  body: { size: "0.9375rem", weight: 400, lineHeight: 1.55 },
  caption: { size: "0.8125rem", weight: 500, lineHeight: 1.4 },
} as const;

export const minTouchTarget = "44px";

export type Palette = typeof palette;
export type Radius = typeof radius;
export type Typography = typeof typography;
