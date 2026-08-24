/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MINIBASE_SYNC?: "enabled" | "disabled";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
