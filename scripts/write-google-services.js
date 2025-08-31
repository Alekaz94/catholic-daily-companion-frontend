import { writeFileSync } from 'fs';

if (process.env.GOOGLE_SERVICES_JSON) {
  writeFileSync(
    './android/app/google-services.json',
    process.env.GOOGLE_SERVICES_JSON,
    { encoding: 'utf8' }
  );
  console.log('Wrote google-services.json');
} else {
  console.warn('GOOGLE_SERVICES_JSON env var is not set');
}