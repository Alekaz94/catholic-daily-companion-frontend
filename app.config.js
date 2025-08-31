import 'dotenv/config';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

export default ({ config }) => {
  if (process.env.GOOGLE_SERVICES_JSON) {
    const androidAppDir = './android/app';

    if (!existsSync(androidAppDir)) {
      mkdirSync(androidAppDir, { recursive: true });
    }

    writeFileSync(
      `${androidAppDir}/google-services.json`,
      process.env.GOOGLE_SERVICES_JSON,
      { encoding: 'utf8' }
    );
    console.log('Wrote google-services.json from env');
  } else {
    console.warn('GOOGLE_SERVICES_JSON env var is not set');
  }

  return {
    ...config,
    expo: {
      name: "catholic-daily-companion",
      slug: "catholic-daily-companion",
      scheme: "catholic-daily-companion",
      version: "1.0.0",
      orientation: "portrait",
      icon: "",
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
        package: "com.alexandros.catholicdailycompanion",
        googleServicesFile: './android/app/google-services.json',
      },
      web: {
        favicon: "./assets/favicon.png",
      },
      plugins: ["expo-secure-store"],

      extra: {
        API_BASE_URL: process.env.API_BASE_URL,
        GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID,
        GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
        GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
        FIREBASE_MEASURMENT_ID: process.env.FIREBASE_MEASURMENT_ID,
        eas: {
          projectId: "73e5ba86-8f70-4d0d-b33c-8bd4c8691ddc"
        }
      },
    },
  };
};