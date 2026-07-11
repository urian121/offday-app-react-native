/// <reference types="nativewind/types" />

declare module "*.css";

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_OPENAI_API_KEY?: string;
    EXPO_PUBLIC_OPENAI_MODEL?: string;
  }
}