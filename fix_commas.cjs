const fs = require('fs');
let code = fs.readFileSync('src/data/translations.ts', 'utf8');

// The issue is that the line before "    greeting:" is missing a comma.
// We can use a regex to capture the non-whitespace characters before "\n    greeting:" and add a comma if there isn't one.

code = code.replace(/([^,])(\n\s*greeting:)/g, "$1,$2");

fs.writeFileSync('src/data/translations.ts', code);
console.log("Commas fixed");
