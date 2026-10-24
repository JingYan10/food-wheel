/* ============================================================
   DATA LAYER
   Everything goes through Store. Data is saved only on this
   device (localStorage), so each user has their own copy.
   Later, swap these methods for API calls / SQLite without
   touching the UI code.
   ============================================================ */
const MEALS = ['breakfast', 'lunch', 'dinner'];
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
      data.foods.push({ id: uid(), name: cleanName(name), meals }); save(data);
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

    /* Backup: a plain .txt file people can read and edit in Notepad
       or a phone notes app, then import back on any device. */
    // Written in the current language; importText reads any language
    exportText() {
      const lines = [
        t('bkTitle'),
        `${t('bkExported')}: ${todayKey()}`,
        '',
        t('bkHelp'),
        `${t('bkMeals')}: ${MEALS.map(mealName).join(', ')}`,
        '',
        `== ${t('bkFoods')} ==`,
        `# ${t('bkFoodsCols')}`,
        ...data.foods.map(f => `${f.name} | ${f.meals.map(mealName).join(', ')}`),
        '',
        `== ${t('bkLog')} ==`,
        `# ${t('bkLogCols')}`,
      ];
      Object.keys(data.records).sort().forEach(date =>
        MEALS.forEach(m => { if (data.records[date][m]) lines.push(`${date} | ${mealName(m)} | ${data.records[date][m]}`); })
      );
      return lines.join('\r\n') + '\r\n';
    },
    importText(text) {
      text = text.replace(/^﻿/, '').trim();
      if (text.startsWith('{')) return replaceAll(fromJSON(text)); // older .json backups
      const foods = [], records = {};
      let section = null;
      text.split(/\r?\n/).forEach(raw => {
        const line = raw.trim();
        const head = line.match(/^==\s*(.+?)\s*==$/);
        if (head) { section = sectionOf(head[1]) || section; return; }
        if (!line || line.startsWith('#') || !section) return;
        const parts = line.split('|').map(s => s.trim());
        if (section === 'FOODS' && parts[0]) {
          if (foods.some(f => f.name.toLowerCase() === parts[0].toLowerCase())) return;
          const meals = (parts[1] || '').split(/[,，、]/).map(toMeal).filter(Boolean);
          foods.push({ id: uid(), name: cleanName(parts[0]), meals: [...new Set(meals)] });
        }
        if (section === 'MEAL LOG' && parts.length >= 3) {
          const [date, meal, food] = [parts[0], toMeal(parts[1]), parts.slice(2).join(' | ')];
          if (/^\d{4}-\d{2}-\d{2}$/.test(date) && meal && food) (records[date] = records[date] || {})[meal] = food;
        }
      });
      if (section === null) throw new Error('Not a Makan Wheel backup');
      return replaceAll({ foods, records });
    },
  };

  function replaceAll(next) {
    data = next;
    save(data);
    return { foods: data.foods.length, days: Object.keys(data.records).length };
  }
  // Accept meal and section names from any language's backup
  function inAnyLang(key, s) {
    return Object.values(I18N).some(d => d[key].toLowerCase() === s);
  }
  function toMeal(label) {
    const s = String(label).trim().toLowerCase();
    return MEALS.find(m => m === s || inAnyLang(m, s)) || null;
  }
  function sectionOf(title) {
    const s = title.trim().toLowerCase();
    if (inAnyLang('bkFoods', s)) return 'FOODS';
    if (inAnyLang('bkLog', s)) return 'MEAL LOG';
    return null;
  }
  // "|" separates fields in the backup file, so keep it out of names
  function cleanName(name) {
    return name.replace(/\|/g, '/').trim().slice(0, 40);
  }
  function fromJSON(text) {
    const obj = JSON.parse(text);
    if (!obj || !Array.isArray(obj.foods)) throw new Error('Not a Makan Wheel backup');
    const foods = obj.foods
      .filter(f => f && typeof f.name === 'string' && f.name.trim())
      .map(f => ({ id: uid(), name: cleanName(f.name), meals: (f.meals || []).filter(m => MEALS.includes(m)) }));
    const records = {};
    Object.entries(obj.records || {}).forEach(([date, day]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !day) return;
      MEALS.forEach(m => { if (typeof day[m] === 'string') (records[date] = records[date] || {})[m] = day[m]; });
    });
    return { foods, records };
  }
})();
