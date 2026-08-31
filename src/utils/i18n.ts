import { 
  LanguageCode, 
  CropScanResult, 
  ActivityType, 
  SeverityLevel, 
  PathogenType, 
  InfectionStage, 
  SpreadRiskLevel 
} from '../types';

// Multilingual Crop Names
export const cropTranslations: Record<string, Record<LanguageCode, string>> = {
  'Tomato': {
    en: 'Tomato',
    hi: 'टमाटर',
    mr: 'टोमॅटो',
    pa: 'ਟਮਾਟਰ',
    te: 'టమోటా',
    bn: 'টমেটো',
    es: 'Tomate',
    sw: 'Nyanya'
  },
  'Cotton': {
    en: 'Cotton',
    hi: 'कपास',
    mr: 'कापूस',
    pa: 'ਕਪਾਹ',
    te: 'పత్తి',
    bn: 'তুলা',
    es: 'Algodón',
    sw: 'Pamba'
  },
  'Rice': {
    en: 'Rice / Paddy',
    hi: 'धान / चावल',
    mr: 'भात / धान',
    pa: 'ਝੋਨਾ / ਚਾਵਲ',
    te: 'వరి / వడ్లు',
    bn: 'ধান / চাল',
    es: 'Arroz',
    sw: 'Mchele / Mpunga'
  },
  'Wheat': {
    en: 'Wheat',
    hi: 'गेहूं',
    mr: 'गहू',
    pa: 'ਕਣਕ',
    te: 'గోధుమలు',
    bn: 'গম',
    es: 'Trigo',
    sw: 'Ngano'
  },
  'Chili': {
    en: 'Chili',
    hi: 'मिर्च',
    mr: 'मिरची',
    pa: 'ਮਿਰਚ',
    te: 'మిరప',
    bn: 'মরিচ',
    es: 'Chile / Ají',
    sw: 'Pilipili'
  },
  'Potato': {
    en: 'Potato',
    hi: 'आलू',
    mr: 'बटाटा',
    pa: 'ਆਲੂ',
    te: 'బంగాళాదుంప',
    bn: 'আলু',
    es: 'Papa / Patata',
    sw: 'Viazi Mviringo'
  },
  'Corn': {
    en: 'Maize / Corn',
    hi: 'मक्का',
    mr: 'मका',
    pa: 'ਮੱਕੀ',
    te: 'మొక్కజొన్న',
    bn: 'ভুট্টা',
    es: 'Maíz',
    sw: 'Mahindi'
  },
  'Soybean': {
    en: 'Soybean',
    hi: 'सोयाबीन',
    mr: 'सोयाबीन',
    pa: 'ਸੋਇਆਬੀਨ',
    te: 'సోయాబీన్',
    bn: 'সয়াবিন',
    es: 'Soja / Soya',
    sw: 'Soya'
  },
  'Onion': {
    en: 'Onion',
    hi: 'प्याज',
    mr: 'कांदा',
    pa: 'ਗੰਢਾ / ਪਿਆਜ਼',
    te: 'ఉల్లిపాయ',
    bn: 'পেঁয়াজ',
    es: 'Cebolla',
    sw: 'Kitunguu'
  },
  'Sugarcane': {
    en: 'Sugarcane',
    hi: 'गन्ना',
    mr: 'ऊस',
    pa: 'ਗੰਨਾ',
    te: 'చెరకు',
    bn: 'আখ',
    es: 'Caña de Azúcar',
    sw: 'Miwa'
  },
  'Auto-Detect': {
    en: 'Auto-Detect Crop',
    hi: 'फसल स्वतः पहचानें',
    mr: 'पीक स्वतः ओळखा',
    pa: 'ਆਪਣੇ ਆਪ ਪਛਾਣੋ',
    te: 'ఆటోమేటిక్ గుర్తింపు',
    bn: 'স্বয়ংক্রিয় সনাক্তকরণ',
    es: 'Auto-detectar Cultivo',
    sw: 'Gundua Zao Kiotomatiki'
  }
};

export function translateCrop(cropName: string, lang: LanguageCode): string {
  if (!cropName) return cropName;
  const match = cropTranslations[cropName];
  if (match && match[lang]) return match[lang];
  // Case-insensitive lookup
  for (const key of Object.keys(cropTranslations)) {
    if (key.toLowerCase() === cropName.toLowerCase()) {
      return cropTranslations[key][lang] || cropName;
    }
  }
  return cropName;
}

