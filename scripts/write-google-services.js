/* const fs = require('fs');
const path = require('path');

const base64Content = process.env.GOOGLE_SERVICES_JSON_BASE64;

if (!base64Content) {
  console.error('❌ Missing GOOGLE_SERVICES_JSON_BASE64 env variable');
  process.exit(1);
}

const filePath = path.resolve(__dirname, '../android/app/google-services.json');

try {
  const jsonContent = Buffer.from(base64Content, 'base64').toString('utf8');
  fs.writeFileSync(filePath, jsonContent, 'utf8');
  console.log('✅ google-services.json written successfully from Base64 env variable');
} catch (err) {
  console.error('❌ Failed to write google-services.json:', err.message);
  process.exit(1);
} */