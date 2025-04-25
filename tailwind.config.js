/** @type {import('tailwindcss').Config} */

const { fontFamily } = require('tailwindcss/defaultTheme')


module.exports = {
    plugins: [ 
    ],
    content: [
      // Or if using `src` directory:
      "./src/**/*.{ts,jsx,js,tsx,mdx}",
    ],
    darkMode:'class',
    theme: {
      extend: {
          boxShadow: {
            'top-only': '0 -10px 10px rgba(0, 0, 0, 0.1)', // ظل خفيف من أعلى
            'yellow-shadow': '0px 4px 4px 0px #FEBA12',
          },
          fontFamily: {
            mont: ['var(--font-mont)'],
          },
          // translate: {
          //   '-50': '-50px',
          // },
          
          //shadcn 
          colors:{
            dark: "#1b1b1b",
            light: "#f5f5f5",
            primary: "#B63E96", // 240,86,199
            primaryDark: "#58E6D9", // 80,230,217
          },
          animation:{
            'spin-slow': 'spin 8s linear infinite',
          },
          backgroundImage:{
            circularLight:
            "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 100px)",

        circularDark:
            "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 8px,#1b1b1b 100px)",

        circularLightLg:
            "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 80px)",

        circularDarkLg:
            "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 8px,#1b1b1b 80px)",

        circularLightMd:
            "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 60px)",

        circularDarkMd:
            "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 6px,#1b1b1b 60px)",

        circularLightSm:
            "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 40px)",

        circularDarkSm:
            "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 4px,#1b1b1b 40px)",

        ourGradient: "linear-gradient(90deg, #FEBA12 0%, #4A82C3 20%, #BBBBBB 80%);",

          }
        },
      
        // screens: {
        //   "2xl": { max: "1535px" },
        //   // => @media (max-width: 1535px) { ... }
      
        //   xl: { max: "1279px" },
        //   // => @media (max-width: 1279px) { ... }
      
        //   lg: { max: "1023px" },
        //   // => @media (max-width: 1023px) { ... }
      
        //   md: { max: "767px" },
        //   // => @media (max-width: 767px) { ... }
      
        //   sm: { max: "639px" },
        //   // => @media (max-width: 639px) { ... }
      
        //   xs: { max: "479px" },
        //   // => @media (max-width: 479px) { ... }
        // },

      },
  }



