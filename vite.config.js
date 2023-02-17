import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    base: process.env.VITE_BASENAME,
    server: {
      port: parseInt(process.env.VITE_PORT),
    },
    preview: {
      port: parseInt(process.env.VITE_PORT),
    },
  });
}
