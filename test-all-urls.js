const urls = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
  "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05",
  "https://images.unsplash.com/photo-1536657464919-892534f60d6e",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
  "https://images.unsplash.com/photo-1588252303782-cb80119abd6d",
  "https://images.unsplash.com/photo-1551754655-cd27e38d2076",
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
  "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb",
  "https://images.unsplash.com/photo-1599839619722-39751411ea63",
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0",
  "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296"
];

Promise.all(urls.map(url => fetch(url).then(res => ({url, status: res.status}))))
  .then(results => console.log(results.filter(r => r.status !== 200)));
