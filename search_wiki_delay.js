const q = process.argv[2];
fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(q)}`, {
  headers: { "User-Agent": "AIStudioBot/1.0 (test@example.com)" }
})
  .then(r => r.json())
  .then(d => {
    const pages = d.query.pages;
    for (let p in pages) {
      if (pages[p].original) {
        console.log(q, "->", pages[p].original.source);
      } else {
        console.log(q, "->", "No original image found");
      }
    }
  }).catch(e => console.error(e));
