import { fontFamily } from "tailwindcss/defaultTheme";

import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        purple: "#863487",
        cornflowerblue: "#6495ED",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        star: "hsl(var(--star))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        q: {
          DEFAULT: "hsl(var(--q))",
          foreground: "hsl(var(--q-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderWidth: {
        1: "1px",
      },
      borderColor: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        xs: "500px",
      },
    },
    fontFamily: {
      sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      mono: ["var(--font-geist-mono)", ...fontFamily.sans],
      inter: ["var(--font-inter)", ...fontFamily.sans],
      poppins: ["var(--font-poppins)", ...fontFamily.sans],
      overpass: ["var(--font-overpass)", ...fontFamily.sans],
      nss: ["Northern Soul Script", ...fontFamily.sans],
      nsc: ["Northern Soul Caps", ...fontFamily.sans],
      g: ["Gibson", ...fontFamily.sans],
      gbold: ["Gibson Bold", ...fontFamily.sans],
      gbolditalic: ["Gibson Bold Italic", ...fontFamily.sans],
      gbook: ["Gibson Book", ...fontFamily.sans],
      gbookitalic: ["Gibson Book Italic", ...fontFamily.sans],
      gheavy: ["Gibson Heavy", ...fontFamily.sans],
      gheavyitalic: ["Gibson Heavy Italic", ...fontFamily.sans],
      gitalic: ["Gibson Italic", ...fontFamily.sans],
      glight: ["Gibson Light", ...fontFamily.sans],
      glightitalic: ["Gibson Light Italic", ...fontFamily.sans],
      gmedium: ["Gibson Medium", ...fontFamily.sans],
      gmediumitalic: ["Gibson Medium Italic", ...fontFamily.sans],
      gsemibold: ["Gibson SemiBold", ...fontFamily.sans],
      gsemibolditalic: ["Gibson SemiBold Italic", ...fontFamily.sans],
      gthin: ["Gibson Thin", ...fontFamily.sans],
      gthinitalic: ["Gibson ThinItalic", ...fontFamily.sans],
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
