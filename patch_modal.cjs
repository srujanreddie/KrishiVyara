const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfileModal.tsx', 'utf8');

const newKeys = {
  farmerProfileSettings: { en: "Farmer Profile & Settings", hi: "किसान प्रोफाइल और सेटिंग्स", mr: "शेतकरी प्रोफाइल आणि सेटिंग्ज", pa: "ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ", te: "రైతు ప్రొఫైల్ & సెట్టింగ్‌లు", bn: "কৃষক প্রোফাইল এবং সেটিংস", es: "Perfil del Agricultor y Ajustes", sw: "Wasifu wa Mkulima na Mipangilio" },
  personalizedAdvisory: { en: "Personalized agro-advisory for your land", hi: "आपकी ज़मीन के लिए अनुकूलित कृषि-सलाह", mr: "तुमच्या जमिनीसाठी वैयक्तिकृत कृषी-सल्ला", pa: "ਤੁਹਾਡੀ ਜ਼ਮੀਨ ਲਈ ਅਨੁਕੂਲਿਤ ਖੇਤੀ-ਸਲਾਹ", te: "మీ భూమికి వ్యక్తిగతీకరించిన వ్యవసాయ-సలహా", bn: "আপনার জমির জন্য ব্যক্তিগতকৃত কৃষি-পরামর্শ", es: "Asesoramiento agrícola personalizado para su tierra", sw: "Ushauri wa kilimo uliobinafsishwa kwa ardhi yako" },
  farmerName: { en: "Farmer Name:", hi: "किसान का नाम:", mr: "शेतकऱ्याचे नाव:", pa: "ਕਿਸਾਨ ਦਾ ਨਾਂ:", te: "రైతు పేరు:", bn: "কৃষকের নাম:", es: "Nombre del Agricultor:", sw: "Jina la Mkulima:" },
  mobileNumber: { en: "Mobile Number:", hi: "मोबाइल नंबर:", mr: "मोबाईल नंबर:", pa: "ਮੋਬਾਈਲ ਨੰਬਰ:", te: "మొబైల్ నంబర్:", bn: "মোবাইল নম্বর:", es: "Número de Móvil:", sw: "Nambari ya Simu:" },
  farmLocationHeader: { en: "Farm Location", hi: "खेत का स्थान", mr: "शेताचे स्थान", pa: "ਖੇਤ ਦਾ ਸਥਾਨ", te: "పొలం స్థానం", bn: "খামারের অবস্থান", es: "Ubicación de la Granja", sw: "Eneo la Shamba" },
  villageLabel: { en: "Village / Block:", hi: "गाँव / ब्लॉक:", mr: "गाव / ब्लॉक:", pa: "ਪਿੰਡ / ਬਲਾਕ:", te: "గ్రామం / బ్లాక్:", bn: "গ্রাম / ব্লক:", es: "Pueblo / Bloque:", sw: "Kijiji / Kitalu:" },
  districtLabel: { en: "District:", hi: "ज़िला:", mr: "जिल्हा:", pa: "ਜ਼ਿਲ੍ਹਾ:", te: "జిల్లా:", bn: "জেলা:", es: "Distrito:", sw: "Wilaya:" },
  stateLabel: { en: "State:", hi: "राज्य:", mr: "राज्य:", pa: "ਰਾਜ:", te: "రాష్ట్రం:", bn: "রাজ্য:", es: "Estado:", sw: "Mkoa:" },
  farmSizeDetails: { en: "Farm Size & Details", hi: "खेत का आकार और विवरण", mr: "शेताचा आकार आणि तपशील", pa: "ਖੇਤ ਦਾ ਆਕਾਰ ਅਤੇ ਵੇਰਵੇ", te: "పొలం పరిమాణం & వివరాలు", bn: "খামারের আকার এবং বিবরণ", es: "Tamaño y Detalles de la Granja", sw: "Ukubwa na Maelezo ya Shamba" },
  totalFarmAcres: { en: "Total Farm Acres:", hi: "कुल खेत एकड़:", mr: "एकूण शेत एकर:", pa: "ਕੁੱਲ ਖੇਤ ਏਕੜ:", te: "మొత్తం పొలం ఎకరాలు:", bn: "মোট খামার একর:", es: "Total de Acres:", sw: "Jumla ya Ekari:" },
  soilTypeLabel: { en: "Primary Soil Type:", hi: "मुख्य मिट्टी का प्रकार:", mr: "मुख्य मातीचा प्रकार:", pa: "ਮੁੱਖ ਮਿੱਟੀ ਦੀ ਕਿਸਮ:", te: "ప్రధాన మట్టి రకం:", bn: "প্রধান মাটির ধরণ:", es: "Tipo de Suelo Principal:", sw: "Aina Kuu ya Udongo:" },
  soilBlack: { en: "Black Cotton Soil", hi: "काली मिट्टी", mr: "काळी माती", pa: "ਕਾਲੀ ਮਿੱਟੀ", te: "నల్ల మట్టి", bn: "কালো মাটি", es: "Tierra Negra", sw: "Udongo Mweusi" },
  soilRed: { en: "Red Soil", hi: "लाल मिट्टी", mr: "लाल माती", pa: "ਲਾਲ ਮਿੱਟੀ", te: "ఎర్ర మట్టి", bn: "লাল মাটি", es: "Tierra Roja", sw: "Udongo Mwekundu" },
  soilAlluvial: { en: "Alluvial / Loamy", hi: "जलोढ़ / दोमट", mr: "गाळाची माती", pa: "ਜਲੋੜ੍ਹ / ਦੋਮਟ", te: "ఒండ్రు మట్టి", bn: "পলি মাটি", es: "Suelo Aluvial", sw: "Udongo wa Tifu" },
  primaryCropsHeader: { en: "Primary Crops Grown", hi: "उगाई जाने वाली मुख्य फसलें", mr: "मुख्य पिके", pa: "ਮੁੱਖ ਫਸਲਾਂ", te: "ప్రధాన పంటలు", bn: "প্রধান ফসল", es: "Cultivos Principales", sw: "Mazao Makuu" },
  voiceNarrationAcc: { en: "Voice Narration & Accessibility", hi: "वॉयस नरेशन और एक्सेसिबिलिटी", mr: "आवाज वर्णन आणि प्रवेशयोग्यता", pa: "ਆਵਾਜ਼ ਵਰਣਨ ਅਤੇ ਪਹੁੰਚਯੋਗਤਾ", te: "వాయిస్ నేరేషన్ & యాక్సెసిబిలిటీ", bn: "ভয়েস বিবরণ এবং অ্যাক্সেসিবিলিটি", es: "Narración de Voz y Accesibilidad", sw: "Maelezo ya Sauti na Ufikiaji" },
  appLanguageHeader: { en: "App Language (Local)", hi: "ऐप की भाषा (स्थानीय)", mr: "अॅपची भाषा (स्थानिक)", pa: "ਐਪ ਦੀ ਭਾਸ਼ਾ (ਸਥਾਨਕ)", te: "యాప్ భాష (స్థానిక)", bn: "অ্যাপের ভাষা (স্থানীয়)", es: "Idioma de la App (Local)", sw: "Lugha ya Programu (Ndani)" },
  saveProfileBtn: { en: "Save & Update Profile", hi: "प्रोफाइल सहेजें", mr: "प्रोफाइल जतन करा", pa: "ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਕਰੋ", te: "ప్రొఫైల్‌ను సేవ్ చేయండి", bn: "প্রোফাইল সেভ করুন", es: "Guardar y Actualizar Perfil", sw: "Hifadhi na Sasisha Wasifu" },
  autoReadSettingsLabel: { en: "Auto-Read Settings", hi: "ऑटो-रीड सेटिंग्स", mr: "ऑटो-रीड सेटिंग्ज", pa: "ਆਟੋ-ਰੀਡ ਸੈਟਿੰਗਾਂ", te: "ఆటో-రీడ్ సెట్టింగ్‌లు", bn: "অটো-রিড সেটিংস", es: "Ajustes de Auto-Lectura", sw: "Mipangilio ya Kusoma Kiotomatiki" },
  autoReadDesc: { en: "AI will automatically read out important weather alarms and diagnosis results.", hi: "AI स्वचालित रूप से महत्वपूर्ण मौसम अलार्म और निदान परिणाम पढ़ेगा।", mr: "AI स्वयंचलितपणे महत्त्वाचे हवामान अलार्म आणि निदान परिणाम वाचेल.", pa: "AI ਆਪਣੇ ਆਪ ਮਹੱਤਵਪੂਰਨ ਮੌਸਮ ਅਲਾਰਮ ਅਤੇ ਨਿਦਾਨ ਨਤੀਜੇ ਪੜ੍ਹੇਗਾ।", te: "AI స్వయంచాలకంగా ముఖ్యమైన వాతావరణ అలారాలు మరియు రోగనిర్ధారణ ఫలితాలను చదువుతుంది.", bn: "AI স্বয়ংক্রিয়ভাবে গুরুত্বপূর্ণ আবহাওয়া অ্যালার্ম এবং রোগ নির্ণয়ের ফলাফল পড়ে শোনাবে।", es: "La IA leerá automáticamente las alarmas meteorológicas importantes y los resultados de diagnóstico.", sw: "AI itasoma kiotomatiki kengele muhimu za hali ya hewa na matokeo ya utambuzi." }
};

