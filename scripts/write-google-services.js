import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

if (!googleServicesJson) {
  console.warn('GOOGLE_SERVICES_JSON env var is not set');
} else {
  const androidAppPath = path.resolve('./android/app');
  if (!existsSync(androidAppPath)) {
    mkdirSync(androidAppPath, { recursive: true });
  }

  writeFileSync(
    path.resolve(androidAppPath, 'google-services.json'),
    googleServicesJson,
    { encoding: 'utf8' }
  );

  console.log('Wrote google-services.json to android/app/');
}