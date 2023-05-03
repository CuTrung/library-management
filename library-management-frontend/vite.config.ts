import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // base: process.env.VITE_BASENAME,
    server: {
        port: 3000,
    },
    // preview: {
    //     port: +process.env.VITE_PORT,
    // },
});
