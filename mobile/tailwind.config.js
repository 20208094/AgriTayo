module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/screens/**/*.{js,jsx,ts,tsx}",
    "./app/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '50': '200px', 
      },
      padding: {
        '3.5': '14px', 
      },
    },
  },
  plugins: [],
};
