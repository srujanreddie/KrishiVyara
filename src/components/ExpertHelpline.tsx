import React, { useState, useRef, useEffect } from 'react';

import { getFirebaseDb, getFirebaseAuth } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { UserProfile, CropScanResult, ExpertChatMessage, AgronomistExpert } from '../types';
import { translations } from '../data/translations';
import { agronomistExperts } from '../data/mockData';
import { SafeImage } from './SafeImage';
import { 
  Headset, 
  Phone, 
  Mic, 
  MicOff, 
  Send, 
  Image as ImageIcon, 
  Volume2, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  MessageSquare,
  Sparkles,
  Paperclip,
  Trash2,
  PhoneCall
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface ExpertHelplineProps {
  userProfile: UserProfile;
  activeScan: CropScanResult | null;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExpertHelpline: React.FC<ExpertHelplineProps> = ({
  userProfile,
  activeScan,
  setIsAudioPlaying
}) => {
  const t = translations[userProfile.languagePreference] || translations.en;
  
  const [selectedExpert, setSelectedExpert] = useState<AgronomistExpert>(agronomistExperts[0]);
  const [messages, setMessages] = useState<ExpertChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'expert',
      text: `नमस्ते ${userProfile.name}! मैं ${selectedExpert.name} (कृषि विज्ञान केंद्र) हूँ। आपकी फसल में जो भी समस्या या बीमारी दिख रही है, आप मुझे बोलकर या फोटो भेजकर पूछ सकते हैं।`,
      timestamp: '10:00 AM',
      status: 'delivered'
    }
  ]);

  
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);


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

  const [inputMsg, setInputMsg] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [attachCurrentScan, setAttachCurrentScan] = useState<boolean>(!!activeScan);
  const [callModalOpen, setCallModalOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Read aloud helper
  const handleSpeak = (text: string) => {
    setIsAudioPlaying(true);
    speakText(text, userProfile.languagePreference, () => setIsAudioPlaying(false));
  };

  const handleSendMessage = async (textToSend?: string, isVoice: boolean = false) => {
    const messageContent = textToSend || inputMsg;
    if (!messageContent.trim() && !attachCurrentScan) return;

    const userMessage: ExpertChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'farmer',
      text: messageContent || (attachCurrentScan ? `[Sent Photo of ${activeScan?.cropName}: ${activeScan?.diseaseOrPestName}]` : 'Query'),
      imageUrl: attachCurrentScan && activeScan?.imageUrl ? activeScan.imageUrl : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceNote: isVoice,
      status: 'sent'
    };

    
    const newHistory = [...messages, userMessage];
    if (userId) {
      const db = getFirebaseDb();
      setDoc(doc(db, 'chatMessages', userMessage.id), { ...userMessage, userId });
    } else {
      setMessages(newHistory);
    }

    setInputMsg('');
    setIsSending(true);

    try {
      const res = await fetch('/api/expert-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          userProfile: userProfile,
          currentScanContext: attachCurrentScan ? activeScan : null,
          language: userProfile.languagePreference
        })
      });

      const data = await res.json();
      
      if (data.success && data.reply) {
        if (userId) {
          const db = getFirebaseDb();
          setDoc(doc(db, 'chatMessages', data.reply.id), { ...data.reply, userId });
        } else {
          setMessages(prev => [...prev, data.reply]);
        }

        if (userProfile.voiceAutoRead) {
          handleSpeak(data.reply.text);
        }
      }
    } catch (err) {
      console.warn('Chat error:', err);
      // Fallback expert reply
      const fallbackReply: ExpertChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'expert',
        text: `किसान भाई, आपकी फसल की जानकारी मिल गई है। 15 लीटर की टंकी में 2.5 चम्मच दवा मिलाकर शाम के समय छिड़काव करें। इससे फसल पूरी तरह सुरक्षित रहेगी।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  // Trigger voice note recording
  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // Simulate sending recorded voice question
      const simulatedVoiceText = userProfile.languagePreference === 'hi' 
        ? 'डॉक्टर साहब, मेरे टमाटर के पत्ते नीचे से पीले पड़ रहे हैं और गोल धब्बे हैं, क्या दवा डालूं?'
        : 'Doctor, my crop leaves have round brown spots and are drying up. How much medicine should I spray?';
      handleSendMessage(simulatedVoiceText, true);
    }
  };

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border transition shadow-sm ${
        userProfile.highContrastMode
          ? 'bg-black border-2 border-yellow-400 text-yellow-300'
          : 'bg-indigo-700 text-white shadow-lg shadow-indigo-200/50 border-indigo-800'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider text-indigo-100">
                Kisan Helpline
              </span>
              <span className="text-xs text-indigo-200 font-bold">
                Krishi Vigyan Kendra (KVK) Network
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
              {t.helplineTitle}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-0.5 font-medium">
              {t.helplineSubtitle}
            </p>
          </div>

          <button
            id="call-tollfree-btn"
            onClick={() => setCallModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-2 shadow-md active:scale-95 transition shrink-0"
          >
            <Phone className="w-4 h-4 stroke-[2.5]" />
            <span>{t.callExpertBtn}</span>
          </button>
        </div>
      </div>

      {/* Agronomist Expert Switcher Cards */}
      <div>
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 px-1 block mb-2">
          Available Agricultural Scientists:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {agronomistExperts.map((exp) => (
            <div
              key={exp.id}
              onClick={() => setSelectedExpert(exp)}
              className={`p-3.5 rounded-3xl border transition cursor-pointer flex items-center gap-3 shadow-sm ${
                selectedExpert.id === exp.id
                  ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-400 shadow-md'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-inner">
                <SafeImage 
                  src={exp.avatarUrl} 
                  alt={exp.name}
                  expertName={exp.name}
                  fallbackType="avatar"
                  className="w-full h-full object-cover"
                />
                {exp.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-black text-xs text-slate-900 truncate">
                    {exp.name}
                  </h4>
                  {exp.verifiedKVK && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate font-medium">
                  {exp.specialization}
                </p>
                <div className="text-[10px] font-black text-indigo-700 mt-0.5">
                  ★ {exp.rating} • {exp.experienceYears} yrs exp
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat & Voice Interaction Window */}
      <div className={`rounded-[36px] border transition shadow-xl shadow-slate-100 overflow-hidden flex flex-col h-[500px] ${
        userProfile.highContrastMode ? 'bg-black border-2 border-yellow-400' : 'bg-white border-slate-200'
      }`}>
        {/* Chat Window Top Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
              <SafeImage 
                src={selectedExpert.avatarUrl} 
                alt={selectedExpert.name}
                expertName={selectedExpert.name}
                fallbackType="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5 font-['Outfit']">
                <span>{selectedExpert.name}</span>
                <span className="text-[10px] font-black text-emerald-600">● Online</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Languages: {selectedExpert.languages.join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeScan && (
              <button
                onClick={() => setAttachCurrentScan(!attachCurrentScan)}
                className={`px-3 py-1.5 rounded-2xl text-[11px] font-black flex items-center gap-1.5 transition ${
                  attachCurrentScan
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
                title="Include latest plant scan in message"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>{attachCurrentScan ? 'Scan Attached' : 'Attach Scan'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-md rounded-3xl p-4 space-y-2 shadow-sm ${
                msg.sender === 'farmer'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-100'
                  : userProfile.highContrastMode
                  ? 'bg-zinc-900 border border-yellow-400 text-yellow-300 rounded-bl-none'
                  : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
              }`}>
                {msg.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/20 mb-1.5 max-h-36">
                    <SafeImage 
                      src={msg.imageUrl} 
                      alt="Crop Attachment" 
                      fallbackType="crop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.text}
                  </p>

                  {msg.sender === 'expert' && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 shrink-0 transition"
                      title={t.speakText}
                    >
                      <Volume2 className="w-4 h-4 text-indigo-700" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 text-[10px] opacity-75 font-medium">
                  {msg.isVoiceNote && <span className="mr-1">🎙️ Voice Note •</span>}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Dr. Ramesh is typing advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Note Recording Status Ribbon */}
        {isRecording && (
          <div className="px-5 py-3 bg-rose-50 border-t border-rose-200 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2 text-rose-800 text-xs font-black">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span>{t.recordingVoice} ({recordingSeconds}s)</span>
            </div>
            <span className="text-[11px] text-rose-700 font-black">
              Tap red mic to send
            </span>
          </div>
        )}

        {/* Bottom Input Controls */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5">
          {/* Big Voice Note Button */}
          <button
            id="voice-record-btn"
            onClick={handleToggleRecord}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition active:scale-95 shadow-md ${
              isRecording
                ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-300 shadow-rose-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
            title={t.sendVoiceNoteBtn}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 stroke-[2.5]" />}
          </button>

          {/* Text Input */}
          <input
            id="expert-chat-input"
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            placeholder={t.typeMessagePlaceholder}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />

          {/* Send Button */}
          <button
            id="send-chat-msg-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputMsg.trim() && !attachCurrentScan}
            className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-200 active:scale-95 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Voice Call Simulation Dialog */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[36px] p-7 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-pulse shadow-sm">
              <PhoneCall className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                Government Kisan Call Center
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Toll-Free 24x7 Agronomy Assistance
              </p>
              <div className="text-xl font-black text-emerald-700 mt-2 font-mono tracking-wide">
                1800-180-1551
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              Free call connects you immediately with local agricultural scientists in Hindi, Marathi, Punjabi, Telugu, Bengali, etc.
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setCallModalOpen(false)}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition"
              >
                Close
              </button>

              <a
                href="tel:18001801551"
                onClick={() => setCallModalOpen(false)}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Dial Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
