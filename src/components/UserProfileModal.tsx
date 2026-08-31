import React from 'react';
import { UserProfile, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { translateCrop, translateSoilType } from '../utils/i18n';
import { 
  User, 
  MapPin, 
  Phone, 
  Globe, 
  Sun, 
  Volume2, 
  Check, 
  Sprout, 
  LandPlot,
  Layers
} from 'lucide-react';

interface UserProfileModalProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onClose: () => void;
  onAutoDetectLocation?: () => void;
  isLocating?: boolean;
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

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userProfile,
  setUserProfile,
  onClose,
  onAutoDetectLocation,
  isLocating = false
}) => {
  const t = translations[userProfile.languagePreference] || translations.en;
  const lang = userProfile.languagePreference;

  const handleToggleCrop = (crop: string) => {
    setUserProfile(prev => {
      const exists = prev.primaryCrops.includes(crop);
      if (exists) {
        if (prev.primaryCrops.length <= 1) return prev; // Keep at least 1
        return { ...prev, primaryCrops: prev.primaryCrops.filter(c => c !== crop) };
      } else {
        return { ...prev, primaryCrops: [...prev.primaryCrops, crop] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[36px] p-7 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shadow-sm overflow-hidden border border-emerald-200">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-['Outfit']"> {t.farmerProfileSettings} </h3>
              <p className="text-xs text-slate-500 font-medium"> {t.personalizedAdvisory} </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 font-bold transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Name & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-slate-700 mb-1"> {t.farmerName} </label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-black text-slate-700 mb-1"> {t.mobileNumber} </label>
              <input
                type="text"
                value={userProfile.phoneNumber}
                onChange={(e) => setUserProfile(p => ({ ...p, phoneNumber: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Location & GPS Auto-Detection */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <label className="font-black text-slate-800">
                  {t.fieldLocationRadarLabel}
                </label>
              </div>

              {onAutoDetectLocation && (
                <button
                  type="button"
                  onClick={onAutoDetectLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black text-[11px] flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce' : ''}`} />
                  <span>{isLocating ? t.locatingGpsShort : t.autoDetectLocation}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t.villageLabel}:
                </label>
                <input
                  type="text"
                  value={userProfile.village}
                  onChange={(e) => setUserProfile(p => ({ ...p, village: e.target.value }))}
                  placeholder="Village name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t.districtStateLabel}:
                </label>
                <input
                  type="text"
                  value={`${userProfile.district}${userProfile.state ? ', ' + userProfile.state : ''}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setUserProfile(p => ({ 
                      ...p, 
                      district: parts[0]?.trim() || '', 
                      state: parts[1]?.trim() || p.state 
                    }));
                  }}
                  placeholder="District, State"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* GPS coordinates readout */}
            {(userProfile.latitude || userProfile.longitude) && (
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1">
                  📍 {t.coordinatesLabel}: <strong className="text-slate-800 font-mono">{userProfile.latitude?.toFixed(4)}°N, {userProfile.longitude?.toFixed(4)}°E</strong>
                </span>
                {userProfile.locationAccuracyMeters && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {t.gpsAccuracyLabel}: ±{userProfile.locationAccuracyMeters}m
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Farm Size */}
          <div>
            <label className="block font-black text-slate-700 mb-1">
              {t.farmSizeAcresLabel}:
            </label>
            <input
              type="number"
              value={userProfile.farmSizeAcres}
              onChange={(e) => setUserProfile(p => ({ ...p, farmSizeAcres: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="block font-black text-slate-700 mb-1.5">
              {t.soilTypeLabel}:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Black Clayey Soil', 'Red Loamy Soil', 'Sandy Loam'].map(soil => (
                <button
                  key={soil}
                  type="button"
                  onClick={() => setUserProfile(p => ({ ...p, soilType: soil }))}
                  className={`p-2.5 rounded-2xl text-center font-black border transition active:scale-95 ${
                    userProfile.soilType === soil
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {translateSoilType(soil, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Crops Cultivated */}
          <div>
            <label className="block font-black text-slate-700 mb-2">
              {t.cropsYouGrowLabel}:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {['Tomato', 'Cotton', 'Rice', 'Wheat', 'Chili', 'Potato', 'Corn', 'Soybean', 'Onion', 'Sugarcane'].map(crop => {
                const isSelected = userProfile.primaryCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => handleToggleCrop(crop)}
                    className={`px-3.5 py-2 rounded-2xl font-black flex items-center gap-1.5 transition active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{translateCrop(crop, lang)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accessibility Toggles */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3.5">
            <h4 className="font-black text-slate-900 font-['Outfit']">
              {t.accessibilityPreferencesHeading}
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-slate-900 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.autoReadDiagnosesLabel}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {t.autoReadDiagnosesDesc}
                </p>
              </div>

              <input
                type="checkbox"
                checked={userProfile.voiceAutoRead}
                onChange={(e) => setUserProfile(p => ({ ...p, voiceAutoRead: e.target.checked }))}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-slate-900 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{t.sunlightContrastLabel}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {t.sunlightContrastDesc}
                </p>
              </div>

              <input
                type="checkbox"
                checked={userProfile.highContrastMode}
                onChange={(e) => setUserProfile(p => ({ ...p, highContrastMode: e.target.checked }))}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-200 active:scale-95 transition"
          >
            {t.saveReturnBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
