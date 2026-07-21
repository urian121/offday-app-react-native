// quiet evita que dotenv imprima logs/tips en stdout, que de otro modo
// contaminan la salida JSON que expo-doctor espera al validar dependencias.
require("dotenv").config({ quiet: true });

module.exports = {
  expo: {
    name: "FestiDías",
    slug: "offday",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.developerurian.offday",
    },
    android: {
      package: "com.developerurian.offday",
      adaptiveIcon: {
        backgroundColor: "#E9C980",
        foregroundImage: "./assets/icon.png",
      },
      predictiveBackGestureEnabled: false,
    },
    androidStatusBar: {
      translucent: true,
      backgroundColor: "#00000000",
      barStyle: "dark-content",
    },
    androidNavigationBar: {
      backgroundColor: "#FAEBD0",
      barStyle: "dark-content",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-localization",
      "expo-status-bar",
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          organization: "dev-5q",
          project: "react-native",
        },
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#E9C980",
          image: "./assets/splash-icon.png",
          imageWidth: 180,
          resizeMode: "contain",
        },
      ],
      [
        "expo-build-properties",
        {
          // x86/x86_64 solo son para emuladores; se excluyen para reducir
          // el tamaño del APK/AAB en dispositivos físicos reales.
          android: {
            buildArchs: ["armeabi-v7a", "arm64-v8a"],
            // Permite llamar al backend local por HTTP durante desarrollo.
            usesCleartextTraffic: true,
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "df39925d-ccb0-4162-85a1-66397db65640",
      },
      // Se embebe en el binario durante el build (EAS local/cloud).
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "",
    },
  },
};
