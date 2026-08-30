const urls = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
  "https://images.unsplash.com/photo-1495107334309-efcfd3f199b7?w=1200",
  "https://images.unsplash.com/photo-1586771107146-f1690bb3cb07?w=1200",
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800",
  "https://images.unsplash.com/photo-1530836369250-ef71a35921bf?w=800"
];

Promise.all(urls.map(url => fetch(url).then(res => ({url, status: res.status}))))
  .then(results => console.log(results));
