import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    expo: {
      name: "catholic-daily-companion",
      slug: "catholic-daily-companion",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/default_saint.png",
      userInterfaceStyle: "light",
      newArchEnabled: true,
      splash: {
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
      },
      web: {
        favicon: "./assets/favicon.png",
      },
      plugins: ["expo-secure-store"],

      extra: {
        API_BASE_URL: process.env.API_BASE_URL
      },
    },
  };
};