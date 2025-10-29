import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,     // puerto donde corre el frontend
    open: true,     // abre automáticamente el navegador
    host: 'localhost' // asegura que sea accesible desde tu máquina
  }
})
