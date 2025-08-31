import { writeFileSync } from 'fs';

if (process.env.GOOGLE_SERVICES_JSON) {
  writeFileSync('./google-services.json', process.env.GOOGLE_SERVICES_JSON, 'utf8');
  console.log('Wrote google-services.json');
} else {
  console.warn('GOOGLE_SERVICES_JSON env var is not set');
}