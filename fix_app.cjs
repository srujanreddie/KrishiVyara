const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Firebase imports
code = code.replace(/import \{ initFirebase, getFirebaseDb \} from '\.\/lib\/firebase';\n/g, '');
code = code.replace(/import \{ onAuthStateChanged, User \} from 'firebase\/auth';\n/g, '');
code = code.replace(/import \{ collection, doc, getDoc, setDoc, onSnapshot, query, where, addDoc, deleteDoc, orderBy \} from 'firebase\/firestore';\n/g, '');

// 2. Remove Firebase state
code = code.replace(/  const \[firebaseUser, setFirebaseUser\] = useState<User \| null>\(null\);\n/g, '');
code = code.replace(/  const \[isFirebaseInitialized, setIsFirebaseInitialized\] = useState\(false\);\n/g, '');

// 3. Remove initFirebase useEffect
code = code.replace(/  \/\/ Initialize Firebase and Auth\n  useEffect\(\(\) => \{\n    initFirebase\(\)\.then\(\(\{ auth \}\) => \{\n      onAuthStateChanged\(auth, async \(user\) => \{\n        if \(user\) \{\n          setFirebaseUser\(user\);\n        \} else \{\n          setFirebaseUser\(null\);\n        \}\n        setIsFirebaseInitialized\(true\);\n      \}\);\n    \}\)\.catch\(err => \{\n      console\.error\("Firebase init failed:", err\);\n      setIsFirebaseInitialized\(true\); \/\/ Fallback to offline mode\n    \}\);\n  \}, \[\]\);\n/g, '');

// 4. Remove sync profile useEffect
code = code.replace(/  \/\/ Sync profile with Firestore\n  useEffect\(\(\) => \{\n    if \(\!firebaseUser\) return;\n    const db = getFirebaseDb\(\);\n    const userRef = doc\(db, 'users', firebaseUser\.uid\);\n    const unsubscribe = onSnapshot\(userRef, \(docSnap\) => \{\n      if \(docSnap\.exists\(\)\) \{\n        setUserProfileState\(\{ \.\.\.initialUserProfile, \.\.\.docSnap\.data\(\), id: firebaseUser\.uid \}\);\n      \} else \{\n        \/\/ Initialize profile in DB\n        setDoc\(userRef, \{ \.\.\.initialUserProfile, id: firebaseUser\.uid \}, \{ merge: true \}\);\n      \}\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[firebaseUser\]\);\n/g, '');

// 5. Rewrite setUserProfile to strictly use localStorage
code = code.replace(/  \/\/ Wrapper for setUserProfile to save to Firestore\n  const setUserProfile = \(updater: any\) => \{\n    setUserProfileState\(prev => \{\n      const nextProfile = typeof updater === 'function' \? updater\(prev\) : updater;\n      if \(firebaseUser\) \{\n        const db = getFirebaseDb\(\);\n        setDoc\(doc\(db, 'users', firebaseUser\.uid\), nextProfile, \{ merge: true \}\);\n      \} else \{\n        localStorage\.setItem\('krishiveyra_profile', JSON\.stringify\(nextProfile\)\);\n      \}\n      return nextProfile;\n    \}\);\n  \};\n/g, `  // Wrapper for setUserProfile to save to LocalStorage\n  const setUserProfile = (updater: any) => {\n    setUserProfileState(prev => {\n      const nextProfile = typeof updater === 'function' ? updater(prev) : updater;\n      localStorage.setItem('krishiveyra_profile', JSON.stringify(nextProfile));\n      return nextProfile;\n    });\n  };\n`);

// 6. Remove sync diary entries useEffect
code = code.replace(/  \/\/ Sync diary entries from Firestore\n  useEffect\(\(\) => \{\n    if \(\!firebaseUser\) return;\n    const db = getFirebaseDb\(\);\n    const q = query\(collection\(db, 'diaryEntries'\), where\('userId', '==', firebaseUser\.uid\)\);\n    const unsubscribe = onSnapshot\(q, \(snapshot\) => \{\n      const entries: FarmDiaryEntry\[\] = \[\];\n      snapshot\.forEach\(doc => \{\n        entries\.push\(doc\.data\(\) as FarmDiaryEntry\);\n      \}\);\n      \/\/ Sort descending by date\/time\n      entries\.sort\(\(a, b\) => new Date\(b\.createdAt\)\.getTime\(\) - new Date\(a\.createdAt\)\.getTime\(\)\);\n      setDiaryEntriesState\(entries\);\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[firebaseUser\]\);\n/g, '');

// 7. Fix handleSaveScanToDiary
code = code.replace(/    if \(firebaseUser\) \{\n      const db = getFirebaseDb\(\);\n      setDoc\(doc\(db, 'diaryEntries', newEntry\.id\), newEntry\);\n    \} else \{\n      setDiaryEntriesState\(prev => \{\n        const next = \[newEntry, \.\.\.prev\];\n        localStorage\.setItem\('krishiveyra_diary', JSON\.stringify\(next\)\);\n        return next;\n      \}\);\n    \}/g, `    setDiaryEntriesState(prev => {\n      const next = [newEntry, ...prev];\n      localStorage.setItem('krishiveyra_diary', JSON.stringify(next));\n      return next;\n    });`);

// 8. Fix handleAddDiaryEntry
code = code.replace(/    if \(firebaseUser\) \{\n      const db = getFirebaseDb\(\);\n      setDoc\(doc\(db, 'diaryEntries', newEntry\.id\), newEntry\);\n    \} else \{\n      setDiaryEntriesState\(prev => \{\n        const next = \[newEntry, \.\.\.prev\];\n        localStorage\.setItem\('krishiveyra_diary', JSON\.stringify\(next\)\);\n        return next;\n      \}\);\n    \}/g, `    setDiaryEntriesState(prev => {\n      const next = [newEntry, ...prev];\n      localStorage.setItem('krishiveyra_diary', JSON.stringify(next));\n      return next;\n    });`);

// 9. Fix handleDeleteDiaryEntry
code = code.replace(/    if \(firebaseUser\) \{\n      const db = getFirebaseDb\(\);\n      deleteDoc\(doc\(db, 'diaryEntries', id\)\);\n    \} else \{\n      setDiaryEntriesState\(prev => \{\n        const next = prev\.filter\(e => e\.id !== id\);\n        localStorage\.setItem\('krishiveyra_diary', JSON\.stringify\(next\)\);\n        return next;\n      \}\);\n    \}/g, `    setDiaryEntriesState(prev => {\n      const next = prev.filter(e => e.id !== id);\n      localStorage.setItem('krishiveyra_diary', JSON.stringify(next));\n      return next;\n    });`);

// 10. Remove firebaseUser references in objects
code = code.replace(/firebaseUser\?\.uid \|\| /g, '');
code = code.replace(/userId: 'farmer-001',/g, "userId: 'local-user',");

// 11. Remove loading screen
code = code.replace(/  if \(\!isFirebaseInitialized\) \{\n    return \(\n      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-emerald-800">\n        <div className="animate-pulse flex flex-col items-center">\n          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"><\/div>\n          <p className="mt-4 font-black">Loading KrishiVeyra\.\.\.<\/p>\n        <\/div>\n      <\/div>\n    \);\n  \}\n/g, '');


fs.writeFileSync('src/App.tsx', code);
