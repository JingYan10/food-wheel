/* ============================================================
   STATE + NAV
   ============================================================ */
const hour = new Date().getHours();
let currentMeal = hour < 11 ? 'breakfast' : hour < 16 ? 'lunch' : 'dinner';
let newFoodMeals = ['lunch', 'dinner'];

document.getElementById('todayLabel').textContent = prettyDate(todayKey());

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
      ${MEAL_LABEL[m]}
      <small>${today[m] ? '✓ ' + esc(today[m]) : 'not decided'}</small>
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
    <span class="lbl">${MEAL_LABEL[meal]}</span>
    <span style="flex:1">${food ? esc(food) : '<span class="none">—</span>'}</span>
    ${clearable && food ? `<button class="icon-btn" title="Clear" data-clear="${meal}">×</button>` : ''}
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
    `<button type="button" class="tag ${newFoodMeals.includes(m) ? 'on' : ''}" data-meal="${m}">${MEAL_LABEL[m]}</button>`
  ).join('');
}
document.getElementById('newTags').addEventListener('click', e => {
  const t = e.target.closest('.tag');
  if (!t) return;
  const m = t.dataset.meal;
  newFoodMeals = newFoodMeals.includes(m) ? newFoodMeals.filter(x => x !== m) : [...newFoodMeals, m];
  renderNewTags();
});
document.getElementById('addForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('foodInput');
  const name = input.value.trim();
  if (!name) return input.focus();
  if (!newFoodMeals.length) return toast('Pick at least one meal');
  if (Store.foods().some(f => f.name.toLowerCase() === name.toLowerCase())) return toast('Already in your list');
  Store.addFood(name, [...newFoodMeals]);
  input.value = '';
  toast(`Added ${name}`);
  renderFoods();
});

function renderFoods() {
  renderNewTags();
  const foods = Store.foods();
  document.getElementById('foodCount').textContent = `Your foods (${foods.length})`;
  document.getElementById('foodList').innerHTML = foods.length ? foods.map(f => `
    <li>
      <span class="food-name">${esc(f.name)}</span>
      ${MEALS.map(m => `<button class="tag ${f.meals.includes(m) ? 'on' : ''}" data-meal="${m}" data-food="${f.id}">${MEAL_LABEL[m][0]}</button>`).join('')}
      <button class="icon-btn" title="Delete" data-del="${f.id}">🗑</button>
    </li>`).join('') : '<li class="hint">No foods yet. Add your first one above.</li>';
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
    : '<span class="hint">Nothing recorded yet.</span>';

  document.getElementById('historyList').innerHTML = dates.length ? dates.map(d => `
    <div class="day">
      <div class="day-title">${prettyDate(d)} ${d === todayKey() ? '<small>Today</small>' : ''}</div>
      ${MEALS.map(m => mealLine(m, recs[d][m], false)).join('')}
    </div>`).join('') : '<p class="hint">Spin the wheel and save a meal to start your log.</p>';
}

renderSpin();
