/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initFirebase, getFirebaseDb } from './lib/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, onSnapshot, query, where, addDoc, deleteDoc, orderBy } from 'firebase/firestore';

import { UserProfile, CropScanResult, CurrentWeatherState, FarmDiaryEntry, ActivityType } from './types';
import { initialUserProfile, initialWeatherState, sampleDiseases, initialDiaryEntries } from './data/mockData';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { PlantDoctorScanner } from './components/PlantDoctorScanner';
import { MedicineGuide } from './components/MedicineGuide';
import { WeatherWidget } from './components/WeatherWidget';
import { ExpertHelpline } from './components/ExpertHelpline';
import { FarmDiary } from './components/FarmDiary';
import { UserProfileModal } from './components/UserProfileModal';
import { detectLocationAndWeather } from './utils/locationService';

export default function App() {
  // 1. User Profile State (persisted to localStorage)
  
  const [userProfile, setUserProfileState] = useState<UserProfile>(initialUserProfile);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  // Initialize Firebase and Auth
  useEffect(() => {
    initFirebase().then(({ auth }) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setFirebaseUser(user);
        } else {
          setFirebaseUser(null);
        }
        setIsFirebaseInitialized(true);
      });
    }).catch(err => {
      console.error("Firebase init failed:", err);
      setIsFirebaseInitialized(true); // Fallback to offline mode
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { auth } = await initFirebase();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

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


  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // 3. Weather State & GPS Locating State
  const [weather, setWeather] = useState<CurrentWeatherState>(initialWeatherState);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locatingStage, setLocatingStage] = useState<string>('');

  // Auto Location Detection Routine
  const handleAutoDetectLocation = async () => {
    setIsLocating(true);
    setLocatingStage('locating_gps');
    try {
      const result = await detectLocationAndWeather((stage) => {
        setLocatingStage(stage);
      });

      if (result.success) {
        // Update userProfile with accurate village, district, state & coordinates
        setUserProfile(prev => ({
          ...prev,
          village: result.village || prev.village,
          district: result.district || prev.district,
          state: result.state || prev.state,
          latitude: result.latitude,
          longitude: result.longitude,
          locationAccuracyMeters: result.accuracyMeters,
          lastLocationUpdated: new Date().toISOString(),
          locationAutoDetected: true
        }));

        // Update weather state with live forecast and radar alarms
        if (result.weather) {
          setWeather(result.weather);
        } else {
          setWeather(prev => ({
            ...prev,
            locationName: result.formattedName,
            latitude: result.latitude,
            longitude: result.longitude,
            locationAccuracyMeters: result.accuracyMeters,
            isAutoDetected: true,
            lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        }

        showToast(`📍 Field located: ${result.formattedName}`);
      }
    } catch (err) {
      console.error('Auto location detection failed:', err);
      showToast('Could not detect GPS coordinates. Using region fallback.');
    } finally {
      setIsLocating(false);
      setLocatingStage('');
    }
  };

  // Check geolocation permission and auto-detect on start if permitted or first load
  useEffect(() => {
    if (typeof window !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((status) => {
        if (status.state === 'granted') {
          handleAutoDetectLocation();
        }
      }).catch(() => {});
    }
  }, []);

  // 4. Latest Scan & Active Medicine Scan State
  const [latestScan, setLatestScan] = useState<CropScanResult | null>(sampleDiseases[0]);
  const [medicineActiveScan, setMedicineActiveScan] = useState<CropScanResult | null>(sampleDiseases[0]);

  // 5. Farm Diary Entries State (persisted to localStorage)
  
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


  // 6. UI Modals, Audio Playing State, and Notification Toast
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleScanComplete = (scan: CropScanResult) => {
    setLatestScan(scan);
    setMedicineActiveScan(scan);
  };

  
  const handleSaveScanToDiary = (scan: CropScanResult, dosageDetails?: string) => {
    const newEntry: FarmDiaryEntry = {
      id: 'diary-' + Date.now(),
      userId: firebaseUser?.uid || 'farmer-001',
      cropName: scan.cropName,
      plotName: 'Main Crop Field',
      activityType: 'pesticide',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: `Diagnosed ${scan.diseaseOrPestName}. Applied recommended medicine: ${scan.chemicalTreatment.name}. ${dosageDetails || ''}`,
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
    showToast(`Saved ${scan.cropName} diagnosis to Farm Diary!`);
  };


  
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
    showToast(`Logged activity to Farm Diary!`);
  };

  const handleDeleteDiaryEntry = (id: string) => {
    if (firebaseUser) {
      const db = getFirebaseDb();
      deleteDoc(doc(db, 'diaryEntries', id));
    } else {
      setDiaryEntriesState(prev => prev.filter(e => e.id !== id));
    }
    showToast(`Diary record removed`);
  };


  const handleQuickLog = (activityType: ActivityType) => {
    handleAddDiaryEntry({
      activityType: activityType,
      cropName: userProfile.primaryCrops[0] || 'Tomato',
      notes: `Recorded ${activityType} on field.`
    });
  };

  if (!isFirebaseInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-emerald-800">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-black">Loading KrishiVeyra...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-3xl font-black text-emerald-900 mb-2 font-['Outfit']">KrishiVeyra</h1>
          <p className="text-emerald-700 font-medium mb-8">Sign in to sync your farm data, diagnostic reports, and activity logs across your devices securely.</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-lg shadow-emerald-200 transition active:scale-95 flex items-center justify-center gap-3"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${
      userProfile.highContrastMode
        ? 'bg-black text-yellow-300 font-sans'
        : 'bg-slate-50 text-slate-900 font-sans'
    }`}>
      {/* Accessible Header */}
      <Header
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        weather={weather}
        onOpenProfile={() => setProfileModalOpen(true)}
        isAudioPlaying={isAudioPlaying}
        setIsAudioPlaying={setIsAudioPlaying}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-12">
        {activeTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            weather={weather}
            latestScan={latestScan}
            diaryEntries={diaryEntries}
            setActiveTab={setActiveTab}
            onQuickLog={handleQuickLog}
            setIsAudioPlaying={setIsAudioPlaying}
            onAutoDetectLocation={handleAutoDetectLocation}
            isLocating={isLocating}
          />
        )}

        {activeTab === 'scanner' && (
          <PlantDoctorScanner
            userProfile={userProfile}
            onScanComplete={handleScanComplete}
            setActiveTab={setActiveTab}
            onSaveToDiary={handleSaveScanToDiary}
            setIsAudioPlaying={setIsAudioPlaying}
          />
        )}

        {activeTab === 'medicine' && (
          <MedicineGuide
            userProfile={userProfile}
            activeScan={medicineActiveScan}
            onSelectScan={(s) => setMedicineActiveScan(s)}
            setActiveTab={setActiveTab}
            onSaveToDiary={handleSaveScanToDiary}
            setIsAudioPlaying={setIsAudioPlaying}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherWidget
            userProfile={userProfile}
            weather={weather}
            setWeather={setWeather}
            setIsAudioPlaying={setIsAudioPlaying}
            onAutoDetectLocation={handleAutoDetectLocation}
            isLocating={isLocating}
            locatingStage={locatingStage}
          />
        )}

        {activeTab === 'helpline' && (
          <ExpertHelpline
            userProfile={userProfile}
            activeScan={latestScan}
            setIsAudioPlaying={setIsAudioPlaying}
          />
        )}

        {activeTab === 'diary' && (
          <FarmDiary
            userProfile={userProfile}
            diaryEntries={diaryEntries}
            onAddEntry={handleAddDiaryEntry}
            onDeleteEntry={handleDeleteDiaryEntry}
            setIsAudioPlaying={setIsAudioPlaying}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white text-xs font-black shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-emerald-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Bottom / Mobile Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        hasActiveScan={!!latestScan}
      />

      {/* User Settings & Farmer Profile Modal */}
      {profileModalOpen && (
        <UserProfileModal
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          onClose={() => setProfileModalOpen(false)}
          onAutoDetectLocation={handleAutoDetectLocation}
          isLocating={isLocating}
        />
      )}
    </div>
  );
}

