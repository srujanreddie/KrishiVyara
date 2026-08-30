import React from 'react';
import { UserProfile } from '../types';
import { translations } from '../data/translations';
import { 
  Home, 
  Camera, 
  FlaskConical, 
  CloudSunRain, 
  Headset, 
  BookOpen 
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'scanner' | 'medicine' | 'weather' | 'helpline' | 'diary';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  hasActiveScan: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  hasActiveScan
}) => {
  const t = translations[userProfile.languagePreference] || translations.en;

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: t.navHome,
      icon: Home,
      highlight: false
    },
    {
      id: 'scanner' as ActiveTab,
      label: t.navDoctor,
      icon: Camera,
      highlight: true
    },
    {
      id: 'medicine' as ActiveTab,
      label: t.navMedicine,
      icon: FlaskConical,
      highlight: false,
      badge: hasActiveScan ? 'New' : undefined
    },
    {
      id: 'weather' as ActiveTab,
      label: t.navWeather,
      icon: CloudSunRain,
      highlight: false
    },
    {
      id: 'helpline' as ActiveTab,
      label: t.navHelpline,
      icon: Headset,
      highlight: false
    },
    {
      id: 'diary' as ActiveTab,
      label: t.navDiary,
      icon: BookOpen,
      highlight: false
    }
  ];

  return (
    <nav 
      aria-label="Main Navigation"
      className={`fixed bottom-0 left-0 right-0 z-30 border-t transition-colors pb-safe ${
        userProfile.highContrastMode
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-700 shadow-2xl'
      }`}
    >
      <div className="max-w-4xl mx-auto px-3 py-2 flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isScanner = item.highlight;

          if (isScanner) {
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center -mt-6 px-3.5 py-1.5 rounded-3xl transition transform active:scale-95 ${
                  userProfile.highContrastMode
                    ? isActive
                      ? 'bg-yellow-400 text-black border-2 border-white ring-4 ring-yellow-400'
                      : 'bg-zinc-800 text-yellow-300 border-2 border-yellow-400'
                    : isActive
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-300/60 ring-4 ring-emerald-100'
                    : 'bg-emerald-600 text-emerald-50 hover:bg-emerald-500 shadow-lg shadow-emerald-200'
                }`}
                style={{ minWidth: '68px', minHeight: '64px' }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20">
                  <Icon className="w-5 h-5 text-current stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black tracking-tight mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-2.5 rounded-2xl transition flex-1 min-w-[50px] min-h-[50px] active:scale-95 ${
                isActive
                  ? userProfile.highContrastMode
                    ? 'bg-yellow-400 text-black font-black'
                    : 'bg-emerald-50 text-emerald-800 font-black'
                  : userProfile.highContrastMode
                  ? 'text-yellow-400/70 hover:text-yellow-300'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/60'
              }`}
            >
              {item.badge && (
                <span className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-ping" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5] text-emerald-700' : 'stroke-2'}`} />
              <span className="text-[10px] sm:text-[11px] font-bold leading-tight mt-1 whitespace-nowrap truncate max-w-[65px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
