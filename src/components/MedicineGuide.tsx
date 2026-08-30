import React, { useState } from 'react';
import { UserProfile, CropScanResult } from '../types';
import { translations } from '../data/translations';
import { sampleDiseases } from '../data/mockData';
import { ActiveTab } from './Navigation';
import { 
  FlaskConical, 
  Leaf, 
  Clock, 
  ShieldAlert, 
  Volume2, 
  Calendar, 
  Check, 
  HelpCircle, 
  ArrowLeft,
  Sparkles,
  Droplets,
  DollarSign,
  BookmarkPlus,
  Headset,
  Sun,
  Sunset,
  Sunrise,
  Shield,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface MedicineGuideProps {
  userProfile: UserProfile;
  activeScan: CropScanResult | null;
  onSelectScan: (scan: CropScanResult) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onSaveToDiary: (scan: CropScanResult, dosageDetails?: string) => void;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MedicineGuide: React.FC<MedicineGuideProps> = ({
  userProfile,
  activeScan,
  onSelectScan,
  setActiveTab,
  onSaveToDiary,
  setIsAudioPlaying
}) => {
  const t = translations[userProfile.languagePreference] || translations.en;
  
  // Use active scan or default to first sample
  const scan = activeScan || sampleDiseases[0];

  // Interactive Sprayer Pump Tank Size (Liters)
  const [tankSizeLiters, setTankSizeLiters] = useState<number>(15);
  const [activeRemedyTab, setActiveRemedyTab] = useState<'chemical' | 'organic'>('chemical');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Read aloud helper
  const handleSpeak = (text: string) => {
    setIsAudioPlaying(true);
    speakText(text, userProfile.languagePreference, () => setIsAudioPlaying(false));
  };

  // Calculated dosages based on pump tank size
  const dosePerLiter = scan.chemicalTreatment.mlOrGramsPerLiter || 2.5;
  const totalDoseGramsOrMl = (dosePerLiter * tankSizeLiters).toFixed(1);
  const totalSpoons = (parseFloat(totalDoseGramsOrMl) / 15).toFixed(1); // Assuming 1 standard tablespoon ~ 15g/ml
  const roundedSpoons = Math.round(parseFloat(totalSpoons) * 2) / 2; // nearest 0.5

  // Render visual spoon icons
  const renderVisualSpoons = (numSpoons: number) => {
    const fullSpoons = Math.floor(numSpoons);
    const hasHalf = numSpoons % 1 !== 0;

    return (
      <div className="flex items-center gap-2 flex-wrap py-2">
        {Array.from({ length: fullSpoons }).map((_, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-100 border border-amber-300 shadow-sm"
          >
            <span className="text-2xl">🥄</span>
            <span className="text-[10px] font-extrabold text-amber-900 mt-0.5">1 Spoon</span>
          </div>
        ))}
        {hasHalf && (
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-100/70 border border-dashed border-amber-400 shadow-sm">
            <span className="text-xl opacity-80">🥄½</span>
            <span className="text-[10px] font-extrabold text-amber-900 mt-0.5">½ Spoon</span>
          </div>
        )}
      </div>
    );
  };

  const fullAudioScript = `Step by step medicine guide for ${scan.cropName} ${scan.diseaseOrPestName}. For a ${tankSizeLiters} liter pump, add ${roundedSpoons} tablespoons of ${scan.chemicalTreatment.name}. Mix well in clean water. Best time to spray is ${scan.bestSprayingTime.recommendedHours}. Please wear face mask and gloves.`;

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
                {scan.cropName} Treatment Plan
              </span>
              {scan.pathogenType && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase">
                  🔬 {scan.pathogenType}
                </span>
              )}
              <span className="text-xs text-emerald-200 font-bold">
                Diagnosis: {scan.diseaseOrPestName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
              {t.medicineGuideTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5 font-medium">
              Calculated for {scan.cropName} • Stage: {scan.infectionStage || 'Active'} • Loss Risk: {scan.yieldLossRiskPercent || 35}%
            </p>
          </div>

          <button
            id="speak-medicine-guide-btn"
            onClick={() => handleSpeak(fullAudioScript)}
            className="p-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md font-black text-xs flex items-center gap-2 shrink-0 active:scale-95 transition"
            title={t.speakText}
          >
            <Volume2 className="w-5 h-5" />
            <span className="hidden sm:inline">{t.speakText}</span>
          </button>
        </div>
      </div>

      {/* Infection Pathology Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Pathogen Agent</span>
          <span className="text-xs font-black text-slate-900 capitalize mt-0.5 block">
            {scan.pathogenType || 'Fungal'} Microorganism
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Infection Severity</span>
          <span className={`text-xs font-black uppercase mt-0.5 block ${
            scan.severity === 'severe' ? 'text-rose-600' : 'text-amber-600'
          }`}>
            {scan.severity} ({scan.yieldLossRiskPercent || 35}% Loss Risk)
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Contagion Rate</span>
          <span className="text-xs font-black text-slate-900 capitalize mt-0.5 block">
            {scan.spreadRisk || 'Moderate'} Spread Risk
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Safe Harvest PHI</span>
          <span className="text-xs font-black text-emerald-700 mt-0.5 block">
            {scan.chemicalTreatment.waitingPeriodDays} Days Wait Period
          </span>
        </div>
      </div>

      {/* Quick Switch for Other Crop Scans */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 shrink-0 px-1">
          Switch Disease:
        </span>
        {sampleDiseases.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelectScan(d)}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition shrink-0 ${
              scan.id === d.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-400'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
            }`}
          >
            {d.cropName}: {d.diseaseOrPestName.split('(')[0]}
          </button>
        ))}
      </div>

      {/* Interactive Knapsack Pump Dosage Calculator */}
      <div 
        id="dosage-calculator-card"
        className={`rounded-[36px] p-6 sm:p-8 border transition shadow-xl shadow-slate-100 ${
          userProfile.highContrastMode
            ? 'bg-black border-2 border-yellow-400 text-yellow-300'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xl shadow-sm">
              💧
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight font-['Outfit']">
                {t.dosageCalculatorTitle}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Select your sprayer tank size to see exact spoons needed
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
            {tankSizeLiters} Liters Tank
          </span>
        </div>

        {/* Tank Size Selector Chips */}
        <div className="space-y-2.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            {t.knapsackPumpSize}:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { size: 10, label: '10 Liters (Small)' },
              { size: 15, label: '15 Liters (Knapsack)' },
              { size: 16, label: '16 Liters (Standard)' },
              { size: 20, label: '20 Liters (Large Tank)' }
            ].map((item) => (
              <button
                key={item.size}
                id={`tank-size-${item.size}`}
                onClick={() => setTankSizeLiters(item.size)}
                className={`p-3.5 rounded-2xl border text-center transition active:scale-95 ${
                  tankSizeLiters === item.size
                    ? userProfile.highContrastMode
                      ? 'bg-yellow-400 text-black border-2 border-white font-black'
                      : 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-200 ring-2 ring-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold'
                }`}
              >
                <div className="text-lg font-black">{item.size} L</div>
                <div className="text-[10px] opacity-85 font-medium">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Dosage Output Box */}
        <div className="mt-5 p-5 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-950 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                {t.spoonsNeeded} for {tankSizeLiters}L Pump:
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-950 font-['Outfit'] mt-0.5">
                {roundedSpoons} Level Spoons <span className="text-sm font-bold opacity-75">({totalDoseGramsOrMl} {scan.chemicalTreatment.unitType})</span>
              </div>
            </div>

            <button
              onClick={() => handleSpeak(`For your ${tankSizeLiters} liter pump, add exactly ${roundedSpoons} level tablespoons of ${scan.chemicalTreatment.name}.`)}
              className="px-4 py-2 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>Hear Measure</span>
            </button>
          </div>

          {/* Visual Spoon Rendering */}
          <div>
            <span className="text-[11px] font-black text-amber-800">
              Visual Guide (No calculation needed):
            </span>
            {renderVisualSpoons(roundedSpoons)}
          </div>
          
          <div className="text-xs text-amber-900/90 font-medium flex items-center gap-1.5 pt-2 border-t border-amber-200/80">
            <span>💡</span>
            <span><strong>Tip:</strong> Always dissolve medicine in a small bucket of water first, then pour into spray tank through the strainer.</span>
          </div>
        </div>
      </div>

      {/* Tabs: Chemical vs Organic Desi Remedy */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-3xl border border-slate-200">
        <button
          id="remedy-tab-chemical"
          onClick={() => setActiveRemedyTab('chemical')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeRemedyTab === 'chemical'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-4 h-4 stroke-[2.5]" />
          <span>{t.chemicalMedicineHeading}</span>
        </button>

        <button
          id="remedy-tab-organic"
          onClick={() => setActiveRemedyTab('organic')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeRemedyTab === 'organic'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-4 h-4 stroke-[2.5]" />
          <span>{t.organicRemedyHeading}</span>
        </button>
      </div>

      {/* Tab 1 Content: Chemical Medicine Details */}
      {activeRemedyTab === 'chemical' && (
        <div className="space-y-4">
          <div className={`rounded-[36px] p-6 sm:p-8 border transition shadow-xl shadow-slate-100 space-y-4 ${
            userProfile.highContrastMode
              ? 'bg-black border-2 border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Recommended Safe Chemical
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1.5 font-['Outfit']">
                  {scan.chemicalTreatment.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Active Formula: {scan.chemicalTreatment.activeIngredient}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">
                  {t.costEstimate}
                </span>
                <span className="text-sm font-black text-emerald-700">
                  {scan.chemicalTreatment.estimatedCost}
                </span>
              </div>
            </div>

            {/* Common Trade / Market Brands */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                Ask Agri Shopkeeper For Any of These Brands:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {scan.chemicalTreatment.tradeNames.map((brand, i) => (
                  <span 
                    key={i}
                    className="px-3.5 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    🏷️ {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Waiting Period & Limit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-black text-amber-900 uppercase block">
                  {t.harvestSafetyDays} (PHI)
                </span>
                <div className="text-xl font-black text-amber-950 mt-0.5">
                  {scan.chemicalTreatment.waitingPeriodDays} Days
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5 font-medium">
                  Safe to harvest and eat after {scan.chemicalTreatment.waitingPeriodDays} days
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-black text-slate-700 uppercase block">
                  Max Sprays Per Season
                </span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {scan.chemicalTreatment.maxSpraysPerSeason} Times Max
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  Prevents pest immunity and soil toxicity
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 Content: Organic Desi Remedy */}
      {activeRemedyTab === 'organic' && (
        <div className={`rounded-[36px] p-6 sm:p-8 border transition shadow-xl shadow-slate-100 space-y-4 ${
          userProfile.highContrastMode
            ? 'bg-black border-2 border-yellow-400 text-yellow-300'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div>
            <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              🌿 Natural Desi Remedy
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1.5 font-['Outfit']">
              {scan.organicTreatment.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Low cost • Safe for honeybees • 100% Organic
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="text-xs font-black text-emerald-900 uppercase">
              Ingredients Needed:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-emerald-950">
              {scan.organicTreatment.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              Preparation Recipe:
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed p-4 rounded-3xl bg-slate-50 border border-slate-200 font-medium">
              {scan.organicTreatment.recipe}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-black text-slate-600 pt-1">
            <span>⏱️ Prep Time: {scan.organicTreatment.preparationTime}</span>
            <span>💧 Dose: {scan.organicTreatment.mixingRatio}</span>
          </div>
        </div>
      )}

      {/* 3. Best Time of Day to Spray Card */}
      <div className={`rounded-[36px] p-6 sm:p-8 border transition shadow-xl shadow-slate-100 space-y-3 ${
        userProfile.highContrastMode
          ? 'bg-black border-2 border-yellow-400 text-yellow-300'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
              {scan.bestSprayingTime.timeOfDay === 'late_evening' ? (
                <Sunset className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Sunrise className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                {t.sprayingTimeTitle}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Timing dictates 80% of chemical effectiveness
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900">
            {scan.bestSprayingTime.recommendedHours}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          <strong className="font-black text-slate-900">Why this time?</strong> {scan.bestSprayingTime.reason}
        </div>
      </div>

      {/* 4. Farmer Safety Equipment Checklist */}
      <div className={`rounded-[36px] p-6 sm:p-8 border transition shadow-xl shadow-slate-100 space-y-4 ${
        userProfile.highContrastMode
          ? 'bg-black border-2 border-yellow-400 text-yellow-300'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
          <h3 className="text-base font-black text-slate-900 font-['Outfit']">
            {t.safetyEquipmentTitle}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">😷</span>
            <div>
              <div className="text-xs font-black text-slate-900">Face Mask</div>
              <div className="text-[10px] text-slate-500 font-medium">No inhalation</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🧤</span>
            <div>
              <div className="text-xs font-black text-slate-900">Rubber Gloves</div>
              <div className="text-[10px] text-slate-500 font-medium">Skin barrier</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🥽</span>
            <div>
              <div className="text-xs font-black text-slate-900">Eye Goggles</div>
              <div className="text-[10px] text-slate-500 font-medium">No splash in eyes</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🥾</span>
            <div>
              <div className="text-xs font-black text-slate-900">Rubber Boots</div>
              <div className="text-[10px] text-slate-500 font-medium">Feet protection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
        <button
          id="back-to-scanner-btn"
          onClick={() => setActiveTab('scanner')}
          className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center gap-2 transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Plant</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            id="save-medicine-to-diary-btn"
            onClick={() => {
              onSaveToDiary(scan, `${roundedSpoons} spoons (${totalDoseGramsOrMl} ${scan.chemicalTreatment.unitType}) in ${tankSizeLiters}L pump`);
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3000);
            }}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-200 transition active:scale-95 ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{savedSuccess ? '✓ Saved to Farm Diary!' : t.saveToDiaryBtn}</span>
          </button>

          <button
            onClick={() => setActiveTab('helpline')}
            className="px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-200 transition active:scale-95"
          >
            <Headset className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Agronomist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
