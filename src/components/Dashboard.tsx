import React from 'react';
import { UserProfile, CropScanResult, CurrentWeatherState, FarmDiaryEntry } from '../types';
import { translations } from '../data/translations';
import { ActiveTab } from './Navigation';
import { SafeImage } from './SafeImage';
import { 
  Camera, 
  FlaskConical, 
  CloudSunRain, 
  Headset, 
  BookOpen, 
  AlertTriangle, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Droplets,
  Sparkles,
  Leaf,
  Bug,
  ThermometerSun,
  CloudRain,
  MapPin
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface DashboardProps {
  userProfile: UserProfile;
  weather: CurrentWeatherState;
  latestScan: CropScanResult | null;
  diaryEntries: FarmDiaryEntry[];
  setActiveTab: (tab: ActiveTab) => void;
  onQuickLog: (type: any) => void;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  onAutoDetectLocation?: () => void;
  isLocating?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  weather,
  latestScan,
  diaryEntries,
  setActiveTab,
  onQuickLog,
  setIsAudioPlaying,
  onAutoDetectLocation,
  isLocating = false
}) => {
  const t = translations[userProfile.languagePreference] || translations.en;

  const handleSpeak = (text: string) => {
    setIsAudioPlaying(true);
    speakText(text, userProfile.languagePreference, () => setIsAudioPlaying(false));
  };

  const activeAlert = weather.dangerAlerts[0];

  return (
    <div className="space-y-5 pb-24">
      {/* Hero Header Photo */}
      <div className="relative w-full h-40 sm:h-52 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80" 
          alt="Lush green farm field" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
        <div className="absolute bottom-4 left-5 right-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] drop-shadow-md">
            {t.greeting}, {userProfile.name.split(' ')[0]}
          </h1>
          <p className="text-emerald-50 font-medium text-xs sm:text-sm drop-shadow mt-0.5 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" />
            {userProfile.primaryCrops.join(', ')} {t.farmLabel} • {userProfile.farmSizeAcres} {t.acres}
          </p>
        </div>
      </div>

      {/* 1. Prominent Weather Danger or Safe Spray Banner */}
      <div 
        id="weather-alarm-banner"
        className={`rounded-3xl p-5 sm:p-6 border transition shadow-sm ${
          weather.isRainImminent || activeAlert?.severity === 'danger'
            ? 'bg-rose-100 border-2 border-rose-400 text-rose-950'
            : activeAlert?.severity === 'warning'
            ? 'bg-amber-100 border-2 border-amber-400 text-amber-950'
            : userProfile.highContrastMode
            ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300'
            : 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl shrink-0 shadow-sm ${
              weather.isRainImminent || activeAlert?.severity === 'danger'
                ? 'bg-rose-600 text-white'
                : activeAlert?.severity === 'warning'
                ? 'bg-amber-400 text-amber-950 font-black'
                : userProfile.highContrastMode
                ? 'bg-yellow-400 text-black'
                : 'bg-emerald-600 text-white'
            }`}>
              {weather.isRainImminent ? (
                <CloudRain className="w-6 h-6 animate-bounce" />
              ) : activeAlert?.severity === 'warning' ? (
                <ThermometerSun className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  weather.isRainImminent
                    ? 'bg-rose-200 text-rose-900 font-black'
                    : 'bg-emerald-200 text-emerald-900 font-bold'
                }`}>
                  {weather.isRainImminent ? t.rainRiskAlert : t.sprayAdvisory}
                </span>
                
                {onAutoDetectLocation ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAutoDetectLocation();
                    }}
                    disabled={isLocating}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-300 text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                    title="Tap to Auto-Detect Field Location via GPS"
                  >
                    <MapPin className={`w-3 h-3 text-emerald-700 ${isLocating ? 'animate-bounce' : ''}`} />
                    <span>{isLocating ? t.locatingGps : weather.locationName}</span>
                    {weather.locationAccuracyMeters && (
                      <span className="text-[9px] px-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                        ±{weather.locationAccuracyMeters}m
                      </span>
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-bold opacity-75">
                    {weather.locationName}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black mt-1 leading-snug">
                {activeAlert?.title || (weather.isRainImminent ? t.rainWashAlert : t.safeToSprayText)}
              </h2>
              <p className="text-xs sm:text-sm mt-0.5 opacity-90 leading-relaxed font-medium">
                {activeAlert?.description || t.optimalConditions}
              </p>
            </div>
          </div>

          <button
            id="speak-weather-btn"
            onClick={() => handleSpeak(`${activeAlert?.title || 'Weather update'}. ${activeAlert?.description || ''}`)}
            className="p-2.5 rounded-2xl bg-white/90 hover:bg-white shadow-sm border border-slate-200 shrink-0 text-slate-700 active:scale-95 transition"
            title={t.speakText}
          >
            <Volume2 className="w-5 h-5 text-emerald-700" />
          </button>
        </div>

        <div className="mt-3.5 pt-3.5 border-t border-current/15 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1">
              🌡️ {weather.temperature}°C
            </span>
            <span className="flex items-center gap-1">
              💧 {weather.humidity}% {t.humidityLabel}
            </span>
            <span className="flex items-center gap-1">
              💨 {weather.windSpeedKmh} km/h {t.windLabel}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('weather')}
            className="text-xs font-black flex items-center gap-1 text-emerald-800 underline hover:no-underline"
          >
            {t.forecast7Day} &rarr;
          </button>
        </div>
      </div>

      {/* 2. Hero 1-Tap Plant Doctor Scanner Card */}
      <div 
        id="hero-scan-card"
        onClick={() => setActiveTab('scanner')}
        className={`cursor-pointer rounded-[36px] p-6 sm:p-8 transition transform active:scale-[0.99] shadow-2xl relative overflow-hidden group ${
          userProfile.highContrastMode
            ? 'bg-zinc-950 border-4 border-yellow-400 text-yellow-300 ring-4 ring-yellow-400/20'
            : 'bg-emerald-600 text-white shadow-emerald-200 border border-emerald-500'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black tracking-wide text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.aiVisionBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-['Outfit'] leading-tight">
              {t.scanTitle}
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed opacity-95 font-medium">
              {t.scanSubtitle}
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button 
                id="hero-open-camera-btn"
                className={`px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition active:scale-95 ${
                  userProfile.highContrastMode
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-white text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Camera className="w-5 h-5 stroke-[2.5]" />
                <span>{t.takePhotoBtn}</span>
              </button>

              <span className="text-xs text-emerald-100 font-bold flex items-center gap-1.5 bg-emerald-700/50 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                {t.offlineMode}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center p-5 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 shrink-0 shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-2 animate-pulse">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-emerald-100">
              {t.tapToScan}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Grid for Farmers */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 px-1">
          {t.quickFarmingTools}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Medicine & Dosage Guide */}
          <button
            id="quick-card-medicine"
            onClick={() => setActiveTab('medicine')}
            className={`p-4 sm:p-5 rounded-3xl border text-left flex flex-col justify-between transition transform active:scale-95 shadow-sm ${
              userProfile.highContrastMode
                ? 'bg-black border-2 border-yellow-400 text-yellow-300'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3.5 shadow-sm">
              <FlaskConical className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-sm leading-snug">
                {t.dosageCalculatorTitle}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {t.exactSpoons}
              </p>
            </div>
          </button>

          {/* Card 2: Agronomist Helpline */}
          <button
            id="quick-card-helpline"
            onClick={() => setActiveTab('helpline')}
            className={`p-4 sm:p-5 rounded-3xl border text-left flex flex-col justify-between transition transform active:scale-95 shadow-sm ${
              userProfile.highContrastMode
                ? 'bg-black border-2 border-yellow-400 text-yellow-300'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3.5 shadow-sm">
              <Headset className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-sm leading-snug">
                {t.navHelpline}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {t.voiceCallKvk}
              </p>
            </div>
          </button>

          {/* Card 3: Weather Forecast */}
          <button
            id="quick-card-weather"
            onClick={() => setActiveTab('weather')}
            className={`p-4 sm:p-5 rounded-3xl border text-left flex flex-col justify-between transition transform active:scale-95 shadow-sm ${
              userProfile.highContrastMode
                ? 'bg-black border-2 border-yellow-400 text-yellow-300'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-sky-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3.5 shadow-sm">
              <CloudSunRain className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-sm leading-snug">
                {t.navWeather}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {t.rainSprayTimings}
              </p>
            </div>
          </button>

          {/* Card 4: Farm Notebook */}
          <button
            id="quick-card-diary"
            onClick={() => setActiveTab('diary')}
            className={`p-4 sm:p-5 rounded-3xl border text-left flex flex-col justify-between transition transform active:scale-95 shadow-sm ${
              userProfile.highContrastMode
                ? 'bg-black border-2 border-yellow-400 text-yellow-300'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3.5 shadow-sm">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-sm leading-snug">
                {t.navDiary}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {diaryEntries.length} {t.fieldRecords}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Latest Scan Result (Follow-up & Dosage) */}
      {latestScan && (
        <div className={`rounded-3xl p-5 sm:p-6 border transition shadow-sm ${
          userProfile.highContrastMode
            ? 'bg-black border-2 border-yellow-400 text-yellow-300'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="font-black text-sm uppercase tracking-wider text-emerald-800">
                {t.latestDiagnosis}
              </h3>
            </div>
            <button
              onClick={() => handleSpeak(latestScan.audioSummaryText || `${latestScan.cropName}: ${latestScan.diseaseOrPestName}`)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-black transition"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>{t.listenToDoctor}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            {latestScan.imageUrl && (
              <div className="w-full sm:w-32 h-32 rounded-2xl border border-slate-200 shadow-sm shrink-0 overflow-hidden">
                <SafeImage 
                  src={latestScan.imageUrl} 
                  alt={latestScan.diseaseOrPestName}
                  cropName={latestScan.cropName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                  {latestScan.cropName}
                </span>
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg uppercase ${
                  latestScan.severity === 'severe' 
                    ? 'bg-rose-100 text-rose-800' 
                    : latestScan.severity === 'moderate'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {latestScan.severity} {t.severityLevel}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {latestScan.confidenceScore}% {t.aiConfidence}
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {latestScan.diseaseOrPestName}
              </h4>
              <p className="text-xs text-slate-500 italic font-medium">
                {latestScan.scientificName}
              </p>

              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  id="view-treatment-guide-btn"
                  onClick={() => setActiveTab('medicine')}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-emerald-200 transition active:scale-95"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>{t.viewTreatmentPlan}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTab('helpline')}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-2 transition"
                >
                  <Headset className="w-4 h-4 text-indigo-600" />
                  <span>{t.askExpertAboutThis}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. 1-Tap Farm Diary Quick Logger */}
      <div className={`rounded-3xl p-5 sm:p-6 border transition shadow-sm ${
        userProfile.highContrastMode 
          ? 'bg-black border-2 border-yellow-400 text-yellow-300' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div>
            <h3 className="font-black text-sm text-slate-800">
              {t.oneTapLog}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t.quickRecordWork}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('diary')}
            className="text-xs font-black text-emerald-700 hover:underline"
          >
            {t.viewAllDiary} &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            id="quick-log-water"
            onClick={() => onQuickLog('watering')}
            className="px-3.5 py-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-950 font-bold text-xs flex items-center gap-2 transition shadow-sm active:scale-95"
          >
            <span className="text-lg">💧</span>
            <span>{t.quickLogWatering}</span>
          </button>

          <button
            id="quick-log-fertilizer"
            onClick={() => onQuickLog('fertilizer')}
            className="px-3.5 py-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-2 transition shadow-sm active:scale-95"
          >
            <span className="text-lg">🧪</span>
            <span>{t.quickLogFertilizer}</span>
          </button>

          <button
            id="quick-log-spray"
            onClick={() => onQuickLog('pesticide')}
            className="px-3.5 py-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-purple-950 font-bold text-xs flex items-center gap-2 transition shadow-sm active:scale-95"
          >
            <span className="text-lg">🚿</span>
            <span>{t.quickLogSpray}</span>
          </button>

          <button
            id="quick-log-planting"
            onClick={() => onQuickLog('planting')}
            className="px-3.5 py-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2 transition shadow-sm active:scale-95"
          >
            <span className="text-lg">🌱</span>
            <span>{t.quickLogPlanting}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
