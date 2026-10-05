// Roles: bat = batter, wk = wicket-keeper, ar = all-rounder, fast = pace bowler, spin = spinner.
// ODI career figures: avg/sr = batting average / strike rate, bavg = bowling average, econ = bowling economy.
// null = no reliable current figure found yet (shown as nothing on the card). Sources in README.
export const ROLE_LABEL = { bat: "Batter", wk: "Wicket-Keeper", ar: "All-Rounder", fast: "Fast Bowler", spin: "Spinner" };
 //Accent colour per role, shared by cards, the squad panel and the analytics charts.
export const ROLE_COLOR = { bat: "#3b82f6", wk: "#38bdf8", ar: "#FF9933", fast: "#22c55e", spin: "#c084fc" };

export const initials = name => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

export const PLAYERS = [
  { id: "rohit", name: "Rohit Sharma", role: "bat", avg: 48.95, sr: 93.04, bavg: null, econ: null },
  { id: "gill", name: "Shubman Gill", role: "bat", avg: 60.33, sr: null, bavg: null, econ: null, tag: "2026 ODIs: 561 runs in 8 innings, avg 93.5" },
  { id: "kohli", name: "Virat Kohli", role: "bat", avg: 58.59, sr: null, bavg: null, econ: null, tag: "2026 ODIs: 384 runs in 6 innings" },
  { id: "iyer", name: "Shreyas Iyer", role: "bat", avg: 45.98, sr: 98.6, bavg: null, econ: null, tag: "India's T20I captain" },
  { id: "jaiswal", name: "Yashasvi Jaiswal", role: "bat", avg: 71.25, sr: 97.6, bavg: null, econ: null },
  { id: "tilak", name: "Tilak Varma", role: "bat", avg: null, sr: null, bavg: null, econ: null, tag: "India's T20I vice-captain" },
  { id: "sky", name: "Suryakumar Yadav", role: "bat", avg: 25.76, sr: 105.02, bavg: null, econ: null },
  { id: "ruturaj", name: "Ruturaj Gaikwad", role: "bat", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI ODI squad" },
  { id: "rahul", name: "KL Rahul", role: "wk", avg: 50.73, sr: 91, bavg: null, econ: null },
  { id: "pant", name: "Rishabh Pant", role: "wk", avg: null, sr: null, bavg: null, econ: null },
  { id: "samson", name: "Sanju Samson", role: "wk", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI T20I squad" },
  { id: "kishan", name: "Ishan Kishan", role: "wk", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI T20I squad" },
  { id: "jurel", name: "Dhruv Jurel", role: "wk", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI ODI squad" },
  { id: "hardik", name: "Hardik Pandya", role: "ar", avg: 32.82, sr: 110.89, bavg: 35.5, econ: null },
  { id: "jadeja", name: "Ravindra Jadeja", role: "ar", avg: 32, sr: 85.54, bavg: 36.78, econ: 4.89 },
  { id: "axar", name: "Axar Patel", role: "ar", avg: 23.53, sr: 92.26, bavg: 32.73, econ: 4.54, tag: "In India's WI T20I squad" },
  { id: "sundar", name: "Washington Sundar", role: "ar", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI T20I squad" },
  { id: "nitish", name: "Nitish Kumar Reddy", role: "ar", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI ODI & T20I squads" },
  { id: "dube", name: "Shivam Dube", role: "ar", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI T20I squad" },
  { id: "bumrah", name: "Jasprit Bumrah", role: "fast", avg: null, sr: null, bavg: 23.74, econ: 4.59 },
  { id: "siraj", name: "Mohammed Siraj", role: "fast", avg: null, sr: null, bavg: 25.32, econ: 5.13, tag: "In India's WI ODI squad" },
  { id: "shami", name: "Mohammed Shami", role: "fast", avg: null, sr: null, bavg: 24.05, econ: 5.58 },
  { id: "arshdeep", name: "Arshdeep Singh", role: "fast", avg: null, sr: null, bavg: 24.44, econ: null, tag: "In India's WI T20I squad" },
  { id: "harshit", name: "Harshit Rana", role: "fast", avg: null, sr: null, bavg: null, econ: null },
  { id: "prasidh", name: "Prasidh Krishna", role: "fast", avg: null, sr: null, bavg: 26.62, econ: null, tag: "India's top ODI wicket-taker of 2026: 15 wkts in 8" },
  { id: "akash", name: "Akash Deep", role: "fast", avg: null, sr: null, bavg: null, econ: null },
  { id: "kuldeep", name: "Kuldeep Yadav", role: "spin", avg: null, sr: null, bavg: 26.7, econ: 5.06, tag: "In India's WI ODI & T20I squads" },
  { id: "varun", name: "Varun Chakaravarthy", role: "spin", avg: null, sr: null, bavg: null, econ: null },
  { id: "bishnoi", name: "Ravi Bishnoi", role: "spin", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI T20I squad" },
  // Added Oct 2026 from recent India squads / IPL form. Only international facts are shown on cards.
  { id: "vaibhav", name: "Vaibhav Sooryavanshi", role: "bat", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI T20I squad" },
  { id: "sudharsan", name: "Sai Sudharsan", role: "bat", avg: null, sr: null, bavg: null, econ: null },
  { id: "abhishek", name: "Abhishek Sharma", role: "bat", avg: null, sr: null, bavg: null, econ: null, tag: "30-ball T20I hundred vs Afghanistan, Sep 2026" },
  { id: "patidar", name: "Rajat Patidar", role: "bat", avg: null, sr: null, bavg: null, econ: null },
  { id: "prabhsimran", name: "Prabhsimran Singh", role: "wk", avg: null, sr: null, bavg: null, econ: null },
  { id: "dhir", name: "Naman Dhir", role: "ar", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI ODI squad" },
  { id: "krunal", name: "Krunal Pandya", role: "ar", avg: null, sr: null, bavg: null, econ: null },
  { id: "bhuvi", name: "Bhuvneshwar Kumar", role: "fast", avg: null, sr: null, bavg: null, econ: null },
  { id: "rasikh", name: "Rasikh Salam Dar", role: "fast", avg: null, sr: null, bavg: null, econ: null },
  { id: "tyagi", name: "Kartik Tyagi", role: "fast", avg: null, sr: null, bavg: null, econ: null },
  { id: "prince", name: "Prince Yadav", role: "fast", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI T20I squad" },
  { id: "mayank", name: "Mayank Yadav", role: "fast", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI T20I squad" },
  { id: "gurnoor", name: "Gurnoor Brar", role: "fast", avg: null, sr: null, bavg: null, econ: null, tag: "In India's WI ODI squad" },
  { id: "auqib", name: "Auqib Nabi", role: "fast", avg: null, sr: null, bavg: null, econ: null, tag: "First ODI call-up, Sep 2026" },
  { id: "mukesh", name: "Mukesh Kumar", role: "fast", avg: null, sr: null, bavg: null, econ: null },
];

export const byId = Object.fromEntries(PLAYERS.map(p => [p.id, p]));

// [min, max] per group for a valid 15-player squad
export const RULES = { bat: [4, 7], bowl: [5, 8], ar: [1, 4], wk: [1, 2], minFast: 3, minSpin: 1 };

export const count = ids => {
  const c = { bat: 0, bowl: 0, ar: 0, wk: 0, fast: 0, spin: 0 };
  ids.forEach(id => {
    const r = byId[id]?.role;
    if (!r) return;
    if (r === "fast" || r === "spin") { c.bowl++; c[r]++; } else c[r]++;
  });
  return c;
};
