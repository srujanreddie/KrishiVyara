const q = process.argv[2];
fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(q)}`)
  .then(r => r.json())
  .then(d => {
    const pages = d.query.pages;
    for (let p in pages) {
      if (pages[p].original) {
        console.log(pages[p].original.source);
      }
    }
  });
