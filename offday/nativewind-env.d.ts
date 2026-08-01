/// <reference types="nativewind/types" />

declare module "*.css";

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_NAGER_V4_URL?: string;
    EXPO_PUBLIC_NAGER_V3_URL?: string;
    EXPO_PUBLIC_NAGER_COUNTRIES_URL?: string;
  }
}
