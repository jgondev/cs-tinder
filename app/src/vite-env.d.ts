/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_SSE_URL: string;
  readonly VITE_API_WS_URL: string;
  readonly VITE_FACEIT_REDIRECT_URI: string;
  readonly VITE_FACEIT_CLIENT_ID: string;
  readonly VITE_TWITCH_REDIRECT_URI: string;
  readonly VITE_TWITCH_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