// Soil Type Translations
export const soilTranslations: Record<string, Record<LanguageCode, string>> = {
  'black': {
    en: 'Black Clayey Soil',
    hi: 'काली चिकनी मिट्टी',
    mr: 'काळी कसदार माती',
    pa: 'ਕਾਲੀ ਚੀਕਣੀ ਮਿੱਟੀ',
    te: 'నల్ల రేగడి నేల',
    bn: 'কালো এঁটেল মাটি',
    es: 'Tierra Negra Arcillosa',
    sw: 'Udongo Mweusi wa Mfinyanzi'
  },
  'red': {
    en: 'Red Loamy Soil',
    hi: 'लाल दोमट मिट्टी',
    mr: 'लाल पोयटा माती',
    pa: 'ਲਾਲ ਦੋਮਟ ਮਿੱਟੀ',
    te: 'ఎర్ర నేల',
    bn: 'লাল দোআঁশ মাটি',
    es: 'Tierra Roja Franca',
    sw: 'Udongo Mwekundu'
  },
  'alluvial': {
    en: 'Alluvial / Loamy Soil',
    hi: 'जलोढ़ / दोमट मिट्टी',
    mr: 'गाळाची / सुपीक माती',
    pa: 'ਜਲੋੜ੍ਹ / ਦੋਮਟ ਮਿੱਟੀ',
    te: 'ఒండ్రు నేల',
    bn: 'পলি মাটি',
    es: 'Suelo Aluvial / Franco',
    sw: 'Udongo wa Tifu'
  },
  'sandy': {
    en: 'Sandy Loam Soil',
    hi: 'बलुई दोमट मिट्टी',
    mr: 'रेताड माती',
    pa: 'ਰੇਤਲੀ ਮਿੱਟੀ',
    te: 'ఇసుక నేల',
    bn: 'বেলে মাটি',
    es: 'Suelo Arenoso',
    sw: 'Udongo wa Mchanga'
  },
  'clay': {
    en: 'Heavy Clay Soil',
    hi: 'चिकनी मिट्टी',
    mr: 'चिकण माती',
    pa: 'ਚੀਕਣੀ ਮਿੱਟੀ',
    te: 'బంకమట్టి నేల',
    bn: 'এঁটেল মাটি',
    es: 'Suelo Arcilloso Pesado',
    sw: 'Udongo Mzito wa Mfinyanzi'
  },
  'loam': {
    en: 'Loamy Soil',
    hi: 'दोमट मिट्टी',
    mr: 'पोयटा माती',
    pa: 'ਦੋਮਟ ਮਿੱਟੀ',
    te: 'వరిమట్టి నేల',
    bn: 'দোআঁশ মাটি',
    es: 'Suelo Franco Fértil',
    sw: 'Udongo wa Rutuba'
  }
};

export function translateSoil(soil: string, lang: LanguageCode): string {
  if (!soil) return soil;
  const match = soilTranslations[soil.toLowerCase()];
  return match?.[lang] || soil;
}

// Severity Translations
export const severityTranslations: Record<SeverityLevel, Record<LanguageCode, { label: string; desc: string }>> = {
  low: {
    en: { label: 'Low Severity', desc: 'Early stage. Mild symptoms. Preventive action recommended.' },
    hi: { label: 'हल्का संक्रमण', desc: 'शुरुआती अवस्था। हल्के लक्षण। जैविक या हल्की रोकथाम पर्याप्त है।' },
    mr: { label: 'कमी तीव्रता', desc: 'सुरुवातीचा टप्पा. सौम्य लक्षणे. प्रतिबंधात्मक फवारणी पुरेशी आहे.' },
    pa: { label: 'ਘੱਟ ਖ਼ਤਰਾ', desc: 'ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ। ਹਲਕੇ ਲੱਛਣ। ਸਧਾਰਨ ਰੋਕਥਾਮ ਕਾਫ਼ੀ ਹੈ।' },
    te: { label: 'తక్కువ తీవ్రత', desc: 'ప్రారంభ దశ. స్వల్ప లక్షణాలు. ప్రాథమిక నివారణ చాలు.' },
    bn: { label: 'কম তীব্রতা', desc: 'প্রাথমিক পর্যায়। মৃদু লক্ষণ। প্রতিরোধমূলক ব্যবস্থা যথেষ্ট।' },
    es: { label: 'Severidad Leve', desc: 'Etapa inicial. Síntomas leves. Tratamiento preventivo sugerido.' },
    sw: { label: 'Kiwango Kidogo', desc: 'Hatua ya awali. Dalili ndogo. Kinga ya kawaida inatosha.' }
  },
  moderate: {
    en: { label: 'Moderate Severity', desc: 'Active infection spread. Requires targeted spray treatment.' },
    hi: { label: 'मध्यम संक्रमण', desc: 'सक्रिय संक्रमण। तत्काल सुझाई गई दवा का छिड़काव आवश्यक है।' },
    mr: { label: 'मध्यम तीव्रता', desc: 'सक्रिय प्रादुर्भाव. योग्य कीटकनाशक फवारणी तातडीने करावी.' },
    pa: { label: 'ਦਰਮਿਆਨਾ ਖ਼ਤਰਾ', desc: 'ਰੋਗ ਫੈਲ ਰਿਹਾ ਹੈ। ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਦਵਾਈ ਦੀ ਸਪਰੇਅ ਜ਼ਰੂਰੀ ਹੈ।' },
    te: { label: 'మధ్యస్థ తీవ్రత', desc: 'తెగులు వ్యాపిస్తోంది. వెంటనే పిచికారీ చేయడం అవసరం.' },
    bn: { label: 'মাঝারি তীব্রতা', desc: 'রোগ বিস্তার লাভ করছে। সময়মতো সঠিক স্প্রে প্রয়োজন।' },
    es: { label: 'Severidad Moderada', desc: 'Infección activa en desarrollo. Requiere pulverización dirigida.' },
    sw: { label: 'Kiwango cha Kati', desc: 'Ugonjwa unazidi kuenea. Unahitaji kupulizia dawa mara moja.' }
  },
  severe: {
    en: { label: 'Severe Alert', desc: 'Critical damage risk! Immediate intervention required within 24h.' },
    hi: { label: 'गंभीर खतरा', desc: 'भारी फसल नुकसान का जोखिम! 24 घंटे के भीतर तुरंत छिड़काव करें।' },
    mr: { label: 'गंभीर धोका', desc: 'मोठ्या नुकसानीची भीती! पुढील २४ तासांत तातडीने फवारणी करा.' },
    pa: { label: 'ਗੰਭੀਰ ਖ਼ਤਰਾ', desc: 'ਵੱਡੇ ਨੁਕਸਾਨ ਦਾ ਖ਼ਤਰਾ! 24 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਤੁਰੰਤ ਦਵਾਈ ਛਿੜਕੋ।' },
    te: { label: 'తీవ్ర ప్రమాదం', desc: 'పంట తీవ్రంగా దెబ్బతినే ప్రమాదం! 24 గంటల్లో వెంటనే మందు కొట్టండి.' },
    bn: { label: 'মারাত্মক ঝুঁকি', desc: 'মারাত্মক ফসলের ক্ষতি হতে পারে! ২৪ ঘণ্টার মধ্যে তাৎক্ষণিক ব্যবস্থা নিন।' },
    es: { label: 'Alerta Severa', desc: '¡Alto riesgo de pérdida! Requiere intervención inmediata en 24h.' },
    sw: { label: 'Hatari Kubwa', desc: 'Uharibifu mkubwa! Unahitaji matibabu ya dharura ndani ya saa 24.' }
  }
};

