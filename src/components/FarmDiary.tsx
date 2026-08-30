import React, { useState } from 'react';
import { UserProfile, FarmDiaryEntry, ActivityType } from '../types';
import { translations } from '../data/translations';
import { SafeImage } from './SafeImage';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Droplets, 
  Sprout, 
  FlaskConical, 
  Bug, 
  Scissors, 
  Wheat, 
  Volume2, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Image as ImageIcon,
  Clock,
  Sparkles
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface FarmDiaryProps {
  userProfile: UserProfile;
  diaryEntries: FarmDiaryEntry[];
  onAddEntry: (entry: Partial<FarmDiaryEntry>) => void;
  onDeleteEntry: (id: string) => void;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const activityConfig: Record<ActivityType, { label: string; icon: string; color: string; badgeBg: string }> = {
  planting: { label: 'Sowing / Planting', icon: '🌱', color: 'text-emerald-700', badgeBg: 'bg-emerald-100' },
  watering: { label: 'Irrigation / Watering', icon: '💧', color: 'text-blue-700', badgeBg: 'bg-blue-100' },
  fertilizer: { label: 'Fertilizer Application', icon: '🧪', color: 'text-amber-700', badgeBg: 'bg-amber-100' },
  pesticide: { label: 'Pesticide / Medicine Spray', icon: '🚿', color: 'text-purple-700', badgeBg: 'bg-purple-100' },
  weeding: { label: 'Weeding & Pruning', icon: '✂️', color: 'text-stone-700', badgeBg: 'bg-stone-100' },
  harvest: { label: 'Harvesting', icon: '🌾', color: 'text-yellow-700', badgeBg: 'bg-yellow-100' },
  pest_sighting: { label: 'Pest / Disease Sighting', icon: '🐛', color: 'text-rose-700', badgeBg: 'bg-rose-100' },
  soil_treatment: { label: 'Soil Treatment', icon: '🪵', color: 'text-amber-900', badgeBg: 'bg-amber-50' },
  note: { label: 'General Note', icon: '📝', color: 'text-stone-700', badgeBg: 'bg-stone-100' }
};

export const FarmDiary: React.FC<FarmDiaryProps> = ({
  userProfile,
  diaryEntries,
  onAddEntry,
  onDeleteEntry,
  setIsAudioPlaying
}) => {
  const t = translations[userProfile.languagePreference] || translations.en;

  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Form State for new entry
  const [formCrop, setFormCrop] = useState<string>(userProfile.primaryCrops[0] || 'Tomato');
  const [formPlot, setFormPlot] = useState<string>('Main Field (Plot 1)');
  const [formActivity, setFormActivity] = useState<ActivityType>('watering');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState<string>('');
  const [formQuantity, setFormQuantity] = useState<string>('');
  const [formUnit, setFormUnit] = useState<string>('hours drip');
  const [formChemical, setFormChemical] = useState<string>('');

  // Filter entries by crop
  const filteredEntries = diaryEntries.filter(entry => {
    if (selectedCropFilter === 'all') return true;
    return entry.cropName.toLowerCase() === selectedCropFilter.toLowerCase();
  });

  // Read aloud helper
  const handleSpeak = (text: string) => {
    setIsAudioPlaying(true);
    speakText(text, userProfile.languagePreference, () => setIsAudioPlaying(false));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry({
      cropName: formCrop,
      plotName: formPlot,
      activityType: formActivity,
      date: formDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: formNotes || `${activityConfig[formActivity].label} on ${formCrop}`,
      quantity: formQuantity ? parseFloat(formQuantity) : undefined,
      unit: formUnit,
      chemicalUsed: formChemical || undefined,
      status: 'completed'
    });

    setModalOpen(false);
    setFormNotes('');
    setFormQuantity('');
    setFormChemical('');
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border transition shadow-sm ${
        userProfile.highContrastMode
          ? 'bg-black border-2 border-yellow-400 text-yellow-300'
          : 'bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 border-emerald-800'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider text-emerald-100">
                Farm Digital Notebook
              </span>
              <span className="text-xs text-emerald-200 font-bold">
                {diaryEntries.length} Total Activities Saved
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
              {t.diaryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5 font-medium">
              Log planting, watering, fertilizers, and sprays for complete farm history
            </p>
          </div>

          <button
            id="open-new-diary-modal-btn"
            onClick={() => setModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-2 shadow-md active:scale-95 transition shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.newEntryBtn}</span>
          </button>
        </div>
      </div>

      {/* 1-Tap Quick Action Buttons (Designed for fast mobile input) */}
      <div className={`p-5 sm:p-6 rounded-[36px] border ${
        userProfile.highContrastMode ? 'bg-black border-yellow-400' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-3">
          1-Tap Quick Daily Actions:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onAddEntry({ activityType: 'watering', cropName: 'Tomato', notes: 'Standard morning drip irrigation completed.', quantity: 3, unit: 'hours', status: 'completed' })}
            className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-950 font-black text-xs flex items-center gap-2.5 transition active:scale-95 text-left shadow-sm"
          >
            <span className="text-xl">💧</span>
            <span>{t.quickLogWatering}</span>
          </button>

          <button
            onClick={() => onAddEntry({ activityType: 'fertilizer', cropName: 'Tomato', notes: 'Applied NPK 19:19:19 fertigation via drip.', quantity: 5, unit: 'kg', status: 'completed' })}
            className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-950 font-black text-xs flex items-center gap-2.5 transition active:scale-95 text-left shadow-sm"
          >
            <span className="text-xl">🧪</span>
            <span>{t.quickLogFertilizer}</span>
          </button>

          <button
            onClick={() => onAddEntry({ activityType: 'pesticide', cropName: 'Tomato', notes: 'Sprayed Mancozeb preventative dose.', quantity: 2, unit: 'pumps (30L)', status: 'completed' })}
            className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-950 font-black text-xs flex items-center gap-2.5 transition active:scale-95 text-left shadow-sm"
          >
            <span className="text-xl">🚿</span>
            <span>{t.quickLogSpray}</span>
          </button>

          <button
            onClick={() => onAddEntry({ activityType: 'planting', cropName: 'Cotton', notes: 'Sowed seeds in North Plot with basal compost.', status: 'completed' })}
            className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 font-black text-xs flex items-center gap-2.5 transition active:scale-95 text-left shadow-sm"
          >
            <span className="text-xl">🌱</span>
            <span>{t.quickLogPlanting}</span>
          </button>
        </div>
      </div>

      {/* Filter by Crop */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-black text-slate-500">Filter:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCropFilter('all')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition ${
              selectedCropFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.allCrops}
          </button>

          {userProfile.primaryCrops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropFilter(crop)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black whitespace-nowrap transition ${
                selectedCropFilter.toLowerCase() === crop.toLowerCase()
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            {t.timelineHeading} ({filteredEntries.length})
          </h3>

          {filteredEntries.length > 0 && (
            <button
              onClick={() => {
                const summary = filteredEntries.map(e => `${e.date}: ${e.activityType} on ${e.cropName}. ${e.notes}`).join('. ');
                handleSpeak(`Here is your farm timeline history. ${summary}`);
              }}
              className="text-xs font-black text-emerald-700 flex items-center gap-1 hover:underline"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Timeline (Audio)</span>
            </button>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center rounded-[36px] bg-white border border-slate-200 space-y-2 shadow-sm">
            <div className="text-3xl">📖</div>
            <p className="text-sm font-bold text-slate-700">
              {t.noDiaryEntries}
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
            {filteredEntries.map((entry) => {
              const act = activityConfig[entry.activityType] || activityConfig.note;
              return (
                <div
                  key={entry.id}
                  id={`diary-entry-${entry.id}`}
                  className={`relative rounded-[36px] p-5 sm:p-6 border transition shadow-xl shadow-slate-100 ${
                    userProfile.highContrastMode
                      ? 'bg-black border-2 border-yellow-400 text-yellow-300'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {/* Timeline Dot Icon */}
                  <div className="absolute -left-6 top-6 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow ring-4 ring-white">
                    {act.icon}
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`text-[11px] font-black px-3 py-1 rounded-full ${act.badgeBg} ${act.color}`}>
                          {act.icon} {act.label}
                        </span>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-xl bg-slate-100 text-slate-800">
                          {entry.cropName}
                        </span>
                        {entry.plotName && (
                          <span className="text-[11px] text-slate-500 font-bold">
                            • {entry.plotName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mt-1">
                        {entry.notes}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-slate-900">
                        {entry.date}
                      </div>
                      {entry.time && (
                        <div className="text-[10px] text-slate-500 font-bold">
                          {entry.time}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Chemical metadata */}
                  {(entry.quantity || entry.chemicalUsed) && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-3 text-xs font-bold text-slate-700 flex-wrap">
                      {entry.quantity && (
                        <span className="p-2 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800">
                          Measure: <strong className="font-black">{entry.quantity} {entry.unit}</strong>
                        </span>
                      )}
                      {entry.chemicalUsed && (
                        <span className="p-2 px-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 font-bold">
                          Chemical: <strong className="font-black">{entry.chemicalUsed}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Linked Disease Photo if any */}
                  {entry.imageUrl && (
                    <div className="mt-3.5 rounded-2xl overflow-hidden border border-slate-200 h-36 max-w-xs shadow-sm">
                      <SafeImage 
                        src={entry.imageUrl} 
                        alt="Crop log"
                        cropName={entry.cropName}
                        fallbackType="crop"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleSpeak(`${entry.activityType} on ${entry.cropName}. ${entry.notes}`)}
                      className="text-[11px] font-black text-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.speakText}</span>
                    </button>

                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Farm Activity Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[36px] p-7 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                {t.newEntryBtn}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Crop:
                  </label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {userProfile.primaryCrops.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Activity Type:
                  </label>
                  <select
                    value={formActivity}
                    onChange={(e) => setFormActivity(e.target.value as ActivityType)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="watering">💧 Watering / Irrigation</option>
                    <option value="fertilizer">🧪 Fertilizer Application</option>
                    <option value="pesticide">🚿 Pesticide / Medicine Spray</option>
                    <option value="planting">🌱 Sowing / Planting</option>
                    <option value="pest_sighting">🐛 Pest Sighting</option>
                    <option value="weeding">✂️ Weeding & Pruning</option>
                    <option value="harvest">🌾 Harvesting</option>
                    <option value="note">📝 General Farm Note</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Plot / Field Name:
                  </label>
                  <input
                    type="text"
                    value={formPlot}
                    onChange={(e) => setFormPlot(e.target.value)}
                    placeholder="e.g. East Plot (1.5 Acre)"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 text-xs text-slate-900 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity / Measure (Optional):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    placeholder="Amount (e.g. 5)"
                    className="w-1/2 px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 bg-slate-50 font-medium"
                  />
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="Unit (e.g. kg / hours / pumps)"
                    className="w-1/2 px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chemical or Fertilizer Name (Optional):
                </label>
                <input
                  type="text"
                  value={formChemical}
                  onChange={(e) => setFormChemical(e.target.value)}
                  placeholder="e.g. Mancozeb 75% WP or 19:19:19 NPK"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Field Notes & Observations:
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Watered field for 3 hours, crop looks healthy"
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-200 transition"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
