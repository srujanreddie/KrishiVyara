const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf8');

// The file has several scan items in sampleDiseases.
// Let's replace the imageUrls matching the crop name.

// Tomato
code = code.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1464226184884-fa280b87c399\?[^']+'/g,
  "'https://upload.wikimedia.org/wikipedia/commons/0/04/Alternaria_solani_-_leaf_lesions.jpg'"
);

// Cotton
code = code.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1598965675045-45c5e72c7d05\?[^']+'/g,
  "'https://upload.wikimedia.org/wikipedia/commons/f/f2/Pectinophora_gossypiella_1265079.jpg'"
);

// Rice
code = code.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1536657464919-892534f60d6e\?[^']+'/g,
  "'https://upload.wikimedia.org/wikipedia/commons/b/b1/Bacterial_blight_of_rice.jpeg'"
);

// Wheat
code = code.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1500937386664-56d1dfef3854\?[^']+'/g,
  "'https://upload.wikimedia.org/wikipedia/commons/d/d4/Wheat_leaf_rust_on_wheat.jpg'"
);

// Chili
code = code.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1588252303782-cb80119abd6d\?[^']+'/g,
  "'https://upload.wikimedia.org/wikipedia/commons/6/67/Taphrina_deformans_1.jpg'"
);

// Corn
code = code.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1551754655-cd27e38d2076\?[^']+'/g,
  "'https://upload.wikimedia.org/wikipedia/commons/4/44/Spodoptera_frugiperda.jpg'"
);

// Potato
code = code.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1518977676601-b53f82aba655\?[^']+'/g,
  "'https://upload.wikimedia.org/wikipedia/commons/a/aa/Late_blight_on_potato_leaf_2.jpg'"
);

// Onion
code = code.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1618512496248-a07fe83aa8cb\?[^']+'/g,
  "'https://upload.wikimedia.org/wikipedia/commons/8/8d/Alternaria_porri_%28396462144%29.jpg'"
);


fs.writeFileSync('src/data/mockData.ts', code);
console.log("mockData patched successfully.");