export function translateSeverity(severity: SeverityLevel, lang: LanguageCode): { label: string; desc: string } {
  return severityTranslations[severity]?.[lang] || severityTranslations[severity]?.en || { label: severity, desc: '' };
}

// Pathogen Type Translations
export const pathogenTranslations: Record<PathogenType, Record<LanguageCode, string>> = {
  fungal: {
    en: 'Fungal Pathogen',
    hi: 'फफूंद जनित रोग (Fungus)',
    mr: 'बुरशीजन्य रोग',
    pa: 'ਉੱਲੀ ਰੋਗ',
    te: 'శిలీంద్ర తెగులు (బూజు)',
    bn: 'ছত্রাকজনিত রোগ',
    es: 'Patógeno Fúngico (Hongo)',
    sw: 'Ugonjwa wa Kuvu / Ukungu'
  },
  bacterial: {
    en: 'Bacterial Disease',
    hi: 'जीवाणु जनित रोग (Bacteria)',
    mr: 'जिवाणूजन्य रोग',
    pa: 'ਜੀਵਾਣੂ ਰੋਗ',
    te: 'బాక్టీరియా తెగులు',
    bn: 'ব্যাকটেরিয়াজনিত রোগ',
    es: 'Enfermedad Bacteriana',
    sw: 'Ugonjwa wa Bakteria'
  },
  viral: {
    en: 'Viral Infection',
    hi: 'विषाणु जनित रोग (Virus)',
    mr: 'विषाणूजन्य रोग',
    pa: 'ਵਿਸ਼ਾਣੂ / ਵਾਇਰਸ',
    te: 'వైరస్ తెగులు',
    bn: 'ভাইরাসজনিত রোগ',
    es: 'Infección Viral (Virus)',
    sw: 'Ugonjwa wa Virusi'
  },
  pest: {
    en: 'Insect / Pest Infestation',
    hi: 'कीट / सुंडी का प्रकोप',
    mr: 'कीड / अळीचा प्रादुर्भाव',
    pa: 'ਕੀੜੇ / ਸੁੰਡੀ ਦਾ ਹਮਲਾ',
    te: 'పురుగు / లద్దెపురుగు దాడి',
    bn: 'পোকামাকড়ের আক্রমণ',
    es: 'Infestación de Plagas / Insectos',
    sw: 'Shambulio la Wadudu Waharibifu'
  },
  nematode: {
    en: 'Nematode Root Pest',
    hi: 'सूत्रकृमि (निमेटोड) रोग',
    mr: 'सूत्रकृमी प्रादुर्भाव',
    pa: 'ਸੂਤਰਕ੍ਰਿਮੀ (ਨਿਮਾਟੋਡ)',
    te: 'నెమటోడ్ తెగులు',
    bn: 'নেমাটোড কৃমি রোগ',
    es: 'Nematodo de la Raíz',
    sw: 'Minyoo ya Mizizi'
  },
  deficiency: {
    en: 'Nutrient Deficiency',
    hi: 'पोषक तत्वों की कमी',
    mr: 'अन्नद्रव्यांची कमतरता',
    pa: 'ਖ਼ੁਰਾਕੀ ਤੱਤਾਂ ਦੀ ਘਾਟ',
    te: 'పోషకాల లోపం',
    bn: 'পুষ্টি উপাদানের ঘাটতি',
    es: 'Deficiencia Nutricional',
    sw: 'Upungufu wa Rutuba'
  }
};

