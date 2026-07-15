module.exports = {
  expo: {
    name: "OffDay",
    slug: "offday",
    version: "1.0.0",
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
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-localization",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#E9C980",
          image: "./assets/splash-icon.png",
          imageWidth: 180,
          resizeMode: "contain",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "df39925d-ccb0-4162-85a1-66397db65640",
      },
    },
  },
};
