import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * BoardroomAI Design System — Tailwind tokens.
 *
 * The system is engineered minimalism: a near-white canvas (#fafafa) with
 * ink-near-black type (#171717), one geometric sans at three weights, and
 * a single decorative gesture — the hero mesh gradient. Colour is close to
 * absent outside the one brand blue (#0070f3) used for links, live/AI
 * indicators and the event badge.
 *
 * Two radius scales coexist deliberately and must not be conflated: 6px for
 * nav buttons, in-page action buttons and cards; 9999px (`rounded-full`) for
 * marketing CTAs and badge pills. Elevation is a stacked compound shadow
 * (hairline inset ring + micro drop), never a single heavy drop.
 *
 * All colours resolve to CSS variables in `app/globals.css` as HSL triplets,
 * so the light default and the derived dark variant swap without touching a
 * single component.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./layouts/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "1.5rem",
        xl: "1.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1200px",
      },
    },
    extend: {
      screens: {
        // The system's own breakpoints: mobile < 600, tablet 600–959,
        // desktop 960–1199, wide ≥ 1200.
        mobile: "600px",
        tablet: "960px",
        wide: "1200px",
      },
      colors: {
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
          overlay: "hsl(var(--surface-overlay))",
        },
        primary: {
          DEFAULT: "hsl(var(--brass))",
          foreground: "hsl(var(--brass-foreground))",
          muted: "hsl(var(--brass-muted))",
        },
        signal: {
          DEFAULT: "hsl(var(--signal))",
          foreground: "hsl(var(--signal-foreground))",
          muted: "hsl(var(--signal-muted))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          // The lighter of the two muted text tones — fine print, meta
          // labels, placeholders.
          soft: "hsl(var(--muted-foreground-soft))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface-overlay))",
          foreground: "hsl(var(--foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        // One face across the whole product — there is no separate display
        // family, by design. `display` is retained as an alias so any future
        // headline call site resolves to the same geometric sans instead of
        // silently falling back to the browser default.
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Measured type scale. Negative tracking is part of the voice and
        // grows with size; body sits at neutral or a hair negative, and
        // positive tracking never appears.
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "-0.02em" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.03em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.04em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.04em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.045em" }],
        "5xl": ["3rem", { lineHeight: "3rem", letterSpacing: "-0.0475em" }],
        "6xl": ["3.75rem", { lineHeight: "3.75rem", letterSpacing: "-0.05em" }],
        "7xl": ["4.5rem", { lineHeight: "4.5rem", letterSpacing: "-0.05em" }],
      },
      borderRadius: {
        // 6px is the measured button and card radius; the larger steps are
        // reserved for container chrome that hosts an image or illustration
        // cap. Marketing CTAs and badges use `rounded-full` instead.
        xs: "4px",
        sm: "4px",
        md: "6px",
        lg: "6px",
        xl: "8px",
        "2xl": "12px",
        "3xl": "16px",
      },
      spacing: {
        // 4px base scale plus the "air" steps used for section rhythm on
        // long pages — the system runs tight inside cards and breathes
        // between sections.
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        // The stacked compound shadow: a hairline inset ring plus a micro
        // drop. Every level is a variation on that formula — a single heavy
        // drop-shadow is never correct here.
        xs: "hsl(var(--shadow-color) / 0.08) 0 0 0 1px",
        sm: "hsl(var(--shadow-color) / 0.08) 0 0 0 1px, hsl(var(--shadow-color) / 0.04) 0 2px 2px 0",
        md: "hsl(var(--shadow-color) / 0.08) 0 0 0 1px, hsl(var(--shadow-color) / 0.06) 0 4px 8px -2px",
        lg: "hsl(var(--shadow-color) / 0.08) 0 0 0 1px, hsl(var(--shadow-color) / 0.08) 0 8px 16px -4px",
        xl: "hsl(var(--shadow-color) / 0.08) 0 0 0 1px, hsl(var(--shadow-color) / 0.12) 0 16px 32px -8px, hsl(var(--shadow-color) / 0.06) 0 4px 8px -4px",
        "inner-hairline": "inset 0 1px 0 0 hsl(var(--foreground) / 0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle at center, var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "80%,100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "spin-slow": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "gradient-move": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.2,0.6,0.4,1) infinite",
        "spin-slow": "spin-slow 6s linear infinite",
        "gradient-move": "gradient-move 8s ease infinite",
      },
      transitionTimingFunction: {
        emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