let transCode = fs.readFileSync('src/data/translations.ts', 'utf8');

let interfaceMatch = transCode.match(/export interface TranslationDict \{([\s\S]*?)\}/);
if (interfaceMatch) {
  let interfaceBody = interfaceMatch[1];
  for (let key in newKeys) {
    if (!interfaceBody.includes(key + ':')) {
      interfaceBody += `  ${key}: string;\n`;
    }
  }
  transCode = transCode.replace(interfaceMatch[0], `export interface TranslationDict {${interfaceBody}}`);
}

let langs = ['en', 'hi', 'mr', 'pa', 'te', 'bn', 'es', 'sw'];
langs.forEach(lang => {
  let langRegex = new RegExp(`${lang}: \\{([\\s\\S]*?)\n  \\}`, 'g');
  transCode = transCode.replace(langRegex, (match, body) => {
    let additions = "";
    for (let key in newKeys) {
      if (!body.includes(key + ':')) {
        additions += `\n    ${key}: ${JSON.stringify(newKeys[key][lang])},`;
      }
    }
    return `${lang}: {${body}${additions}\n  }`;
  });
});

fs.writeFileSync('src/data/translations.ts', transCode);

// Patch UserProfileModal.tsx
code = code.replace(/>\s*Farmer Profile & Settings\s*<\/h3>/g, "> {t.farmerProfileSettings} </h3>");
code = code.replace(/>\s*Personalized agro-advisory for your land\s*<\/p>/g, "> {t.personalizedAdvisory} </p>");
code = code.replace(/>\s*Farmer Name:\s*<\/label>/g, "> {t.farmerName} </label>");
code = code.replace(/>\s*Mobile Number:\s*<\/label>/g, "> {t.mobileNumber} </label>");