export function translatePathogen(pathogen: PathogenType | undefined, lang: LanguageCode): string {
  if (!pathogen) return '';
  return pathogenTranslations[pathogen]?.[lang] || pathogenTranslations[pathogen]?.en || pathogen;
}

// Activity Type Translations for Diary
export const activityTranslations: Record<ActivityType, Record<LanguageCode, { label: string; icon: string }>> = {
  planting: {
    en: { label: 'Sowing / Planting', icon: '🌱' },
    hi: { label: 'बुवाई / रोपाई', icon: '🌱' },
    mr: { label: 'पेरणी / लागवड', icon: '🌱' },
    pa: { label: 'ਬਿਜਾਈ / ਲੁਆਈ', icon: '🌱' },
    te: { label: 'విత్తడం / నాట్లు', icon: '🌱' },
    bn: { label: 'বীজ বপন / রোপণ', icon: '🌱' },
    es: { label: 'Siembra / Trasplante', icon: '🌱' },
    sw: { label: 'Kupanda / Kupandikiza', icon: '🌱' }
  },
  watering: {
    en: { label: 'Irrigation / Watering', icon: '💧' },
    hi: { label: 'सिंचाई / पानी लगाना', icon: '💧' },
    mr: { label: 'पाणी / बागायत', icon: '💧' },
    pa: { label: 'ਪਾਣੀ ਲਾਉਣਾ / ਸਿੰਚਾਈ', icon: '💧' },
    te: { label: 'నీరు పెట్టడం / తడి', icon: '💧' },
    bn: { label: 'সেচ প্রয়োগ', icon: '💧' },
    es: { label: 'Riego / Hidratación', icon: '💧' },
    sw: { label: 'Umwagiliaji Maji', icon: '💧' }
  },
  fertilizer: {
    en: { label: 'Fertilizer Application', icon: '🧪' },
    hi: { label: 'खाद / यूरिया डालना', icon: '🧪' },
    mr: { label: 'खत व्यवस्थापन', icon: '🧪' },
    pa: { label: 'ਖਾਦ / ਯੂਰੀਆ ਪਾਉਣਾ', icon: '🧪' },
    te: { label: 'ఎరువులు వేయడం', icon: '🧪' },
    bn: { label: 'সার প্রয়োগ', icon: '🧪' },
    es: { label: 'Fertilización / Abono', icon: '🧪' },
    sw: { label: 'Uwekaji wa Mbolea', icon: '🧪' }
  },
  pesticide: {
    en: { label: 'Pesticide / Medicine Spray', icon: '🚿' },
    hi: { label: 'दवा / कीटनाशक छिड़काव', icon: '🚿' },
    mr: { label: 'औषध फवारणी', icon: '🚿' },
    pa: { label: 'ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ', icon: '🚿' },
    te: { label: 'మందు పిచికారీ', icon: '🚿' },
    bn: { label: 'কীটনাশক স্প্রে', icon: '🚿' },
    es: { label: 'Aplicación Fitosanitaria', icon: '🚿' },
    sw: { label: 'Kupuliza Dawa ya Mimea', icon: '🚿' }
  },
  weeding: {
    en: { label: 'Weeding & Pruning', icon: '✂️' },
    hi: { label: 'निराई-गुड़ाई व कटाई', icon: '✂️' },
    mr: { label: 'खुरपणी व छाटणी', icon: '✂️' },
    pa: { label: 'ਗੋਡੀ ਤੇ ਛਾਂਟੀ', icon: '✂️' },
    te: { label: 'కలుపు తీత', icon: '✂️' },
    bn: { label: 'আগাছা দমন ও ছাঁটাই', icon: '✂️' },
    es: { label: 'Deshierbe y Poda', icon: '✂️' },
    sw: { label: 'Palizi na Kupogoa', icon: '✂️' }
  },
  harvest: {
    en: { label: 'Harvesting / Picking', icon: '🌾' },
    hi: { label: 'फसल कटाई / तुड़ाई', icon: '🌾' },
    mr: { label: 'पीक काढणी / तोडणी', icon: '🌾' },
    pa: { label: 'ਕਟਾਈ / ਵਾਢੀ', icon: '🌾' },
    te: { label: 'పంట కోత / నూర్పిడి', icon: '🌾' },
    bn: { label: 'ফসল তোলা / কাটাই', icon: '🌾' },
    es: { label: 'Cosecha y Recolección', icon: '🌾' },
    sw: { label: 'Uvunaji wa Mazao', icon: '🌾' }
  },
  pest_sighting: {
    en: { label: 'Pest / Disease Sighting', icon: '🐛' },
    hi: { label: 'बीमारी या कीड़ा दिखना', icon: '🐛' },
    mr: { label: 'रोग किंवा किडीचा प्रादुर्भाव', icon: '🐛' },
    pa: { label: 'ਕੀੜੇ ਜਾਂ ਰੋਗ ਦਾ ਪਤਾ ਲੱਗਣਾ', icon: '🐛' },
    te: { label: 'పురుగు లేదా తెగులు గుర్తింపు', icon: '🐛' },
    bn: { label: 'রোগ বা পোকার লক্ষণ দেখা', icon: '🐛' },
    es: { label: 'Detección de Plaga / Daño', icon: '🐛' },
    sw: { label: 'Kuona Wadudu au Ugonjwa', icon: '🐛' }
  },
  soil_treatment: {
    en: { label: 'Soil Treatment', icon: '🪵' },
    hi: { label: 'मृदा उपचार / जुताई', icon: '🪵' },
    mr: { label: 'मातीची मशागत व प्रक्रिया', icon: '🪵' },
    pa: { label: 'ਮਿੱਟੀ ਦੀ ਤਿਆਰੀ / ਵਹਾਈ', icon: '🪵' },
    te: { label: 'భూమి తయారీ / దుక్కి', icon: '🪵' },
    bn: { label: 'মাটি শোধন ও চাষ', icon: '🪵' },
    es: { label: 'Tratamiento del Suelo', icon: '🪵' },
    sw: { label: 'Matibabu ya Udongo', icon: '🪵' }
  },
  note: {
    en: { label: 'General Farm Note', icon: '📝' },
    hi: { label: 'सामान्य टिप्पणी / नोट', icon: '📝' },
    mr: { label: 'सर्वसाधारण नोंद', icon: '📝' },
    pa: { label: 'ਆਮ ਨੋਟਿਸ', icon: '📝' },
    te: { label: 'సాధారణ గమనిక', icon: '📝' },
    bn: { label: 'সাধারণ নোট', icon: '📝' },
    es: { label: 'Nota General de Campo', icon: '📝' },
    sw: { label: 'Kumbukumbu ya Jumla', icon: '📝' }
  }
};

