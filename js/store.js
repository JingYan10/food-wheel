/* ============================================================
   DATA LAYER
   Everything goes through Store. Data is saved only on this
   device (localStorage), so each user has their own copy.
   Later, swap these methods for API calls / SQLite without
   touching the UI code.
   ============================================================ */
const MEALS = ['breakfast', 'lunch', 'dinner'];
const MEAL_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
const MEAL_COLOR = { breakfast: 'var(--breakfast)', lunch: 'var(--lunch)', dinner: 'var(--dinner)' };

const Store = (() => {
  const KEY = 'makanwheel.v1';
  let memory = null; // fallback if storage is blocked

  // New users start empty and add their own foods
  const defaults = () => ({
    foods: [], // [{ id, name: "Nasi lemak", meals: ["breakfast", "lunch"] }]
    records: {} // { "2026-10-24": { breakfast: "Roti canai", lunch: ..., dinner: ... } }
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return memory || defaults();
  }
  function save(data) {
    memory = data;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  let data = load();
  save(data);

  return {
    foods: () => data.foods,
    foodsFor: meal => data.foods.filter(f => f.meals.includes(meal)),
    addFood(name, meals) {
      data.foods.push({ id: uid(), name, meals }); save(data);
    },
    removeFood(id) {
      data.foods = data.foods.filter(f => f.id !== id); save(data);
    },
    toggleFoodMeal(id, meal) {
      const f = data.foods.find(f => f.id === id);
      if (!f) return;
      f.meals = f.meals.includes(meal) ? f.meals.filter(m => m !== meal) : [...f.meals, meal];
      save(data);
    },
    recordMeal(date, meal, foodName) {
      data.records[date] = data.records[date] || {};
      data.records[date][meal] = foodName; save(data);
    },
    clearMeal(date, meal) {
      if (!data.records[date]) return;
      delete data.records[date][meal];
      if (!Object.keys(data.records[date]).length) delete data.records[date];
      save(data);
    },
    day: date => data.records[date] || {},
    records: () => data.records,

    /* Backup: plain JSON the user can save as a file and load on any device */
    exportJSON() {
      return JSON.stringify({ app: 'makanwheel', version: 1, exportedAt: new Date().toISOString(), ...data }, null, 2);
    },
    importJSON(text) {
      const obj = JSON.parse(text); // throws on bad JSON
      if (!obj || !Array.isArray(obj.foods) || typeof obj.records !== 'object') throw new Error('Not a Makan Wheel backup');
      const foods = obj.foods
        .filter(f => f && typeof f.name === 'string' && f.name.trim())
        .map(f => ({
          id: typeof f.id === 'string' ? f.id : uid(),
          name: f.name.trim().slice(0, 40),
          meals: Array.isArray(f.meals) ? f.meals.filter(m => MEALS.includes(m)) : [],
        }));
      const records = {};
      Object.entries(obj.records || {}).forEach(([date, day]) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !day || typeof day !== 'object') return;
        MEALS.forEach(m => {
          if (typeof day[m] === 'string') (records[date] = records[date] || {})[m] = day[m];
        });
      });
      data = { foods, records };
      save(data);
      return { foods: foods.length, days: Object.keys(records).length };
    },
  };
})();
