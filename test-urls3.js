const urls = [
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800", // farm field
  "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800", // crops
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800" // crops
];
Promise.all(urls.map(url => fetch(url).then(res => ({url, status: res.status}))))
  .then(results => console.log(results));