export function translateActivity(activity: ActivityType, lang: LanguageCode): { label: string; icon: string } {
  return activityTranslations[activity]?.[lang] || activityTranslations[activity]?.en || { label: activity, icon: '📋' };
}

// Infection Stage Translations
export const infectionStageTranslations: Record<InfectionStage, Record<LanguageCode, string>> = {
  early: {
    en: 'Early Stage (10-25% Canopy)',
    hi: 'प्रारंभिक अवस्था (10-25% फैलाव)',
    mr: 'सुरुवातीचा टप्पा (१०-२५% प्रादुर्भाव)',
    pa: 'ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ (10-25%)',
    te: 'ప్రారంభ దశ (10-25%)',
    bn: 'প্রাথমিক পর্যায় (১০-২৫%)',
    es: 'Etapa Temprana (10-25% Follaje)',
    sw: 'Hatua ya Awali (10-25%)'
  },
  intermediate: {
    en: 'Intermediate (25-50% Canopy)',
    hi: 'मध्यम अवस्था (25-50% फैलाव)',
    mr: 'मध्यम टप्पा (२५-५०% प्रादुर्भाव)',
    pa: 'ਦਰਮਿਆਨਾ ਪੜਾਅ (25-50%)',
    te: 'మధ్యస్థ దశ (25-50%)',
    bn: 'মাঝারি পর্যায় (২৫-৫০%)',
    es: 'Etapa Intermedia (25-50% Follaje)',
    sw: 'Hatua ya Kati (25-50%)'
  },
  advanced: {
    en: 'Advanced Stage (>50% Canopy)',
    hi: 'गंभीर अवस्था (>50% नुकसान)',
    mr: 'तीव्र टप्पा (>५०% नुकसान)',
    pa: 'ਗੰਭੀਰ ਪੜਾਅ (>50%)',
    te: 'తీవ్ర దశ (>50%)',
    bn: 'মারাত্মক পর্যায় (>৫০%)',
    es: 'Etapa Avanzada (>50% Follaje)',
    sw: 'Hatua ya Juu (>50%)'
  }
};

export function translateInfectionStage(stage: InfectionStage | undefined, lang: LanguageCode): string {
  if (!stage) return '';
  return infectionStageTranslations[stage]?.[lang] || infectionStageTranslations[stage]?.en || stage;
}

