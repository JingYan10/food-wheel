/* ============================================================
   DATA LAYER
   Everything goes through Store. Right now it saves to the
   browser (localStorage). Later, swap these methods for API
   calls / SQLite without touching the UI code.
   ============================================================ */
const MEALS = ['breakfast', 'lunch', 'dinner'];
const MEAL_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
const MEAL_COLOR = { breakfast: 'var(--breakfast)', lunch: 'var(--lunch)', dinner: 'var(--dinner)' };

const Store = (() => {
  const KEY = 'makanwheel.v1';
  let memory = null; // fallback if storage is blocked

  const defaults = () => ({
    foods: [
      ['Nasi lemak', ['breakfast', 'lunch']],
      ['Roti canai', ['breakfast']],
      ['Kaya toast & eggs', ['breakfast']],
      ['Chee cheong fun', ['breakfast']],
      ['Chicken rice', ['lunch', 'dinner']],
      ['Char kuey teow', ['lunch', 'dinner']],
      ['Mee goreng mamak', ['lunch', 'dinner']],
      ['Wantan mee', ['breakfast', 'lunch']],
      ['Laksa', ['lunch']],
      ['Nasi kandar', ['lunch', 'dinner']],
      ['Bak kut teh', ['dinner']],
      ['Steamboat', ['dinner']],
    ].map(([name, meals]) => ({ id: uid(), name, meals })),
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
  };
})();
