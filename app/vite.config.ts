import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    server: {
      port: 4006,
      strictPort: true,
      https: { // faceit requires https as redirect uri
        key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.pem')),
      },
    },
  }
})
