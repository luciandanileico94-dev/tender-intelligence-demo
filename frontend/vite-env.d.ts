/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_MODE?: 'static' | 'local';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
