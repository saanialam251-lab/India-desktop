import { defineConfig } from "vite"; import react from "@vitejs/plugin-react";
// base "./" makes the built files load correctly inside the Android app as well as on the web.
export default defineConfig({ base: "./", plugins: [react()] });
