module.exports = {
    content: [
      './src/**/*.{js,ts,jsx,tsx}',
      // make sure these are included
      './components/**/*.{js,ts,jsx,tsx}',
      './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        // your custom styles here
      },
    },
    plugins: [
      // your plugins like typography, forms, etc.
    ],
  };