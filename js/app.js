/* ============================================================
   STATE + NAV
   ============================================================ */
const hour = new Date().getHours();
let currentMeal = hour < 11 ? 'breakfast' : hour < 16 ? 'lunch' : 'dinner';
let newFoodMeals = []; // user picks the meals for each new food

/* ============================================================
   LANGUAGE (saved per device)
   ============================================================ */
function currentView() {
  return document.querySelector('.view.active').id.replace('view-', '');
}
function renderAll() {
  applyI18n();
  document.getElementById('todayLabel').textContent = prettyDate(todayKey());
  const view = currentView();
  if (view === 'spin') renderSpin();
  if (view === 'foods') renderFoods();
  if (view === 'history') renderHistory();
}
document.getElementById('langSelect').value = LANG;
document.getElementById('langSelect').addEventListener('change', e => {
  setLang(e.target.value);
  renderAll();
});

/* ============================================================
   THEME (saved per device, applied early in index.html)
   ============================================================ */
const THEME_KEY = 'makanwheel.theme';
const THEME_BAR_COLOR = { original: '#E8590C', soft: '#E8590C', colorful: '#F0532B', dark: '#202124', warm: '#17110D' };
function applyTheme(name) {
  if (!THEME_BAR_COLOR[name]) name = 'soft';
  document.documentElement.dataset.theme = name;
  document.querySelector('meta[name="theme-color"]').content = THEME_BAR_COLOR[name];
  document.getElementById('themeSelect').value = name;
  return name;
}
applyTheme(document.documentElement.dataset.theme);
document.getElementById('themeSelect').addEventListener('change', e => {
  const name = applyTheme(e.target.value);
  try { localStorage.setItem(THEME_KEY, name); } catch (err) {}
});

document.addEventListener('click', e => {
  const go = e.target.closest('[data-goto]');
  if (!go) return;
  const name = go.dataset.goto;
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('active', b.dataset.goto === name));
  if (name === 'history') renderHistory();
  if (name === 'foods') renderFoods();
  if (name === 'spin') renderSpin();
  window.scrollTo(0, 0);
});

/* ============================================================
   RENDER: SPIN VIEW
   ============================================================ */
function renderSpin() {
  const today = Store.day(todayKey());
  document.getElementById('mealTabs').innerHTML = MEALS.map(m => `
    <button class="meal-tab ${m === currentMeal ? 'active' : ''}" data-meal="${m}">
      ${mealName(m)}
      <small>${today[m] ? '✓ ' + esc(today[m]) : t('notDecided')}</small>
    </button>`).join('');

  wheelFoods = Store.foodsFor(currentMeal);
  const has = wheelFoods.length > 0;
  document.getElementById('wheelWrap').hidden = !has;
  document.getElementById('emptyWheel').hidden = has;
  drawWheel();

  document.getElementById('todayCard').innerHTML = MEALS.map(m => mealLine(m, today[m], true)).join('');
}

function mealLine(meal, food, clearable) {
  return `<div class="meal-line">
    <span class="dot" style="background:${MEAL_COLOR[meal]}"></span>
    <span class="lbl">${mealName(meal)}</span>
    <span style="flex:1">${food ? esc(food) : '<span class="none">—</span>'}</span>
    ${clearable && food ? `<button class="icon-btn" title="${t('clear')}" data-clear="${meal}">×</button>` : ''}
  </div>`;
}

document.getElementById('mealTabs').addEventListener('click', e => {
  const b = e.target.closest('.meal-tab');
  if (!b || spinning) return;
  currentMeal = b.dataset.meal;
  renderSpin();
});
document.getElementById('todayCard').addEventListener('click', e => {
  const b = e.target.closest('[data-clear]');
  if (!b) return;
  Store.clearMeal(todayKey(), b.dataset.clear);
  renderSpin();
});

/* ============================================================
   RENDER: FOODS VIEW
   ============================================================ */
