const fs = require('fs');
const path = require('path');

function writeGoogleServicesJson() {
  const base64 = process.env.GOOGLE_SERVICES_JSON_BASE64;
  if (!base64) {
    throw new Error('❌ Missing GOOGLE_SERVICES_JSON_BASE64');
  }

  const outputDir = path.join(__dirname, '..', 'android', 'app');
  const outputPath = path.join(outputDir, 'google-services.json');
  const decoded = Buffer.from(base64, 'base64').toString('utf8');

  fs.writeFileSync(outputPath, decoded, { encoding: 'utf8' });
  console.log('✅ google-services.json written at', outputPath);
}

writeGoogleServicesJson();