import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        astloch: ['Astloch', 'sans-serif'],  // Add the Astloch font
        robotoSerif: ['Roboto Serif', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ],
};
export default config;
