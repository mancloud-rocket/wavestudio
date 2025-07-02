/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'fade-out': { '0%': { opacity: 1 }, '100%': { opacity: 0 } },
        'slide-in-up': { '0%': { transform: 'translateY(60px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        'slide-out-down': { '0%': { transform: 'translateY(0)', opacity: 1 }, '100%': { transform: 'translateY(60px)', opacity: 0 } },
        'slide-in-right': { '0%': { transform: 'translateX(60px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
        'slide-in-left': { '0%': { transform: 'translateX(-60px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
        'zoom-in': { '0%': { transform: 'scale(0.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        'rotate-in': { '0%': { transform: 'rotate(-30deg) scale(0.8)', opacity: 0 }, '100%': { transform: 'rotate(0deg) scale(1)', opacity: 1 } },
        'blur-in': { '0%': { filter: 'blur(12px)', opacity: 0 }, '100%': { filter: 'blur(0)', opacity: 1 } },
        'cinematic-in': { '0%': { opacity: 0, filter: 'blur(16px) grayscale(1) scale(1.1)' }, '100%': { opacity: 1, filter: 'blur(0) grayscale(0) scale(1)' } },
        'cinematic-out': { '0%': { opacity: 1, filter: 'blur(0) grayscale(0) scale(1)' }, '100%': { opacity: 0, filter: 'blur(16px) grayscale(1) scale(1.1)' } },
        'twinkle': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
        'float': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        'float-reverse': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(16px)' } },
        'spin-slow': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'wiggle': { '0%,100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } },
        'progress-bar': { '0%': { width: '0%' }, '100%': { width: '100%' } },
        'comet': { 
          '0%': { 
            transform: 'translateX(-100vw) translateY(0)',
            opacity: 0 
          }, 
          '10%': { 
            opacity: 1 
          },
          '90%': { 
            opacity: 1 
          },
          '100%': { 
            transform: 'translateX(100vw) translateY(-100px)',
            opacity: 0 
          } 
        },
        'bounce-in': { 
          '0%': { 
            transform: 'scale(0.3)',
            opacity: 0 
          }, 
          '50%': { 
            transform: 'scale(1.05)',
            opacity: 0.8 
          },
          '70%': { 
            transform: 'scale(0.9)',
            opacity: 0.9 
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: 1 
          } 
        },
        'orbit': { 
          '0%': { 
            transform: 'rotate(0deg) translateX(20px) rotate(0deg)' 
          }, 
          '100%': { 
            transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' 
          } 
        },
        'pulse-glow': { 
          '0%,100%': { 
            boxShadow: '0 0 20px rgba(171, 35, 238, 0.3)',
            transform: 'scale(1)' 
          }, 
          '50%': { 
            boxShadow: '0 0 40px rgba(171, 35, 238, 0.6)',
            transform: 'scale(1.05)' 
          } 
        },
      },
      animation: {
        'fade-in': 'fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'fade-out': 'fade-out 0.5s cubic-bezier(0.4,0,0.2,1) both',
        'slide-in-up': 'slide-in-up 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'slide-out-down': 'slide-out-down 0.5s cubic-bezier(0.4,0,0.2,1) both',
        'slide-in-right': 'slide-in-right 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'slide-in-left': 'slide-in-left 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'zoom-in': 'zoom-in 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'rotate-in': 'rotate-in 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'blur-in': 'blur-in 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'cinematic-in': 'cinematic-in 1.1s cubic-bezier(0.4,0,0.2,1) both',
        'cinematic-out': 'cinematic-out 0.8s cubic-bezier(0.4,0,0.2,1) both',
        'twinkle': 'twinkle 2.2s infinite ease-in-out',
        'float': 'float 3.2s ease-in-out infinite',
        'float-reverse': 'float-reverse 3.2s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        'wiggle': 'wiggle 1.2s ease-in-out infinite',
        'progress-bar': 'progress-bar 2.2s cubic-bezier(0.4,0,0.2,1) both',
        'comet': 'comet 4s linear infinite',
        'bounce-in': 'bounce-in 1s ease-out',
        'orbit': 'orbit 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

