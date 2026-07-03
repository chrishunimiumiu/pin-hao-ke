import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F4E5DC",
        blobpink: "#F8E5DC",
        bloblavender: "#EDEBF9",
        blobyellow: "#F7E3B0",
        blobmint: "#E6F0E8",
        hero: "#FFF9F0",
        primary: "#111111",
        coffee: "#111111",
        taupe: "#7A6758",
        muted: "#8A7D73",
        border: "#E8DCD2",
        swim: "#BFD7EA",
        art: "#DFA083",
        fitness: "#A6B77A",
        dance: "#D9A7A0",
        lego: "#F0D85B",
        othercat: "#C7C5EA",
        done: "#ECE8E1",
        ink: "#111111",
      },
      boxShadow: {
        soft: "0 14px 32px rgba(17, 17, 17, 0.08)",
        glow: "0 18px 40px rgba(17, 17, 17, 0.14)",
        float: "0 18px 44px rgba(17, 17, 17, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
