import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores principal - Celeste, Azul y Blanco
        primary: {
          50: '#f0f9ff',   // Blanco con tinte celeste muy suave
          100: '#e0f2fe',  // Celeste muy claro
          200: '#bae6fd',  // Celeste claro
          300: '#7dd3fc',  // Celeste medio
          400: '#38bdf8',  // Celeste
          500: '#0ea5e9',  // Celeste intenso
          600: '#0284c7',  // Azul celeste
          700: '#0369a1',  // Azul medio
          800: '#075985',  // Azul oscuro
          900: '#0c4a6e',  // Azul muy oscuro
          950: '#082f49',  // Azul casi negro
        },
        // Colores específicos para tu paleta
        celeste: {
          light: '#87CEEB',  // Sky blue
          DEFAULT: '#00BFFF', // Deep sky blue
          dark: '#1E90FF',   // Dodger blue
        },
        azul: {
          light: '#4169E1',  // Royal blue
          DEFAULT: '#0000FF', // Pure blue
          dark: '#00008B',   // Dark blue
        },
        // Mantener algunos colores del sistema
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;