import 'dotenv/config';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { Buffer } from 'buffer';

export default ({ config }) => {
  const androidAppDir = './android/app';
  const base64 = process.env.GOOGLE_SERVICES_JSON_BASE64;

  if (base64) {
    if (!existsSync(androidAppDir)) {
      mkdirSync(androidAppDir, { recursive: true });
    }

    const decodedJson = Buffer.from(base64, 'base64').toString('utf8');

    try {
      writeFileSync(`${androidAppDir}/google-services.json`, decodedJson);
      console.log('✅ Wrote google-services.json from base64 env var');
    } catch (e) {
      console.error('❌ Failed to write google-services.json:', e);
    }
  } else {
    console.warn('⚠️ GOOGLE_SERVICES_JSON_BASE64 env var is not set');
  }

  return {
    ...config,
    expo: {
      name: "catholic-daily-companion",
      slug: "catholic-daily-companion",
      scheme: "catholic-daily-companion",
      version: "1.0.0",
      orientation: "portrait",
      platforms: ["ios", "android"],
      icon: "",
      userInterfaceStyle: "light",
      newArchEnabled: true,
      splash: {
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.alexandros.catholicdailycompanion"
      },
      android: {
        adaptiveIcon: {
          backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
        package: "com.alexandros.catholicdailycompanion",
        googleServicesFile: "./android/app/google-services.json"
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
        GOOGLE_SERVICES_JSON_BASE64: base64,
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