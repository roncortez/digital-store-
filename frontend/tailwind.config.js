/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color principal - Amarillo dorado
        primary: '#E6B31E',
        
        // Paleta de marca (MANTENER TODO)
        brand: {
          yellow: '#ffaa17', // User provided yellow/orange
          dark: '#222429',   // User provided dark gray
          light: '#FCFAF1',
          gray: '#CACACA',
        },
        
        // Colores adicionales semánticos (NUEVOS)
        accent: '#475569',      // Gris oscuro para enlaces/iconos
        success: '#10B981',     // Verde para éxito
        danger: '#EF4444',      // Rojo para errores/eliminar
        warning: '#F59E0B',     // Naranja para advertencias
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Sora"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-delay-1': 'fadeIn 0.5s ease-in-out 0.2s both',
        'fade-in-delay-2': 'fadeIn 0.5s ease-in-out 0.4s both',
        'fade-in-delay-3': 'fadeIn 0.5s ease-in-out 0.6s both',
        'fade-in-delay-4': 'fadeIn 0.5s ease-in-out 0.8s both',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

