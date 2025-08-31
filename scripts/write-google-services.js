const { writeFileSync } = require('fs');
const { resolve } = require('path');

const filePath = resolve(__dirname, '../android/app/google-services.json');

if (process.env.EAS_BUILD && process.env.GOOGLE_SERVICES_JSON) {
  writeFileSync(filePath, process.env.GOOGLE_SERVICES_JSON, 'utf8');
  console.log('✅ google-services.json written');
} else {
  console.log('Skipping google-services.json write (not in EAS build or no env var)');
}