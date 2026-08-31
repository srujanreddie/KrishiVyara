const fs = require('fs');
let code = fs.readFileSync('src/components/ExpertHelpline.tsx', 'utf8');

code = code.replace("import { collection, query, where, onSnapshot, doc, setDoc, orderBy } from 'firebase/firestore';", "import { collection, query, where, onSnapshot, doc, setDoc, orderBy } from 'firebase/firestore';\nimport { onAuthStateChanged } from 'firebase/auth';");

code = code.replace(/const unsubscribe = auth\.onAuthStateChanged\(user => \{/, "const unsubscribe = onAuthStateChanged(auth, (user) => {");

fs.writeFileSync('src/components/ExpertHelpline.tsx', code);
console.log("ExpertHelpline patched for auth import");
