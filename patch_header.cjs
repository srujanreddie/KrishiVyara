const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// I will just add the translations to translations.ts first
const newKeys = {
  sunModeOn: { en: "Sun Mode: ON", hi: "धूप मोड: चालू", mr: "सूर्य मोड: चालू", pa: "ਧੁੱਪ ਮੋਡ: ਚਾਲੂ", te: "సన్ మోడ్: ఆన్", bn: "সান মোড: চালু", es: "Modo Sol: ON", sw: "Hali ya Jua: IMEWASHWA" },
  sunMode: { en: "Sun Mode", hi: "धूप मोड", mr: "सूर्य मोड", pa: "ਧੁੱਪ ਮੋਡ", te: "సన్ మోడ్", bn: "সান মোড", es: "Modo Sol", sw: "Hali ya Jua" },
  safeToSprayChip: { en: "✓ Safe to Spray", hi: "✓ छिड़काव सुरक्षित", mr: "✓ फवारणी सुरक्षित", pa: "✓ ਸਪਰੇਅ ਸੁਰੱਖਿਅਤ", te: "✓ పిచికారీ సురక్షితం", bn: "✓ স্প্রে নিরাপদ", es: "✓ Seguro Pulverizar", sw: "✓ Salama Kupuliza" },
  rainRiskChip: { en: "Rain Risk!", hi: "बारिश खतरा!", mr: "पावसाचा धोका!", pa: "ਮੀਂਹ ਦਾ ਖਤਰਾ!", te: "వర్షం ముప్పు!", bn: "বৃষ্টির ঝুঁকি!", es: "¡Riesgo de Lluvia!", sw: "Hatari ya Mvua!" }
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

// Now patch Header.tsx
code = code.replace(/'Sun Mode: ON'/g, "t.sunModeOn");
code = code.replace(/'Sun Mode'/g, "t.sunMode");
code = code.replace(/'✓ Safe to Spray'/g, "t.safeToSprayChip");
code = code.replace(/'Rain Risk!'/g, "t.rainRiskChip");

fs.writeFileSync('src/components/Header.tsx', code);
console.log("Header patched");
