const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the userProfile state and effect
const userProfileStr = `
  const [userProfile, setUserProfileState] = useState<UserProfile>(initialUserProfile);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  // Initialize Firebase and Auth
  useEffect(() => {
    initFirebase().then(({ auth }) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setFirebaseUser(user);
          setIsFirebaseInitialized(true);
        } else {
          await signInAnonymously(auth);
        }
      });
    }).catch(err => {
      console.error("Firebase init failed:", err);
      setIsFirebaseInitialized(true); // Fallback to offline mode
    });
  }, []);

  // Sync profile with Firestore
  useEffect(() => {
    if (!firebaseUser) return;
    const db = getFirebaseDb();
    const userRef = doc(db, 'users', firebaseUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfileState({ ...initialUserProfile, ...docSnap.data(), id: firebaseUser.uid });
      } else {
        // Initialize profile in DB
        setDoc(userRef, { ...initialUserProfile, id: firebaseUser.uid }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, [firebaseUser]);

  // Wrapper for setUserProfile to save to Firestore
  const setUserProfile = (updater: any) => {
    setUserProfileState(prev => {
      const nextProfile = typeof updater === 'function' ? updater(prev) : updater;
      if (firebaseUser) {
        const db = getFirebaseDb();
        setDoc(doc(db, 'users', firebaseUser.uid), nextProfile, { merge: true });
      } else {
        localStorage.setItem('krishiveyra_profile', JSON.stringify(nextProfile));
      }
      return nextProfile;
    });
  };
`;

code = code.replace(/const \[userProfile, setUserProfile\] = useState<UserProfile>\(\(\) => \{[\s\S]*?\}, \[userProfile\]\);/, userProfileStr);

const diaryEntriesStr = `
  const [diaryEntries, setDiaryEntriesState] = useState<FarmDiaryEntry[]>(initialDiaryEntries);

  // Sync diary entries from Firestore
  useEffect(() => {
    if (!firebaseUser) return;
    const db = getFirebaseDb();
    const q = query(collection(db, 'diaryEntries'), where('userId', '==', firebaseUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: FarmDiaryEntry[] = [];
      snapshot.forEach(doc => {
        entries.push(doc.data() as FarmDiaryEntry);
      });
      // Sort descending by date/time
      entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDiaryEntriesState(entries);
    });
    return () => unsubscribe();
  }, [firebaseUser]);
`;

code = code.replace(/const \[diaryEntries, setDiaryEntries\] = useState<FarmDiaryEntry\[\]>\(\(\) => \{[\s\S]*?\}, \[diaryEntries\]\);/, diaryEntriesStr);

// Replace setDiaryEntries wrapper logic in add/delete handlers
// wait, the app currently uses setDiaryEntries(prev => ...);
// I'll replace the handleAddDiaryEntry and handleDeleteDiaryEntry entirely.

const addDeleteStr = `
  const handleAddDiaryEntry = (entry: Partial<FarmDiaryEntry>) => {
    const newEntry: FarmDiaryEntry = {
      id: 'diary-' + Date.now(),
      userId: firebaseUser?.uid || 'farmer-001',
      cropName: entry.cropName || userProfile.primaryCrops[0] || 'Tomato',
      plotName: entry.plotName || 'Main Field',
      activityType: entry.activityType || 'note',
      date: entry.date || new Date().toISOString().split('T')[0],
      time: entry.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: entry.notes || 'Activity completed',
      quantity: entry.quantity,
      unit: entry.unit,
      chemicalUsed: entry.chemicalUsed,
      imageUrl: entry.imageUrl,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    if (firebaseUser) {
      const db = getFirebaseDb();
      setDoc(doc(db, 'diaryEntries', newEntry.id), newEntry);
    } else {
      setDiaryEntriesState(prev => [newEntry, ...prev]);
    }
    showToast(\`Logged activity to Farm Diary!\`);
  };

  const handleDeleteDiaryEntry = (id: string) => {
    if (firebaseUser) {
      const db = getFirebaseDb();
      deleteDoc(doc(db, 'diaryEntries', id));
    } else {
      setDiaryEntriesState(prev => prev.filter(e => e.id !== id));
    }
    showToast(\`Diary record removed\`);
  };
`;

code = code.replace(/const handleAddDiaryEntry = \(entry: Partial<FarmDiaryEntry>\) => \{[\s\S]*?showToast\(\`Diary record removed\`\);\n  \};/, addDeleteStr);


// Replace handleSaveScanToDiary
const saveScanStr = `
  const handleSaveScanToDiary = (scan: CropScanResult, dosageDetails?: string) => {
    const newEntry: FarmDiaryEntry = {
      id: 'diary-' + Date.now(),
      userId: firebaseUser?.uid || 'farmer-001',
      cropName: scan.cropName,
      plotName: 'Main Crop Field',
      activityType: 'pesticide',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: \`Diagnosed \${scan.diseaseOrPestName}. Applied recommended medicine: \${scan.chemicalTreatment.name}. \${dosageDetails || ''}\`,
      chemicalUsed: scan.chemicalTreatment.name,
      imageUrl: scan.imageUrl,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    if (firebaseUser) {
      const db = getFirebaseDb();
      setDoc(doc(db, 'diaryEntries', newEntry.id), newEntry);
    } else {
      setDiaryEntriesState(prev => [newEntry, ...prev]);
    }
    showToast(\`Saved \${scan.cropName} diagnosis to Farm Diary!\`);
  };
`;
code = code.replace(/const handleSaveScanToDiary = \(scan: CropScanResult, dosageDetails\?: string\) => \{[\s\S]*?showToast\(\`Saved \$\{scan\.cropName\} diagnosis to Farm Diary!\`\);\n  \};/, saveScanStr);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx handlers patched");
