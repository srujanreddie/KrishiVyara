import React from 'react';
import { UserProfile, LanguageCode, CurrentWeatherState } from '../types';
import { translations } from '../data/translations';
import { translateWeatherCondition } from '../utils/i18n';
import { 
  Sprout, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Globe, 
  User, 
  CloudSun,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { stopSpeaking, isSpeaking } from '../utils/speech';

interface HeaderProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  weather: CurrentWeatherState;
  onOpenProfile: () => void;
  isAudioPlaying: boolean;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const languages: { code: LanguageCode; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili' }
];

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  setUserProfile,
  weather,
  onOpenProfile,
  isAudioPlaying,
  setIsAudioPlaying
}) => {
  const t = translations[userProfile.languagePreference] || translations.en;

  const handleLanguageChange = (lang: LanguageCode) => {
    setUserProfile(prev => ({ ...prev, languagePreference: lang }));
  };

  const handleAudioToggle = () => {
    if (isAudioPlaying || isSpeaking()) {
      stopSpeaking();
      setIsAudioPlaying(false);
    }
  };

  const translatedCondition = translateWeatherCondition(weather.condition, userProfile.languagePreference);

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${
      userProfile.highContrastMode 
        ? 'bg-black text-yellow-300 border-yellow-400' 
        : 'bg-emerald-700 text-white border-emerald-800 shadow-lg shadow-emerald-950/10'
    }`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
            userProfile.highContrastMode 
              ? 'bg-yellow-400 text-black' 
              : 'bg-white text-emerald-600'
          }`}>
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg sm:text-xl tracking-tight leading-tight truncate font-['Outfit']">
                {t.appName}
              </h1>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                userProfile.highContrastMode 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-emerald-800 text-emerald-100 border border-emerald-600/50'
              }`}>
                Kisan AI
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 truncate hidden sm:block font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center: Weather Quick Chip */}
        <div className={`hidden md:flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold ${
          weather.isRainImminent || weather.isHeatWaveRisk
            ? 'bg-rose-950/90 text-rose-100 border border-rose-400/60 animate-pulse'
            : userProfile.highContrastMode 
            ? 'bg-zinc-900 text-yellow-300 border border-yellow-500' 
            : 'bg-emerald-800/80 text-emerald-50 border border-emerald-600/40 shadow-inner'
        }`}>
          <CloudSun className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{weather.temperature}°C • {translatedCondition}</span>
          <span className="opacity-40">|</span>
          <span className={`flex items-center gap-1 ${
            weather.isRainImminent ? 'text-rose-300 font-black' : 'text-emerald-200 font-bold'
          }`}>
            {weather.isRainImminent ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                {t.rainRiskChip}
              </>
            ) : (
              t.safeToSprayChip
            )}
          </span>
        </div>

        {/* Right Controls: Audio Mute, High Contrast Mode, Language Selector, Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Audio Narration Indicator / Stop */}
          {isAudioPlaying && (
            <button
              id="audio-control-btn"
              onClick={handleAudioToggle}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 text-amber-950 font-black text-xs animate-bounce shadow-md"
              title={t.stopAudio}
            >
              <Volume2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">{t.stopAudio}</span>
            </button>
          )}

          {/* High Contrast / Outdoor Sunlight Mode Toggle */}
          <button
            id="high-contrast-toggle"
            onClick={() => setUserProfile(p => ({ ...p, highContrastMode: !p.highContrastMode }))}
            className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
              userProfile.highContrastMode
                ? 'bg-yellow-400 text-black ring-2 ring-white'
                : 'bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/40 shadow-sm'
            }`}
            title={userProfile.highContrastMode ? t.sunModeOn : t.sunMode}
            aria-label="High contrast sunlight mode"
          >
            {userProfile.highContrastMode ? (
              <Sun className="w-4 h-4 text-black stroke-[2.5]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300 stroke-[2.5]" />
            )}
            <span className="text-[11px] font-black hidden lg:inline">
              {userProfile.highContrastMode ? t.sunModeOn : t.sunMode}
            </span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <select
              id="language-select"
              value={userProfile.languagePreference}
              onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
              aria-label="Select Language"
              className={`appearance-none pl-8 pr-7 py-2 rounded-2xl text-xs font-black cursor-pointer transition focus:outline-none focus:ring-2 ${
                userProfile.highContrastMode
                  ? 'bg-black text-yellow-300 border-2 border-yellow-400 focus:ring-yellow-300'
                  : 'bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-600/40 focus:ring-emerald-300 shadow-sm'
              }`}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white py-1">
                  {l.native} ({l.label})
                </option>
              ))}
            </select>
            <Globe className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] opacity-70">
              ▼
            </span>
          </div>

          {/* Farmer Profile Button */}
          <button
            id="user-profile-btn"
            onClick={onOpenProfile}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition active:scale-95 ${
              userProfile.highContrastMode
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 shadow-md'
            }`}
            title={t.farmerProfileSettings}
          >
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-current" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-4 h-4 stroke-[2.5]" />
            )}
            <span className="hidden sm:inline truncate max-w-[90px]">
              {userProfile.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
