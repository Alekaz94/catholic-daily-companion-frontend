import 'dotenv/config';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { Buffer } from 'buffer';
import path from 'path';

export default ({ config }) => {
  const androidAppDir = path.resolve(__dirname, 'android/app');
  console.log('GOOGLE_SERVICES_JSON_BASE64:', !!process.env.GOOGLE_SERVICES_JSON_BASE64);
  
  try {
    if (process.env.GOOGLE_SERVICES_JSON_BASE64) {
      if (!existsSync(androidAppDir)) {
        console.warn(`[WARN] android/app does not exist yet, skipping writing google-services.json`);
      } else {
        const decoded = Buffer.from(process.env.GOOGLE_SERVICES_JSON_BASE64, 'base64').toString('utf8');
        const outputPath = path.join(androidAppDir, 'google-services.json');
        writeFileSync(outputPath, decoded, { encoding: 'utf8' });
        console.log('✅ Wrote google-services.json from base64');
      }
    } else {
      console.warn('⚠️ GOOGLE_SERVICES_JSON_BASE64 env var is not set');
    }
  } catch (e) {
    console.error('❌ Failed to write google-services.json:', e);
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
        googleServicesFile: './android/app/google-services.json',
      },
      web: {
        favicon: "./assets/favicon.png",
      },
      plugins: [
        "expo-secure-store",
        '@react-native-google-signin/google-signin',
      ],
      extra: {
        API_BASE_URL: process.env.API_BASE_URL,
        GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID,
        GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
        GOOGLE_ANDROID_DEBUG_CLIENT_ID: process.env.GOOGLE_ANDROID_DEBUG_CLIENT_ID,
        GOOGLE_ANDROID_GRADLE_SIGNIN_CLIENT_ID: process.env.GOOGLE_ANDROID_GRADLE_SIGNIN_CLIENT_ID,
        GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
        GOOGLE_SERVICES_JSON_BASE64: process.env.GOOGLE_SERVICES_JSON_BASE64,
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