const fs = require('fs');
let code = fs.readFileSync('src/data/translations.ts', 'utf8');

const newKeys = {
  greeting: { en: "Hello", hi: "नमस्ते", mr: "नमस्कार", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", te: "నమస్కారం", bn: "নমস্কার", es: "Hola", sw: "Jambo" },
  farmLabel: { en: "Farm", hi: "खेत", mr: "शेत", pa: "ਖੇਤ", te: "పొలం", bn: "খামার", es: "Granja", sw: "Shamba" },
  rainRiskAlert: { en: "⚠️ Rain Risk Alert", hi: "⚠️ बारिश का अलर्ट", mr: "⚠️ पावसाचा इशारा", pa: "⚠️ ਮੀਂਹ ਦਾ ਅਲਰਟ", te: "⚠️ వర్షం హెచ్చరిక", bn: "⚠️ বৃষ্টির সতর্কতা", es: "⚠️ Alerta de Lluvia", sw: "⚠️ Tahadhari ya Mvua" },
  sprayAdvisory: { en: "🌤️ Field Spray Advisory", hi: "🌤️ छिड़काव सलाह", mr: "🌤️ फवारणी सल्ला", pa: "🌤️ ਸਪਰੇਅ ਸਲਾਹ", te: "🌤️ పిచికారీ సలహా", bn: "🌤️ স্প্রে করার পরামর্শ", es: "🌤️ Aviso de Pulverización", sw: "🌤️ Ushauri wa Dawa" },
  locatingGps: { en: "Locating GPS...", hi: "GPS खोज रहा है...", mr: "GPS शोधत आहे...", pa: "GPS ਲੱਭ ਰਿਹਾ ਹੈ...", te: "GPS వెతుకుతోంది...", bn: "GPS খুঁজছে...", es: "Localizando GPS...", sw: "Inatafuta GPS..." },
  optimalConditions: { en: "Optimal conditions for spraying.", hi: "छिड़काव के लिए अनुकूल समय।", mr: "फवारणीसाठी उत्तम वेळ.", pa: "ਸਪਰੇਅ ਲਈ ਢੁਕਵਾਂ ਸਮਾਂ।", te: "పిచికారీకి అనుకూల సమయం.", bn: "স্প্রে করার উপযুক্ত সময়।", es: "Condiciones óptimas.", sw: "Wakati mzuri wa kupuliza." },
  humidityLabel: { en: "Humidity", hi: "नमी", mr: "आर्द्रता", pa: "ਨਮੀ", te: "తేమ", bn: "আর্দ্রতা", es: "Humedad", sw: "Unyevu" },
  windLabel: { en: "Wind", hi: "हवा", mr: "वारा", pa: "ਹਵਾ", te: "గాలి", bn: "বাতাস", es: "Viento", sw: "Upepo" },
  forecast7Day: { en: "7-Day Forecast", hi: "7-दिन का मौसम", mr: "7 दिवसांचा अंदाज", pa: "7-ਦਿਨ ਦਾ ਮੌਸਮ", te: "7-రోజుల వాతావరణం", bn: "৭-দিনের আবহাওয়া", es: "Pronóstico 7 Días", sw: "Hali ya Hewa Siku 7" },
  aiVisionBadge: { en: "AI Vision Disease Detection", hi: "AI द्वारा रोग पहचान", mr: "AI द्वारे रोग ओळख", pa: "AI ਰਾਹੀਂ ਰੋਗ ਦੀ ਪਛਾਣ", te: "AI వ్యాధి గుర్తింపు", bn: "AI রোগ শনাক্তকরণ", es: "Detección IA", sw: "Utambuzi wa AI" },
  tapToScan: { en: "Tap to Scan", hi: "स्कैन करने के लिए दबाएं", mr: "स्कॅन करण्यासाठी दाबा", pa: "ਸਕੈਨ ਲਈ ਦਬਾਓ", te: "స్కాన్ చేయడానికి నొక్కండి", bn: "স্ক্যান করতে চাপুন", es: "Toca para escanear", sw: "Gusa ili uchanganue" },
  quickFarmingTools: { en: "Quick Farming Tools", hi: "त्वरित कृषि उपकरण", mr: "शेतीची साधने", pa: "ਖੇਤੀ ਟੂਲ", te: "వ్యవసాయ సాధనాలు", bn: "কৃষি টুলস", es: "Herramientas Rápidas", sw: "Zana za Kilimo" },
  exactSpoons: { en: "Exact spoons per pump", hi: "पंप के अनुसार चम्मच", mr: "पंपासाठी अचूक चमचे", pa: "ਪੰਪ ਲਈ ਸਹੀ ਚਮਚੇ", te: "పంపుకు సరైన చెంచాలు", bn: "পাম্প অনুযায়ী চামচ", es: "Cucharas por bomba", sw: "Vijiko kwa bomba" },
  voiceCallKvk: { en: "Voice call / Ask KVK", hi: "कॉल करें / KVK से पूछें", mr: "कॉल करा / KVK ला विचारा", pa: "ਕਾਲ ਕਰੋ / KVK ਨੂੰ ਪੁੱਛੋ", te: "కాల్ చేయండి / KVKని అడగండి", bn: "কল করুন / KVK কে জিজ্ঞাসা করুন", es: "Llamada / KVK", sw: "Piga Simu / KVK" },
  rainSprayTimings: { en: "Rain & spray timings", hi: "बारिश और छिड़काव का समय", mr: "पाऊस आणि फवारणीची वेळ", pa: "ਮੀਂਹ ਅਤੇ ਸਪਰੇਅ ਦਾ ਸਮਾਂ", te: "వర్షం & పిచికారీ సమయం", bn: "বৃষ্টি ও স্প্রে করার সময়", es: "Lluvia y pulverización", sw: "Mvua na dawa" },
  fieldRecords: { en: "field records", hi: "खेत रिकॉर्ड", mr: "शेताच्या नोंदी", pa: "ਖੇਤ ਰਿਕਾਰਡ", te: "పొలం రికార్డులు", bn: "খামার রেকর্ড", es: "registros", sw: "kumbukumbu" },
  latestDiagnosis: { en: "Latest Plant Doctor Diagnosis", hi: "नवीनतम डॉक्टर जांच", mr: "नवीनतम पीक डॉक्टर तपासणी", pa: "ਨਵੀਨਤਮ ਡਾਕਟਰ ਜਾਂਚ", te: "తాజా డాక్టర్ పరీక్ష", bn: "সর্বশেষ ডাক্তার পরীক্ষা", es: "Último Diagnóstico", sw: "Uchunguzi wa Daktari" },
  severityLevel: { en: "severity", hi: "गंभीरता", mr: "तीव्रता", pa: "ਗੰਭੀਰਤਾ", te: "తీవ్రత", bn: "তীব্রতা", es: "severidad", sw: "hatari" },
  aiConfidence: { en: "AI Confidence", hi: "AI सटीकता", mr: "AI अचूकता", pa: "AI ਸਟੀਕਤਾ", te: "AI ఖచ్చితత్వం", bn: "AI সঠিকতা", es: "Confianza IA", sw: "Uhakika wa AI" },
  oneTapLog: { en: "1-Tap Today's Field Log", hi: "आज का काम दर्ज करें", mr: "आजचे काम नोंदवा", pa: "ਅੱਜ ਦਾ ਕੰਮ ਦਰਜ ਕਰੋ", te: "నేటి పని నమోదు చేయండి", bn: "আজকের কাজ সংরক্ষণ করুন", es: "Registro Diario", sw: "Kazi ya Leo" },
  quickRecordWork: { en: "Quickly record today's farm work", hi: "आज के कृषि कार्य को दर्ज करें", mr: "आजचे शेतीचे काम लवकर नोंदवा", pa: "ਅੱਜ ਦਾ ਖੇਤੀ ਕੰਮ ਦਰਜ ਕਰੋ", te: "నేటి వ్యవసాయ పనిని త్వరగా నమోదు చేయండి", bn: "আজকের খামার কাজ দ্রুত সংরক্ষণ করুন", es: "Registre rápidamente el trabajo", sw: "Rekodi kazi ya leo haraka" },
  viewAllDiary: { en: "View All Diary", hi: "पूरी डायरी देखें", mr: "संपूर्ण डायरी पहा", pa: "ਪੂਰੀ ਡਾਇਰੀ ਦੇਖੋ", te: "పూర్తి డైరీ చూడండి", bn: "সম্পূর্ণ ডায়েরি দেখুন", es: "Ver Todo", sw: "Tazama Yote" }
};

// 1. Add types to TranslationDict
let interfaceMatch = code.match(/export interface TranslationDict \{([\s\S]*?)\}/);
if (interfaceMatch) {
  let interfaceBody = interfaceMatch[1];
  for (let key in newKeys) {
    if (!interfaceBody.includes(key + ':')) {
      interfaceBody += `  ${key}: string;\n`;
    }
  }
  code = code.replace(interfaceMatch[0], `export interface TranslationDict {${interfaceBody}}`);
}

// 2. Add translations to each language
let langs = ['en', 'hi', 'mr', 'pa', 'te', 'bn', 'es', 'sw'];
langs.forEach(lang => {
  let langRegex = new RegExp(`${lang}: \\{([\\s\\S]*?)\n  \\}`, 'g');
  code = code.replace(langRegex, (match, body) => {
    let additions = "";
    for (let key in newKeys) {
      if (!body.includes(key + ':')) {
        additions += `\n    ${key}: ${JSON.stringify(newKeys[key][lang])},`;
      }
    }
    // remove trailing comma if there is one on additions
    return `${lang}: {${body}${additions}\n  }`;
  });
});

fs.writeFileSync('src/data/translations.ts', code);
console.log("Translations added");
