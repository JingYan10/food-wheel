/* ============================================================
   WHEEL
   ============================================================ */
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const PALETTE = ['#E8590C', '#F59F00', '#2F9E44', '#1C7ED6', '#AE3EC9', '#E64980', '#0CA678', '#F76707', '#4263EB', '#D6336C'];
let rotation = 0;
let spinning = false;
let wheelFoods = [];
let lastPick = null;

function drawWheel() {
  const W = canvas.width, R = W / 2, n = wheelFoods.length;
  ctx.clearRect(0, 0, W, W);
  if (!n) return;
  const seg = (Math.PI * 2) / n;
  ctx.save();
  ctx.translate(R, R);
  ctx.rotate(rotation);
  for (let i = 0; i < n; i++) {
    const start = -Math.PI / 2 + i * seg;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R - 8, start, start + seg);
    ctx.closePath();
    // avoid the same colour on first & last slice
    let color = PALETTE[i % PALETTE.length];
    if (i === n - 1 && n > 1 && i % PALETTE.length === 0) color = PALETTE[3];
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.7)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // label
    ctx.save();
    ctx.rotate(start + seg / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    const size = n > 14 ? 22 : n > 9 ? 28 : 34;
    ctx.font = `700 ${size}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    let label = wheelFoods[i].name;
    const maxW = R * 0.62;
    while (ctx.measureText(label).width > maxW && label.length > 3) label = label.slice(0, -2);
    if (label !== wheelFoods[i].name) label = label.trimEnd() + '…';
    ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 4;
    ctx.fillText(label, R - 36, 0);
    ctx.restore();
  }
  ctx.restore();
  // outer ring
  ctx.beginPath();
  ctx.arc(R, R, R - 6, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,0,0,.12)';
  ctx.lineWidth = 8;
  ctx.stroke();
}

function spin() {
  if (spinning || !wheelFoods.length) return;
  spinning = true;
  document.getElementById('spinBtn').disabled = true;

  const n = wheelFoods.length, seg = (Math.PI * 2) / n;
  const winner = Math.floor(Math.random() * n);
  // Pointer sits at the top. The slice under it satisfies: -rotation ≡ (winner + offset) * seg
  const offset = 0.15 + Math.random() * 0.7;
  const TAU = Math.PI * 2;
  const base = -(winner + offset) * seg;
  let target = base + TAU * Math.ceil((rotation - base) / TAU);
  target += TAU * (5 + Math.floor(Math.random() * 3)); // extra full turns

  const from = rotation, dist = target - from, dur = 4200 + Math.random() * 800;
  const t0 = performance.now();
  const ease = t => 1 - Math.pow(1 - t, 4);

  function frame(now) {
    const t = Math.min(1, (now - t0) / dur);
    rotation = from + dist * ease(t);
    drawWheel();
    if (t < 1) return requestAnimationFrame(frame);
    rotation = rotation % TAU;
    spinning = false;
    document.getElementById('spinBtn').disabled = false;
    showResult(wheelFoods[winner]);
  }
  requestAnimationFrame(frame);
}

function showResult(food) {
  lastPick = food;
  document.getElementById('resultMeal').textContent = MEAL_LABEL[currentMeal] + ' today is…';
  document.getElementById('resultFood').textContent = food.name;
  document.getElementById('resultModal').classList.add('open');
  if (navigator.vibrate) navigator.vibrate(60);
}

document.getElementById('spinBtn').addEventListener('click', spin);
document.getElementById('spinAgain').addEventListener('click', () => {
  document.getElementById('resultModal').classList.remove('open');
  setTimeout(spin, 150);
});
document.getElementById('saveResult').addEventListener('click', () => {
  Store.recordMeal(todayKey(), currentMeal, lastPick.name);
  document.getElementById('resultModal').classList.remove('open');
  toast(`Saved ${lastPick.name} for ${MEAL_LABEL[currentMeal].toLowerCase()}`);
  // move on to the next unrecorded meal
  const today = Store.day(todayKey());
  const next = MEALS.find(m => !today[m]);
  if (next) currentMeal = next;
  renderSpin();
});
document.getElementById('resultModal').addEventListener('click', e => {
  if (e.target.id === 'resultModal') e.currentTarget.classList.remove('open');
});
