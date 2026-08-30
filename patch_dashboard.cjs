const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Replacements
code = code.replace(/\{t\.greeting\}, \{userProfile\.name\.split\(' '\)\[0\]\}/g, "{t.greeting}, {userProfile.name.split(' ')[0]}");
code = code.replace(/\{userProfile\.primaryCrops\.join\(', '\)\} Farm • \{userProfile\.farmSizeAcres\} Acres/g, "{userProfile.primaryCrops.join(', ')} {t.farmLabel} • {userProfile.farmSizeAcres} {t.acres}");

code = code.replace(/'⚠️ Rain Risk Alert'/g, "t.rainRiskAlert");
code = code.replace(/'🌤️ Field Spray Advisory'/g, "t.sprayAdvisory");

code = code.replace(/'Locating GPS\.\.\.'/g, "t.locatingGps");
code = code.replace(/'Optimal conditions for spraying fertilizers or safe bio-fungicides\.'/g, "t.optimalConditions");

code = code.replace(/💧 \{weather\.humidity\}% Humidity/g, "💧 {weather.humidity}% {t.humidityLabel}");
code = code.replace(/💨 \{weather\.windSpeedKmh\} km\/h Wind/g, "💨 {weather.windSpeedKmh} km/h {t.windLabel}");

code = code.replace(/7-Day Forecast &rarr;/g, "{t.forecast7Day} &rarr;");

code = code.replace(/<span>AI Vision Disease Detection<\/span>/g, "<span>{t.aiVisionBadge}</span>");
code = code.replace(/Tap to Scan/g, "{t.tapToScan}");

code = code.replace(/Quick Farming Tools/g, "{t.quickFarmingTools}");
code = code.replace(/Exact spoons per pump/g, "{t.exactSpoons}");
code = code.replace(/Voice call \/ Ask KVK/g, "{t.voiceCallKvk}");
code = code.replace(/Rain & spray timings/g, "{t.rainSprayTimings}");

code = code.replace(/\{diaryEntries\.length\} field records/g, "{diaryEntries.length} {t.fieldRecords}");
code = code.replace(/Latest Plant Doctor Diagnosis/g, "{t.latestDiagnosis}");

code = code.replace(/\{latestScan\.severity\} severity/g, "{latestScan.severity} {t.severityLevel}");
code = code.replace(/\{latestScan\.confidenceScore\}% AI Confidence/g, "{latestScan.confidenceScore}% {t.aiConfidence}");

code = code.replace(/1-Tap Today's Field Log/g, "{t.oneTapLog}");
code = code.replace(/Quickly record today's farm work for expert reference/g, "{t.quickRecordWork}");
code = code.replace(/View All Diary &rarr;/g, "{t.viewAllDiary} &rarr;");

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Dashboard patched");