// Spread Risk Translations
export const spreadRiskTranslations: Record<SpreadRiskLevel, Record<LanguageCode, string>> = {
  high: {
    en: 'High Spread Risk (Airborne / Dew)',
    hi: 'तेजी से फैलने का खतरा (हवा/ओस द्वारा)',
    mr: 'वेगाने पसरण्याचा धोका (वारा व दव)',
    pa: 'ਤੇਜ਼ੀ ਨਾਲ ਫੈਲਣ ਦਾ ਖ਼ਤਰਾ (ਹਵਾ/ਤ੍ਰੇਲ)',
    te: 'అధిక వ్యాప్తి ప్రమాదం (గాలి/మంచు)',
    bn: 'উচ্চ ছড়ানোর ঝুঁকি (বাতাস ও শিশির)',
    es: 'Alto Riesgo de Dispersión (Viento/Rocío)',
    sw: 'Hatari Kubwa ya Kuenea (Upepo/Umande)'
  },
  moderate: {
    en: 'Moderate Spread Risk',
    hi: 'मध्यम फैलाव जोखिम',
    mr: 'मध्यम पसरण्याचा धोका',
    pa: 'ਦਰਮਿਆਨਾ ਫੈਲਣ ਦਾ ਖ਼ਤਰਾ',
    te: 'మధ్యస్థ వ్యాప్తి ప్రమాదం',
    bn: 'মাঝারি ছড়ানোর ঝুঁকি',
    es: 'Riesgo de Dispersión Moderado',
    sw: 'Hatari ya Wastani ya Kuenea'
  },
  low: {
    en: 'Low / Localized Spread Risk',
    hi: 'कम / सीमित फैलाव जोखिम',
    mr: 'मर्यादित पसरण्याचा धोका',
    pa: 'ਘੱਟ ਫੈਲਣ ਦਾ ਖ਼ਤਰਾ',
    te: 'తక్కువ వ్యాప్తి ప్రమాదం',
    bn: 'কম ছড়ানোর ঝুঁকি',
    es: 'Riesgo de Dispersión Bajo / Localizado',
    sw: 'Hatari Ndogo ya Kuenea'
  }
};

export function translateSpreadRisk(risk: SpreadRiskLevel | undefined, lang: LanguageCode): string {
  if (!risk) return '';
  return spreadRiskTranslations[risk]?.[lang] || spreadRiskTranslations[risk]?.en || risk;
}

// Weather Condition Translations
export const weatherConditionTranslations: Record<string, Record<LanguageCode, string>> = {
  'Sunny': {
    en: 'Sunny & Clear',
    hi: 'धूप व साफ आसमान',
    mr: 'सूर्यप्रकाश व निरभ्र',
    pa: 'ਸਾਫ਼ ਧੁੱਪ',
    te: 'ఎండ & నిర్మలమైన ఆకాశం',
    bn: 'রোদঝলমলে ও পরিষ্কার',
    es: 'Soleado y Despejado',
    sw: 'Jua Kali na Anga Safi'
  },
  'Partly Cloudy': {
    en: 'Partly Cloudy',
    hi: 'आंशिक बादल',
    mr: 'अंशतः ढगाळ',
    pa: 'ਅੰਸ਼ਕ ਬੱਦਲਵਾਈ',
    te: 'పాక్షికంగా మేఘావృతం',
    bn: 'আংশিক মেঘলা',
    es: 'Parcialmente Nublado',
    sw: 'Mawingu Kiasi'
  },
  'Cloudy': {
    en: 'Overcast Clouds',
    hi: 'घने बादल',
    mr: 'दाट ढगाळ वातावरण',
    pa: 'ਘਣੇ ਬੱਦਲ',
    te: 'దట్టమైన మేఘాలు',
    bn: 'মেঘাচ্ছন্ন আকাশ',
    es: 'Nublado Cubierto',
    sw: 'Mawingu Mazito'
  },
  'Light Rain': {
    en: 'Light Rain / Drizzle',
    hi: 'हल्की बूंदाबांदी / वर्षा',
    mr: 'हलका पाऊस / रिमझिम',
    pa: 'ਹਲਕੀ ਬਾਰਿਸ਼ / ਫੁਹਾਰ',
    te: 'తేలికపాటి వర్షం / జల్లులు',
    bn: 'হালকা বৃষ্টি / গুঁড়ি গুঁড়ি বৃষ্টি',
    es: 'Lluvia Ligera / Llovizna',
    sw: 'Mvua Nyepesi / Rasharasha'
  },
  'Heavy Rain': {
    en: 'Heavy Rain Warning',
    hi: 'भारी बारिश की चेतावनी',
    mr: 'मुसळधार पावसाचा इशारा',
    pa: 'ਭਾਰੀ ਮੀਂਹ ਦੀ ਚੇਤਾਵਨੀ',
    te: 'భారీ వర్షపు హెచ్చరిక',
    bn: 'ভারী বৃষ্টির সতর্কতা',
    es: 'Alerta de Lluvia Fuerte',
    sw: 'Tahadhari ya Mvua Kubwa'
  },
  'Thunderstorm': {
    en: 'Thunderstorm & Gusts',
    hi: 'आंधी-तूफान व बिजली',
    mr: 'वादळी पाऊस व विजांचा कडकडाट',
    pa: 'ਤੂਫ਼ਾਨ ਤੇ ਗਰਜ ਚਮਕ',
    te: 'ఉరుములు & ఈదురు గాలులు',
    bn: 'বজ্রবিদ্যুৎসহ ঝড়বৃষ্টি',
    es: 'Tormenta Eléctrica y Ráfagas',
    sw: 'Mvua ya Radi na Upepo Mkali'
  }
};

export function translateWeatherCondition(condition: string, lang: LanguageCode): string {
  if (!condition) return condition;
  const match = weatherConditionTranslations[condition];
  return match?.[lang] || condition;
}

// Safety Equipment Translations
export interface SafetyGearInfo {
  name: string;
  desc: string;
}

