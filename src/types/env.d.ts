/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_PRIMARY_COLOR: string
  readonly VITE_PRIMARY_COLOR_DARK: string
  readonly VITE_SECONDARY_COLOR: string
  readonly VITE_SECONDARY_COLOR_DARK: string
  readonly VITE_APP_LOGO: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 