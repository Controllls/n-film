import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#FAFAF8",
          subtle: "#F1F1ED",
          inset: "#E8E8E2",
        },
        ink: {
          DEFAULT: "#1B1B1B",
          muted: "#5A5A57",
          soft: "#8A8A85",
          inverse: "#FAFAF8",
        },
        line: {
          DEFAULT: "#D9D9D2",
          strong: "#B4B4AC",
        },
        accent: {
          DEFAULT: "#6FB8DC",
          strong: "#3E96BE",
          soft: "#D6ECF7",
        },
        danger: {
          DEFAULT: "#B23A48",
          soft: "#F4D9DC",
        },
        ok: {
          DEFAULT: "#3F7D58",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Pretendard Variable'",
          "Pretendard",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 20, 20, 0.04), 0 1px 1px rgba(20, 20, 20, 0.03)",
        focus: "0 0 0 3px rgba(111, 184, 220, 0.35)",
      },
      spacing: {
        "4.5": "1.125rem",
      },
    },
  },
  plugins: [],
};

export default config;