code = code.replace(/<label className="font-black text-slate-800">\s*Farm Location\s*<\/label>/g, '<label className="font-black text-slate-800">\n                  {t.farmLocationHeader}\n                </label>');

code = code.replace(/>\s*Village \/ Block:\s*<\/label>/g, "> {t.villageLabel} </label>");
code = code.replace(/>\s*District:\s*<\/label>/g, "> {t.districtLabel} </label>");
code = code.replace(/>\s*State:\s*<\/label>/g, "> {t.stateLabel} </label>");

code = code.replace(/>\s*Farm Size & Details\s*<\/h4>/g, "> {t.farmSizeDetails} </h4>");
code = code.replace(/>\s*Total Farm Acres:\s*<\/label>/g, "> {t.totalFarmAcres} </label>");
code = code.replace(/>\s*Primary Soil Type:\s*<\/label>/g, "> {t.soilTypeLabel} </label>");

code = code.replace(/>\s*Black Cotton Soil\s*<\/option>/g, "> {t.soilBlack} </option>");
code = code.replace(/>\s*Red Soil\s*<\/option>/g, "> {t.soilRed} </option>");
code = code.replace(/>\s*Alluvial \/ Loamy\s*<\/option>/g, "> {t.soilAlluvial} </option>");

code = code.replace(/>\s*Primary Crops Grown\s*<\/label>/g, "> {t.primaryCropsHeader} </label>");
code = code.replace(/>\s*App Language \(Local\)\s*<\/label>/g, "> {t.appLanguageHeader} </label>");
code = code.replace(/>\s*Voice Narration & Accessibility\s*<\/h4>/g, "> {t.voiceNarrationAcc} </h4>");

code = code.replace(/>\s*Save & Update Profile\s*<\/span>/g, "> {t.saveProfileBtn} </span>");
code = code.replace(/>\s*Auto-Read Settings\s*<\/h4>/g, "> {t.autoReadSettingsLabel} </h4>");
code = code.replace(/>\s*AI will automatically read out important weather alarms and diagnosis results.\s*<\/p>/g, "> {t.autoReadDesc} </p>");


fs.writeFileSync('src/components/UserProfileModal.tsx', code);
console.log("Modal patched");
