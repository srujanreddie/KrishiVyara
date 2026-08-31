import React, { useState } from 'react';
import { UserProfile, CropScanResult } from '../types';
import { translations } from '../data/translations';
import { sampleDiseases } from '../data/mockData';
import { 
  translateCrop, 
  translateSeverity, 
  translatePathogen, 
  translateSpreadRisk, 
  translateInfectionStage,
  translateSafetyGear 
} from '../utils/i18n';
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
  const lang = userProfile.languagePreference;
  
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
  const totalSpoons = (parseFloat(totalDoseGramsOrMl) / 15).toFixed(1);
  const roundedSpoons = Math.round(parseFloat(totalSpoons) * 2) / 2;

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
            <span className="text-[10px] font-extrabold text-amber-900 mt-0.5">1 {t.tablespoons}</span>
          </div>
        ))}
        {hasHalf && (
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-100/70 border border-dashed border-amber-400 shadow-sm">
            <span className="text-xl opacity-80">🥄½</span>
            <span className="text-[10px] font-extrabold text-amber-900 mt-0.5">½ {t.tablespoons}</span>
          </div>
        )}
      </div>
    );
  };

  const cropTranslated = translateCrop(scan.cropName, lang);
  const fullAudioScript = `${cropTranslated} ${scan.diseaseOrPestName}. ${tankSizeLiters}L: ${roundedSpoons} ${t.tablespoons} ${scan.chemicalTreatment.name}. ${scan.bestSprayingTime.recommendedHours}.`;

  const maskGear = translateSafetyGear('Face Mask', lang);
  const glovesGear = translateSafetyGear('Rubber Gloves', lang);
  const gogglesGear = translateSafetyGear('Eye Goggles', lang);
  const bootsGear = translateSafetyGear('Rubber Boots', lang);

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
                {cropTranslated} {t.viewTreatmentPlan}
              </span>
              {scan.pathogenType && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase">
                  🔬 {translatePathogen(scan.pathogenType, lang)}
                </span>
              )}
              <span className="text-xs text-emerald-200 font-bold">
                {scan.diseaseOrPestName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
              {t.medicineGuideTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5 font-medium">
              {cropTranslated} • {translateInfectionStage(scan.infectionStage, lang)} • {scan.yieldLossRiskPercent || 35}% {t.yieldLossRisk}
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
          <span className="text-[10px] font-black uppercase text-slate-500 block">{t.infectionBiologyDynamics}</span>
          <span className="text-xs font-black text-slate-900 capitalize mt-0.5 block">
            {translatePathogen(scan.pathogenType || 'fungal', lang)}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-500 block">{t.severityLabel}</span>
          <span className={`text-xs font-black uppercase mt-0.5 block ${
            scan.severity === 'severe' ? 'text-rose-600' : 'text-amber-600'
          }`}>
            {translateSeverity(scan.severity, lang).label} ({scan.yieldLossRiskPercent || 35}% {t.yieldLossRisk})
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-500 block">{t.spreadRiskHeading}</span>
          <span className="text-xs font-black text-slate-900 capitalize mt-0.5 block">
            {translateSpreadRisk(scan.spreadRisk, lang)}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-500 block">{t.phiWaitingPeriod}</span>
          <span className="text-xs font-black text-emerald-700 mt-0.5 block">
            {scan.chemicalTreatment.waitingPeriodDays} {t.days}
          </span>
        </div>
      </div>

      {/* Quick Switch for Other Crop Scans */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 shrink-0 px-1">
          {t.selectCropLabel}:
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
            {translateCrop(d.cropName, lang)}: {d.diseaseOrPestName.split('(')[0]}
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
                {t.exactDosageLabel} ({tankSizeLiters}L)
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
            {tankSizeLiters} {t.liters}
          </span>
        </div>

        {/* Tank Size Selector Chips */}
        <div className="space-y-2.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
            {t.knapsackPumpSize}:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { size: 10, label: '10 L' },
              { size: 15, label: '15 L' },
              { size: 16, label: '16 L' },
              { size: 20, label: '20 L' }
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
                <div className="text-lg font-black">{item.size} {t.liters}</div>
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
                {t.spoonsNeeded} ({tankSizeLiters}L):
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-950 font-['Outfit'] mt-0.5">
                {roundedSpoons} {t.tablespoons} <span className="text-sm font-bold opacity-75">({totalDoseGramsOrMl} {scan.chemicalTreatment.unitType})</span>
              </div>
            </div>

            <button
              onClick={() => handleSpeak(`${tankSizeLiters}L: ${roundedSpoons} ${t.tablespoons} ${scan.chemicalTreatment.name}.`)}
              className="px-4 py-2 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.speakText}</span>
            </button>
          </div>

          {/* Visual Spoon Rendering */}
          <div>
            <span className="text-[11px] font-black text-amber-800">
              {t.exactDosageLabel}:
            </span>
            {renderVisualSpoons(roundedSpoons)}
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
                  {t.chemicalMedicineHeading}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1.5 font-['Outfit']">
                  {scan.chemicalTreatment.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {t.activeFormulaLabel}: {scan.chemicalTreatment.activeIngredient}
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
                {t.marketBrandsLabel}:
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
                  {scan.chemicalTreatment.waitingPeriodDays} {t.days}
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5 font-medium">
                  {t.phiWaitingPeriod}: {scan.chemicalTreatment.waitingPeriodDays} {t.days}
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-black text-slate-700 uppercase block">
                  {t.maxSpraysPerSeasonLabel}
                </span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {scan.chemicalTreatment.maxSpraysPerSeason} {t.timesMaxLabel}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  {t.preventsResistanceNote}
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
              🌿 {t.organicRemedyHeading}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1.5 font-['Outfit']">
              {scan.organicTreatment.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t.organicSubtext}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="text-xs font-black text-emerald-900 uppercase">
              {t.ingredientsNeeded}:
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
              {t.prepRecipe}:
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed p-4 rounded-3xl bg-slate-50 border border-slate-200 font-medium">
              {scan.organicTreatment.recipe}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-black text-slate-600 pt-1">
            <span>⏱️ {t.prepTime}: {scan.organicTreatment.preparationTime}</span>
            <span>💧 {t.mixingDose}: {scan.organicTreatment.mixingRatio}</span>
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
                {t.sprayWindowSubtext}
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900">
            {scan.bestSprayingTime.recommendedHours}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          <strong className="font-black text-slate-900">{t.sprayWhyTime}:</strong> {scan.bestSprayingTime.reason}
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
              <div className="text-xs font-black text-slate-900">{maskGear.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{maskGear.desc}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🧤</span>
            <div>
              <div className="text-xs font-black text-slate-900">{glovesGear.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{glovesGear.desc}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🥽</span>
            <div>
              <div className="text-xs font-black text-slate-900">{gogglesGear.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{gogglesGear.desc}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🥾</span>
            <div>
              <div className="text-xs font-black text-slate-900">{bootsGear.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{bootsGear.desc}</div>
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
          <span>{t.scanAnotherLeaf}</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            id="save-medicine-to-diary-btn"
            onClick={() => {
              onSaveToDiary(scan, `${roundedSpoons} ${t.tablespoons} (${totalDoseGramsOrMl} ${scan.chemicalTreatment.unitType}) in ${tankSizeLiters}L`);
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
            <span>{savedSuccess ? `✓ ${t.savedToDiarySuccess}` : t.saveToDiaryBtn}</span>
          </button>

          <button
            onClick={() => setActiveTab('helpline')}
            className="px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-200 transition active:scale-95"
          >
            <Headset className="w-4 h-4" />
            <span className="hidden sm:inline">{t.askAgronomist}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