function renderNewTags() {
  document.getElementById('newTags').innerHTML = MEALS.map(m =>
    `<button type="button" class="tag ${newFoodMeals.includes(m) ? 'on' : ''}" data-meal="${m}">${mealName(m)}</button>`
  ).join('');
}
document.getElementById('newTags').addEventListener('click', e => {
  const tag = e.target.closest('.tag');
  if (!tag) return;
  const m = tag.dataset.meal;
  newFoodMeals = newFoodMeals.includes(m) ? newFoodMeals.filter(x => x !== m) : [...newFoodMeals, m];
  renderNewTags();
});
document.getElementById('addForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('foodInput');
  const name = input.value.trim();
  if (!name) return input.focus();
  if (!newFoodMeals.length) return toast(t('pickMeal'));
  if (Store.foods().some(f => f.name.toLowerCase() === name.toLowerCase())) return toast(t('alreadyListed'));
  Store.addFood(name, [...newFoodMeals]);
  input.value = '';
  toast(t('added', { name }));
  renderFoods();
});

function renderFoods() {
  renderNewTags();
  const foods = Store.foods();
  document.getElementById('foodCount').textContent = t('yourFoods', { n: foods.length });
  document.getElementById('foodList').innerHTML = foods.length ? foods.map(f => `
    <li>
      <span class="food-name">${esc(f.name)}</span>
      ${MEALS.map(m => `<button class="tag ${f.meals.includes(m) ? 'on' : ''}" data-meal="${m}" data-food="${f.id}" title="${mealName(m)}">${t(m + 'Short')}</button>`).join('')}
      <button class="icon-btn" title="${t('delete')}" data-del="${f.id}">🗑</button>
    </li>`).join('') : `<li class="hint">${t('noFoods')}</li>`;
}
document.getElementById('foodList').addEventListener('click', e => {
  const tag = e.target.closest('[data-food]');
  if (tag) { Store.toggleFoodMeal(tag.dataset.food, tag.dataset.meal); return renderFoods(); }
  const del = e.target.closest('[data-del]');
  if (del) { Store.removeFood(del.dataset.del); renderFoods(); }
});

/* ============================================================
   RENDER: HISTORY VIEW
   ============================================================ */
function renderHistory() {
  const recs = Store.records();
  const dates = Object.keys(recs).sort().reverse();

  const counts = {};
  dates.forEach(d => Object.values(recs[d]).forEach(f => counts[f] = (counts[f] || 0) + 1));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  document.getElementById('stats').innerHTML = top.length
    ? top.map(([f, c]) => `<span class="stat">${esc(f)} <b>×${c}</b></span>`).join('')
    : `<span class="hint">${t('nothingYet')}</span>`;

  document.getElementById('historyList').innerHTML = dates.length ? dates.map(d => `
    <div class="day">
      <div class="day-title">${prettyDate(d)} ${d === todayKey() ? `<small>${t('today')}</small>` : ''}</div>
      ${MEALS.map(m => mealLine(m, recs[d][m], false)).join('')}
    </div>`).join('') : `<p class="hint">${t('logEmpty')}</p>`;
}

/* ============================================================
   BACKUP: EXPORT / IMPORT
   ============================================================ */
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob(['﻿' + Store.exportText()], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `makan-wheel-backup-${todayKey()}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(t('backupSaved'));
});
document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = ''; // allow picking the same file again
  if (!file) return;
  if (!confirm(t('confirmImport'))) return;
  try {
    const n = Store.importText(await file.text());
    toast(t('restored', n));
    renderHistory();
  } catch (err) {
    toast(t('notBackup'));
  }
});

/* ============================================================
   PWA: OFFLINE + INSTALL
   ============================================================ */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js');
}
// Ask the browser not to clear our data when space runs low
if (navigator.storage && navigator.storage.persist) navigator.storage.persist();

let installPrompt = null;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installBtn.hidden = true;
});
window.addEventListener('appinstalled', () => { installBtn.hidden = true; toast(t('installed')); });

renderAll();
