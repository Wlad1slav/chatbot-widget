import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "ChatbotWidget",           // ▸ global ім’я в IIFE
      formats: ["iife", "es"],         // iife = <script>, es = import
      fileName: (fmt) => `chatbot-widget.${fmt}.js`,
    },
    rollupOptions: {
      // React та ReactDOM залишаємо «зовні», щоб не товстити бандл
      external: ["react", "react-dom"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM" },
      },
    },
    cssCodeSplit: true,                // винесе CSS окремим файлом
    minify: "esbuild",
  },
})
