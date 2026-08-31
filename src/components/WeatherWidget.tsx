import React, { useState } from 'react';
import { UserProfile, CurrentWeatherState, WeatherForecastDay } from '../types';
import { translations } from '../data/translations';
import { 
  translateDay, 
  translateWeatherCondition, 
  translateSpraySuitability 
} from '../utils/i18n';
import { 
  CloudSunRain, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  Clock, 
  Thermometer, 
  Calendar,
  Sparkles,
  Zap,
  MapPin,
  RefreshCw,
  Navigation,
  Compass
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface WeatherWidgetProps {
  userProfile: UserProfile;
  weather: CurrentWeatherState;
  setWeather: React.Dispatch<React.SetStateAction<CurrentWeatherState>>;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  onAutoDetectLocation?: () => void;
  isLocating?: boolean;
  locatingStage?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  userProfile,
  weather,
  setWeather,
  setIsAudioPlaying,
  onAutoDetectLocation,
  isLocating = false,
  locatingStage = ''
}) => {
  const t = translations[userProfile.languagePreference] || translations.en;
  const lang = userProfile.languagePreference;

  const [selectedDay, setSelectedDay] = useState<WeatherForecastDay>(weather.forecast[0]);
  const [simulationMode, setSimulationMode] = useState<'normal' | 'rain' | 'heat'>('normal');

  // Read aloud helper
  const handleSpeak = (text: string) => {
    setIsAudioPlaying(true);
    speakText(text, userProfile.languagePreference, () => setIsAudioPlaying(false));
  };

  // Weather simulation toggles
  const handleSimulateCondition = (mode: 'normal' | 'rain' | 'heat') => {
    setSimulationMode(mode);
    if (mode === 'rain') {
      setWeather(prev => ({
        ...prev,
        isRainImminent: true,
        isHeatWaveRisk: false,
        rainProbabilityNext4h: 90,
        condition: 'Thunderstorm Forecast',
        dangerAlerts: [
          {
            type: 'rain_wash',
            severity: 'danger',
            title: `🚨 ${t.rainWashHeading}`,
            description: t.rainWashDesc,
            actionNeeded: t.postponeSprayingAction
          }
        ]
      }));
    } else if (mode === 'heat') {
      setWeather(prev => ({
        ...prev,
        isRainImminent: false,
        isHeatWaveRisk: true,
        temperature: 39,
        rainProbabilityNext4h: 5,
        condition: 'Extreme Heat Wave',
        dangerAlerts: [
          {
            type: 'heat_pest_spike',
            severity: 'warning',
            title: `🔥 ${t.heatSpikeHeading}`,
            description: t.heatSpikeDesc,
            actionNeeded: t.heatActionNeeded
          }
        ]
      }));
    } else {
      setWeather(prev => ({
        ...prev,
        isRainImminent: false,
        isHeatWaveRisk: false,
        temperature: 32,
        rainProbabilityNext4h: 15,
        condition: 'Partly Cloudy',
        dangerAlerts: [
          {
            type: 'optimal_spray',
            severity: 'info',
            title: `🌤️ ${t.favorableWindowHeading}`,
            description: t.favorableWindowDesc,
            actionNeeded: t.prepareSolutionAction
          }
        ]
      }));
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className={`p-5 rounded-3xl border transition shadow-sm ${
        userProfile.highContrastMode
          ? 'bg-black border-2 border-yellow-400 text-yellow-300'
          : 'bg-sky-800 text-white shadow-lg shadow-sky-200/50 border-sky-900'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider text-sky-100">
                {t.fieldRadarTitle}
              </span>
              <span className="text-xs text-sky-200 font-bold">
                {weather.locationName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
              {t.weatherTitle}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 mt-0.5 font-medium">
              {t.weatherSubtitle}
            </p>
          </div>

          <button
            onClick={() => handleSpeak(`${weather.dangerAlerts[0]?.title || t.weatherTitle}. ${weather.dangerAlerts[0]?.description || ''}`)}
            className="p-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md font-black text-xs flex items-center gap-2 shrink-0 active:scale-95 transition"
            title={t.speakText}
          >
            <Volume2 className="w-5 h-5" />
            <span className="hidden sm:inline">{t.speakText}</span>
          </button>
        </div>
      </div>

      {/* GPS Field Location Radar & Auto-Detection Card */}
      <div className="p-5 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-2xl shrink-0 ${
              isLocating 
                ? 'bg-emerald-500 text-white animate-pulse'
                : weather.isAutoDetected 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              <MapPin className={`w-5 h-5 ${isLocating ? 'animate-bounce' : 'stroke-[2.5]'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  weather.isAutoDetected 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {weather.isAutoDetected ? `📍 ${t.gpsVerified}` : `📍 ${t.farmLocationLabel}`}
                </span>
                {weather.locationAccuracyMeters && (
                  <span className="text-[10px] font-bold text-slate-500">
                    {t.accuracyLabel}: ±{weather.locationAccuracyMeters}m
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-slate-900 font-['Outfit'] mt-1">
                {weather.locationName}
              </h3>
              {(weather.latitude || weather.longitude) && (
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Coords: {weather.latitude?.toFixed(4)}°N, {weather.longitude?.toFixed(4)}°E
                  {weather.lastUpdatedTime && ` • ${t.syncedAtLabel} ${weather.lastUpdatedTime}`}
                </p>
              )}
            </div>
          </div>

          {/* Action Button: Auto-Detect GPS / Refresh */}
          {onAutoDetectLocation && (
            <button
              id="weather-auto-detect-gps-btn"
              onClick={onAutoDetectLocation}
              disabled={isLocating}
              className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-md shrink-0 ${
                isLocating
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-wait'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating 
                  ? (locatingStage === 'locating_gps' 
                      ? t.acquiringGps 
                      : locatingStage === 'reverse_geocoding' 
                      ? t.resolvingDistrict 
                      : t.syncingRadar)
                  : t.autoDetectLocation}
              </span>
            </button>
          )}
        </div>

        {isLocating && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-bold animate-pulse">
            <Compass className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>{t.scanningWeatherStation}</span>
          </div>
        )}
      </div>

      {/* Simulator Control for Farmer Testing & Demonstration */}
      <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600 stroke-[2.5]" />
          <span className="text-xs font-black text-slate-800">
            {t.simulateWeatherAlarms}:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="sim-normal"
            onClick={() => handleSimulateCondition('normal')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition active:scale-95 ${
              simulationMode === 'normal'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            🌤️ {t.normalClearSim}
          </button>

          <button
            id="sim-rain"
            onClick={() => handleSimulateCondition('rain')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition active:scale-95 ${
              simulationMode === 'rain'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200 animate-pulse'
                : 'bg-white text-rose-800 border border-rose-300 hover:bg-rose-50'
            }`}
          >
            🌧️ {t.rainWashAlarmSim}
          </button>

          <button
            id="sim-heat"
            onClick={() => handleSimulateCondition('heat')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition active:scale-95 ${
              simulationMode === 'heat'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-50'
            }`}
          >
            🔥 {t.heatSpikeAlarmSim}
          </button>
        </div>
      </div>

      {/* Active Danger Alarms Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          {t.dangerAlertHeader}
        </h3>

        {weather.dangerAlerts.map((alert, idx) => (
          <div
            key={idx}
            id={`danger-alert-${idx}`}
            className={`p-6 sm:p-7 rounded-[36px] border transition shadow-xl ${
              alert.severity === 'danger'
                ? 'bg-rose-50 border-2 border-rose-500 text-rose-950 shadow-rose-100 ring-4 ring-rose-200/50'
                : alert.severity === 'warning'
                ? 'bg-amber-50 border-2 border-amber-400 text-amber-950 shadow-amber-100'
                : userProfile.highContrastMode
                ? 'bg-black border-2 border-yellow-400 text-yellow-300'
                : 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950 shadow-emerald-100'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl shrink-0 shadow-sm ${
                  alert.severity === 'danger'
                    ? 'bg-rose-600 text-white'
                    : alert.severity === 'warning'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {alert.severity === 'danger' ? (
                    <CloudRain className="w-7 h-7 animate-bounce stroke-[2.5]" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
                  ) : (
                    <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      alert.severity === 'danger' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {alert.severity === 'danger' ? t.criticalActionLabel : t.advisoryLabel}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug font-['Outfit']">
                    {alert.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {alert.description}
                  </p>

                  <div className="pt-2">
                    <div className="p-3.5 rounded-2xl bg-white/95 border border-slate-200 text-xs font-bold text-slate-900 shadow-sm">
                      👉 <strong className="font-black">{t.recommendedAction}:</strong> {alert.actionNeeded}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSpeak(`${alert.title}. ${alert.description}. ${t.recommendedAction}: ${alert.actionNeeded}`)}
                className="p-3 rounded-2xl bg-white shadow-sm border border-slate-200 text-slate-800 hover:bg-slate-50 shrink-0 active:scale-95 transition"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Current Agro-Climatic Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-5 rounded-3xl border text-center shadow-sm ${
          userProfile.highContrastMode ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-slate-200'
        }`}>
          <div className="text-2xl mb-1">🌡️</div>
          <div className="text-xl font-black text-slate-900">{weather.temperature}°C</div>
          <div className="text-xs text-slate-500 font-bold">{t.temperatureLabel}</div>
        </div>

        <div className={`p-5 rounded-3xl border text-center shadow-sm ${
          userProfile.highContrastMode ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-slate-200'
        }`}>
          <div className="text-2xl mb-1">💧</div>
          <div className="text-xl font-black text-slate-900">{weather.humidity}%</div>
          <div className="text-xs text-slate-500 font-bold">{t.humidityLabel}</div>
        </div>

        <div className={`p-5 rounded-3xl border text-center shadow-sm ${
          userProfile.highContrastMode ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-slate-200'
        }`}>
          <div className="text-2xl mb-1">🌧️</div>
          <div className="text-xl font-black text-slate-900">{weather.rainProbabilityNext4h}%</div>
          <div className="text-xs text-slate-500 font-bold">{t.rainProbabilityLabel}</div>
        </div>

        <div className={`p-5 rounded-3xl border text-center shadow-sm ${
          userProfile.highContrastMode ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-slate-200'
        }`}>
          <div className="text-2xl mb-1">💨</div>
          <div className="text-xl font-black text-slate-900">{weather.windSpeedKmh} km/h</div>
          <div className="text-xs text-slate-500 font-bold">{t.windSpeedLabel}</div>
        </div>
      </div>

      {/* 7-Day Weekly Agro-Weather & Spraying Index Forecast */}
      <div className={`rounded-[36px] p-6 sm:p-8 border transition shadow-xl shadow-slate-100 space-y-4 ${
        userProfile.highContrastMode ? 'bg-black border-2 border-yellow-400 text-yellow-300' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
              {t.weeklyForecastHeading}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t.weeklyForecastSubtitle}
            </p>
          </div>
          <Calendar className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
        </div>

        <div className="space-y-2.5">
          {weather.forecast.map((day, idx) => {
            const translatedDayName = translateDay(day.day, lang);
            const translatedCond = translateWeatherCondition(day.condition, lang);
            const suitability = translateSpraySuitability(day.spraySuitability, lang);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDay(day)}
                className={`p-4 rounded-3xl border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  selectedDay.day === day.day
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-400 shadow-sm'
                    : 'hover:bg-slate-50 border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 text-center">
                    <div className="text-xs font-black text-slate-900">{translatedDayName}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{day.date}</div>
                  </div>

                  <div className="text-2xl">
                    {day.condition.includes('Rain') ? '🌧️' : day.condition.includes('Sun') ? '☀️' : '⛅'}
                  </div>

                  <div>
                    <div className="text-xs font-black text-slate-800">
                      {translatedCond} • {day.tempMax}°C / {day.tempMin}°C
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {t.rainChanceLabel}: <strong className="text-slate-700">{day.rainProbability}%</strong> | {t.windSpeedLabel}: {day.windSpeedKmh} km/h
                    </div>
                  </div>
                </div>

                {/* Spray Suitability Badge */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider ${
                    day.spraySuitability === 'excellent'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : day.spraySuitability === 'danger'
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {suitability.icon} {suitability.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
