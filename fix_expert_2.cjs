const fs = require('fs');
let code = fs.readFileSync('src/components/ExpertHelpline.tsx', 'utf8');

// Remove the getFirebaseAuth useEffect
code = code.replace(/    const auth = getFirebaseAuth\(\);\n    if \(\!auth\) return;\n    const unsubscribe = onAuthStateChanged\(auth, \(user\) => \{\n      setUserId\(user \? user\.uid : null\);\n    \}\);\n    return \(\) => unsubscribe\(\);\n/g, '');

// Remove the getFirebaseDb useEffect
code = code.replace(/  useEffect\(\(\) => \{\n    if \(\!userId\) return;\n    const db = getFirebaseDb\(\);\n    const q = query\(collection\(db, 'chatMessages'\), where\('userId', '==', userId\)\);\n    const unsubscribe = onSnapshot\(q, \(snapshot\) => \{\n      const msgs = \[\];\n      snapshot\.forEach\(doc => \{\n        msgs\.push\(doc\.data\(\)\);\n      \}\);\n      \/\/ Sort by timestamp if possible, we'll sort by numeric ID assuming we used Date\.now\(\)\n      msgs\.sort\(\(a, b\) => \{\n        const idA = parseInt\(a\.id\.split\('-'\)\.pop\(\) \|\| '0'\);\n        const idB = parseInt\(b\.id\.split\('-'\)\.pop\(\) \|\| '0'\);\n        return idA - idB;\n      \}\);\n      \n      if \(msgs\.length > 0\) \{\n        setMessages\(msgs\);\n      \}\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[userId\]\);\n/g, '');


// Fix setDoc in handleSendMessage (User Message)
code = code.replace(/    if \(userId\) \{\n      const db = getFirebaseDb\(\);\n      setDoc\(doc\(db, 'chatMessages', userMessage\.id\), \{ \.\.\.userMessage, userId \}\);\n    \} else \{\n      setMessages\(newHistory\);\n    \}/g, `    setMessages(newHistory);`);

// Fix setDoc in handleSendMessage (Bot Reply)
code = code.replace(/        if \(userId\) \{\n          const db = getFirebaseDb\(\);\n          setDoc\(doc\(db, 'chatMessages', data\.reply\.id\), \{ \.\.\.data\.reply, userId \}\);\n        \} else \{\n          setMessages\(prev => \[\.\.\.prev, data\.reply\]\);\n        \}/g, `        setMessages(prev => [...prev, data.reply]);`);


fs.writeFileSync('src/components/ExpertHelpline.tsx', code);
