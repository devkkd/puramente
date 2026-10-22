require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

console.log('Testing email with current credentials...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('RECEIVER_EMAIL:', process.env.RECEIVER_EMAIL);

(async () => {
  const result = await sendEmail({
    to: process.env.RECEIVER_EMAIL,
    subject: 'Test Email - ' + Date.now(),
    html: '<h2>Test</h2><p>Email system test from Puramente</p>'
  });

  console.log('Result:', result);
  process.exit(result.success ? 0 : 1);
})();
