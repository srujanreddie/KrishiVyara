const fs = require('fs');
let code = fs.readFileSync('src/components/ExpertHelpline.tsx', 'utf8');

code = code.replace(/import \{ getFirebaseDb, getFirebaseAuth \} from '\.\.\/lib\/firebase';\n/g, '');
code = code.replace(/import \{ onAuthStateChanged \} from 'firebase\/auth';\n/g, '');
code = code.replace(/import \{ collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where \} from 'firebase\/firestore';\n/g, '');

code = code.replace(/  \/\/ Listen to Firebase Auth\n  useEffect\(\(\) => \{\n    const auth = getFirebaseAuth\(\);\n    if \(\!auth\) return;\n    const unsubscribe = onAuthStateChanged\(auth, \(user\) => \{\n      setFirebaseUser\(user\);\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[\]\);\n/g, '');

code = code.replace(/  const \[firebaseUser, setFirebaseUser\] = useState<any>\(null\);\n/g, '');

fs.writeFileSync('src/components/ExpertHelpline.tsx', code);
