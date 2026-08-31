const q = process.argv[2];
fetch(`https://commons.wikimedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=1`, {
  headers: { "User-Agent": "AIStudioBot/1.0" }
})
  .then(r => r.json())
  .then(d => {
    const pages = d.query?.pages;
    if (!pages) return console.log(q, "-> Not found");
    for (let p in pages) {
      if (pages[p].original) {
        console.log(q, "->", pages[p].original.source);
      }
    }
  }).catch(e => console.error(e));
