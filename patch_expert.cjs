const fs = require('fs');
let code = fs.readFileSync('src/components/ExpertHelpline.tsx', 'utf8');

// Insert imports
const imports = `
import { getFirebaseDb, getFirebaseAuth } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, orderBy } from 'firebase/firestore';
`;
code = code.replace("import React, { useState, useRef, useEffect } from 'react';", "import React, { useState, useRef, useEffect } from 'react';\n" + imports);

// We need to sync messages
const effectStr = `
  const auth = getFirebaseAuth();
  const userId = auth?.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    const db = getFirebaseDb();
    const q = query(collection(db, 'chatMessages'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach(doc => {
        msgs.push(doc.data());
      });
      // Sort by timestamp if possible, we'll sort by numeric ID assuming we used Date.now()
      msgs.sort((a, b) => {
        const idA = parseInt(a.id.split('-').pop() || '0');
        const idB = parseInt(b.id.split('-').pop() || '0');
        return idA - idB;
      });
      
      if (msgs.length > 0) {
        setMessages(msgs);
      }
    });
    return () => unsubscribe();
  }, [userId]);
`;

code = code.replace(/const \[messages, setMessages\] = useState<ExpertChatMessage\[\]>\(\[[\s\S]*?\]\);/, "const [messages, setMessages] = useState<ExpertChatMessage[]>([\n    {\n      id: 'msg-welcome',\n      sender: 'expert',\n      text: `नमस्ते ${userProfile.name}! मैं ${selectedExpert.name} (कृषि विज्ञान केंद्र) हूँ। आपकी फसल में जो भी समस्या या बीमारी दिख रही है, आप मुझे बोलकर या फोटो भेजकर पूछ सकते हैं।`,\n      timestamp: '10:00 AM',\n      status: 'delivered'\n    }\n  ]);\n" + effectStr);

const sendMessageStr = `
    const newHistory = [...messages, userMessage];
    if (userId) {
      const db = getFirebaseDb();
      setDoc(doc(db, 'chatMessages', userMessage.id), { ...userMessage, userId });
    } else {
      setMessages(newHistory);
    }
`;

code = code.replace(/const newHistory = \[\.\.\.messages, userMessage\];\n    setMessages\(newHistory\);/, sendMessageStr);

const receiveReplyStr = `
      if (data.success && data.reply) {
        if (userId) {
          const db = getFirebaseDb();
          setDoc(doc(db, 'chatMessages', data.reply.id), { ...data.reply, userId });
        } else {
          setMessages(prev => [...prev, data.reply]);
        }
`;

code = code.replace(/if \(data\.success && data\.reply\) \{\n        setMessages\(prev => \[\.\.\.prev, data\.reply\]\);/, receiveReplyStr);

fs.writeFileSync('src/components/ExpertHelpline.tsx', code);
console.log("ExpertHelpline patched");
