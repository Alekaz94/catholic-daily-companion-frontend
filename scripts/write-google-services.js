const { writeFileSync } = require('fs');
const { resolve } = require('path');

const filePath = resolve(__dirname, '../android/app/google-services.json');

const rawJson = process.env.GOOGLE_SERVICES_JSON;

if (process.env.EAS_BUILD && rawJson) {
  try {
    const parsed = JSON.parse(rawJson);
    writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
    console.log('✅ google-services.json written from env');
  } catch (err) {
    console.error('❌ Failed to write google-services.json:', err.message);
    process.exit(1);
  }
} else {
  console.log('⚠️ Skipping google-services.json write (not in EAS build or no env var)');
}