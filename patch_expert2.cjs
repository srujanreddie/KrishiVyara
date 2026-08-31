const fs = require('fs');
let code = fs.readFileSync('src/components/ExpertHelpline.tsx', 'utf8');

const authStr = `
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);
`;

code = code.replace(/const auth = getFirebaseAuth\(\);\n  const userId = auth\?\.currentUser\?\.uid;/, authStr);

fs.writeFileSync('src/components/ExpertHelpline.tsx', code);
console.log("ExpertHelpline patched for auth");