export const safetyGearTranslations: Record<string, Record<LanguageCode, SafetyGearInfo>> = {
  'mask': {
    en: { name: 'Face Mask', desc: 'Avoid inhaling mist' },
    hi: { name: 'सुरक्षा मास्क', desc: 'धुंध और गंध से बचाव' },
    mr: { name: 'सुरक्षा मास्क', desc: 'धूर आणि वाफेपासून संरक्षण' },
    pa: { name: 'ਸੁਰੱਖਿਆ ਮਾਸਕ', desc: 'ਧੂੰਏਂ ਤੇ ਸਪਰੇਅ ਤੋਂ ਬਚਾਅ' },
    te: { name: 'రక్షణ మాస్క్', desc: 'మందు వాసన పీల్చవద్దు' },
    bn: { name: 'সুরক্ষা মাস্ক', desc: 'বাষ্প নিঃশ্বাসে নেওয়া আটকান' },
    es: { name: 'Mascarilla', desc: 'Evitar inhalar la niebla' },
    sw: { name: 'Barakoa', desc: 'Epuka kuvuta mvuke' }
  },
  'gloves': {
    en: { name: 'Rubber Gloves', desc: 'Prevent skin contact' },
    hi: { name: 'रबर के दस्ताने', desc: 'त्वचा के संपर्क से बचें' },
    mr: { name: 'रबरी हातमोजे', desc: 'त्वचेचा संपर्क टाळा' },
    pa: { name: 'ਰਬੜ ਦੇ ਦਸਤਾਨੇ', desc: 'ਚਮੜੀ ਦੇ ਸੰਪਰਕ ਤੋਂ ਬਚੋ' },
    te: { name: 'రబ్బరు చేతి తొడుగులు', desc: 'చర్మంపై పడకుండా చూసుకోండి' },
    bn: { name: 'রবারের গ্লাভস', desc: 'ত্বকে লাগা থেকে আটকান' },
    es: { name: 'Guantes de Goma', desc: 'Evitar contacto con la piel' },
    sw: { name: 'Glovu za Mpira', desc: 'Zuia kugusa ngozi' }
  },
  'goggles': {
    en: { name: 'Eye Goggles', desc: 'Shield from spray drift' },
    hi: { name: 'सुरक्षा चश्मा', desc: 'आंखों में छींटे जाने से रोकें' },
    mr: { name: 'सुरक्षा चष्मा', desc: 'डोळ्यात औषध जाण्यापासून रोखा' },
    pa: { name: 'ਸੁਰੱਖਿਆ ਐਨਕਾਂ', desc: 'ਅੱਖਾਂ ਵਿੱਚ ਛਿੱਟੇ ਪੈਣ ਤੋਂ ਬਚਾਓ' },
    te: { name: 'రక్షణ కళ్లద్దాలు', desc: 'కళ్లల్లో మందు పడకుండా' },
    bn: { name: 'সুরক্ষা চশমা', desc: 'চোখে ছিটে আসা আটকান' },
    es: { name: 'Gafas Protectoras', desc: 'Proteger ojos de salpicaduras' },
    sw: { name: 'Miwani ya Kulinda', desc: 'Kinga macho dhidi ya dawa' }
  },
  'boots': {
    en: { name: 'Rubber Boots', desc: 'Keep feet covered' },
    hi: { name: 'रबर के जूते', desc: 'पैरों को सुरक्षित रखें' },
    mr: { name: 'रबरी गमबूट', desc: 'पाय झाकून ठेवा' },
    pa: { name: 'ਰਬੜ ਦੇ ਬੂਟ', desc: 'ਪੈਰ ਢੱਕ ਕੇ ਰੱਖੋ' },
    te: { name: 'రబ్బరు బూట్లు', desc: 'కాళ్లను రక్షించుకోండి' },
    bn: { name: 'রবারের গামবুট', desc: 'পা সুরক্ষিত রাখুন' },
    es: { name: 'Botas de Goma', desc: 'Mantener pies cubiertos' },
    sw: { name: 'Boti za Mpira', desc: 'Weka miguu ikiwa imefunikwa' }
  }
};

export function translateSafetyGear(gear: string, lang: LanguageCode): SafetyGearInfo {
  const g = gear.toLowerCase();
  let key = 'mask';
  if (g.includes('glove')) key = 'gloves';
  else if (g.includes('goggle') || g.includes('eye')) key = 'goggles';
  else if (g.includes('boot') || g.includes('shoe')) key = 'boots';
  else if (g.includes('mask') || g.includes('face')) key = 'mask';

  return safetyGearTranslations[key]?.[lang] || safetyGearTranslations[key]?.en || { name: gear, desc: '' };
}

