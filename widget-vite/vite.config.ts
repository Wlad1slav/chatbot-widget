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
    // rollupOptions: {
    //   external: ["react", "react-dom", "react-dom/client"],
    //   output: {
    //     globals: {
    //       react: "React",
    //       "react-dom": "ReactDOM",
    //       "react-dom/client": "ReactDOM",
    //     },
    //   },
    // },
    cssCodeSplit: true,                // винесе CSS окремим файлом
    minify: "esbuild",
  },
  define: {
    // костиль проти використання пакетами зміних оточення
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
    "process": JSON.stringify({ env: { NODE_ENV: "production" } })
  }
})
