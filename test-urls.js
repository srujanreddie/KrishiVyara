const urls = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1592417817098-8f3d6eb2252a?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1582017032707-16d2ebdc7e00?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?w=1200&auto=format&fit=crop&q=80"
];

Promise.all(urls.map(url => fetch(url).then(res => ({url, status: res.status}))))
  .then(results => console.log(results.filter(r => r.status !== 200)));
