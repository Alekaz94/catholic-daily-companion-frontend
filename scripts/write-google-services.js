const { writeFileSync } = require('fs');
const { resolve } = require('path');

const filePath = resolve(__dirname, '../android/app/google-services.json');

if (process.env.EAS_BUILD && process.env.GOOGLE_SERVICES_JSON) {
  try {
    const json = JSON.parse(process.env.GOOGLE_SERVICES_JSON);
    writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log('✅ google-services.json written');
  } catch (e) {
    console.error('❌ Failed to write google-services.json:', e);
    process.exit(1);
  }
} else {
  console.log('⚠️ Skipping google-services.json write (not in EAS build or no env var)');
}