// Days of week translations
export const dayTranslations: Record<string, Record<LanguageCode, string>> = {
  'Today': { en: 'Today', hi: 'आज', mr: 'आज', pa: 'ਅੱਜ', te: 'ఈ రోజు', bn: 'আজ', es: 'Hoy', sw: 'Leo' },
  'Tomorrow': { en: 'Tomorrow', hi: 'कल', mr: 'उद्या', pa: 'ਕੱਲ੍ਹ', te: 'రేపు', bn: 'আগামীকাল', es: 'Mañana', sw: 'Kesho' },
  'Mon': { en: 'Mon', hi: 'सोम', mr: 'सोम', pa: 'ਸੋਮ', te: 'సోమ', bn: 'সোম', es: 'Lun', sw: 'Jtt' },
  'Tue': { en: 'Tue', hi: 'मंगल', mr: 'मंगळ', pa: 'ਮੰਗਲ', te: 'మంగళ', bn: 'মঙ্গল', es: 'Mar', sw: 'Jnn' },
  'Wed': { en: 'Wed', hi: 'बुध', mr: 'बुध', pa: 'ਬੁੱਧ', te: 'బుధ', bn: 'বুধ', es: 'Mié', sw: 'Tnn' },
  'Thu': { en: 'Thu', hi: 'गुरु', mr: 'गुरु', pa: 'ਵੀਰ', te: 'గురు', bn: 'বৃহঃ', es: 'Jue', sw: 'Alh' },
  'Fri': { en: 'Fri', hi: 'शुक्र', mr: 'शुक्र', pa: 'ਸ਼ੁੱਕਰ', te: 'శుక్ర', bn: 'শুক্র', es: 'Vie', sw: 'Iju' },
  'Sat': { en: 'Sat', hi: 'शनि', mr: 'शनि', pa: 'ਸ਼ਨਿ', te: 'శని', bn: 'শনি', es: 'Sáb', sw: 'Jms' },
  'Sun': { en: 'Sun', hi: 'रवि', mr: 'रवि', pa: 'ਐਤ', te: 'ఆది', bn: 'রবি', es: 'Dom', sw: 'Jpl' }
};

export function translateDay(day: string, lang: LanguageCode): string {
  if (!day) return day;
  return dayTranslations[day]?.[lang] || day;
}

// Soil Type Helpers
export function translateSoilType(soil: string, lang: LanguageCode): string {
  if (!soil) return soil;
  const s = soil.toLowerCase();
  if (s.includes('black') || s.includes('clayey')) {
    return soilTranslations['black']?.[lang] || soil;
  }
  if (s.includes('red') || s.includes('loamy')) {
    return soilTranslations['red']?.[lang] || soil;
  }
  if (s.includes('sandy')) {
    return soilTranslations['sandy']?.[lang] || soil;
  }
  if (s.includes('alluvial')) {
    return soilTranslations['alluvial']?.[lang] || soil;
  }
  return soilTranslations[s]?.[lang] || soil;
}

// Spray Suitability Translations
export const spraySuitabilityTranslations: Record<string, Record<LanguageCode, { label: string; icon: string }>> = {
  excellent: {
    en: { label: 'Safe to Spray', icon: '🟢' },
    hi: { label: 'छिड़काव के लिए सुरक्षित', icon: '🟢' },
    mr: { label: 'फवारणीसाठी सुरक्षित', icon: '🟢' },
    pa: { label: 'ਸਪਰੇਅ ਲਈ ਸੁਰੱਖਿਅਤ', icon: '🟢' },
    te: { label: 'పిచికారీకి అనుకూలం', icon: '🟢' },
    bn: { label: 'স্প্রে করার জন্য নিরাপদ', icon: '🟢' },
    es: { label: 'Seguro para Pulverizar', icon: '🟢' },
    sw: { label: 'Salama Kupulizia', icon: '🟢' }
  },
  caution: {
    en: { label: 'Caution / Moderate', icon: '🟡' },
    hi: { label: 'सावधानी रखें', icon: '🟡' },
    mr: { label: 'सावधगिरी बाळगा', icon: '🟡' },
    pa: { label: 'ਸਾਵਧਾਨੀ ਵਰਤੋ', icon: '🟡' },
    te: { label: 'జాగ్రత్త / మధ్యస్థం', icon: '🟡' },
    bn: { label: 'সতর্কতা অবলম্বন করুন', icon: '🟡' },
    es: { label: 'Precaución', icon: '🟡' },
    sw: { label: 'Tahadhari', icon: '🟡' }
  },
  danger: {
    en: { label: 'Do Not Spray', icon: '🔴' },
    hi: { label: 'छिड़काव न करें', icon: '🔴' },
    mr: { label: 'फवारणी करू नका', icon: '🔴' },
    pa: { label: 'ਸਪਰੇਅ ਨਾ ਕਰੋ', icon: '🔴' },
    te: { label: 'పిచికారీ చేయవద్దు', icon: '🔴' },
    bn: { label: 'স্প্রে করবেন না', icon: '🔴' },
    es: { label: 'No Pulverizar', icon: '🔴' },
    sw: { label: 'Usipulize Dawa', icon: '🔴' }
  }
};

export function translateSpraySuitability(suitability: string, lang: LanguageCode): { label: string; icon: string } {
  if (!suitability) return { label: suitability, icon: '' };
  return spraySuitabilityTranslations[suitability]?.[lang] || spraySuitabilityTranslations[suitability]?.en || { label: suitability, icon: '' };
}
