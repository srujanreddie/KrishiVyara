const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert imports at the top
const imports = `
import { initFirebase, getFirebaseDb, getFirebaseAuth } from './lib/firebase';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, onSnapshot, query, where, addDoc, deleteDoc, orderBy } from 'firebase/firestore';
`;

code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';" + imports);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx patched");
