const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Insert route for firebase-applet-config.json before Vite middleware
const route = `
// ==========================================
// Firebase Config Serving
// ==========================================
app.get('/firebase-applet-config.json', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'firebase-applet-config.json'));
});
`;

code = code.replace('// Vite Middleware / Static Production Serving', route + '\n// Vite Middleware / Static Production Serving');

fs.writeFileSync('server.ts', code);
console.log("server.ts patched");
