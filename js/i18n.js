/* ============================================================
   TRANSLATIONS
   Static text in index.html uses data-i18n="key" (text),
   data-i18n-ph="key" (placeholder) or data-i18n-title="key".
   JS uses t('key', { name: ... }) for text built in code.
   ============================================================ */
const I18N = {
  en: {
    language: 'Language', theme: 'Theme',
    themeOriginal: 'Original', themeSoft: 'Soft white', themeColorful: 'Colourful', themeDark: 'Dark', themeWarm: 'Warm',
    breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner',
    breakfastShort: 'B', lunchShort: 'L', dinnerShort: 'D',
    navSpin: 'Spin', navFoods: 'Foods', navHistory: 'History',
    spinBtn: 'SPIN', notDecided: 'not decided', today: 'Today', clear: 'Clear', delete: 'Delete',
    emptyWheel: 'No foods for this meal yet.', addFoods: 'Add foods',
    foodPlaceholder: 'e.g. Nasi lemak', addFood: 'Add food',
    tagHint: 'Tap the meal tags to choose which wheels a food appears on.',
    yourFoods: 'Your foods ({n})', noFoods: 'No foods yet. Add your first one above.',
    mostEaten: 'Most eaten', mealLog: 'Meal log', nothingYet: 'Nothing recorded yet.',
    logEmpty: 'Spin the wheel and save a meal to start your log.',
    yourData: 'Your data',
    dataNote: 'Your foods and meal log are saved only on this device. Export a backup (.txt) to keep it safe, read it in Notepad or your notes app, or move it to another phone.',
    exportBackup: 'Export backup', importBackup: 'Import backup', installApp: 'Install app',
    resultTitle: '{meal} today is…', saveResult: "Save as today's meal", spinAgain: 'Spin again',
    pickMeal: 'Pick at least one meal', alreadyListed: 'Already in your list', added: 'Added {name}',
    savedMeal: 'Saved {food} for {meal}', backupSaved: 'Backup saved',
    restored: 'Restored {foods} foods, {days} days', notBackup: "That file isn't a Makan Wheel backup",
    confirmImport: 'Replace all foods and meal history on this device with this backup?', installed: 'Installed!',
    bkTitle: 'MAKAN WHEEL BACKUP', bkExported: 'Exported',
    bkHelp: 'You can edit this file. Keep one item per line and the " | " separators.', bkMeals: 'Meals are',
    bkFoods: 'FOODS', bkFoodsCols: 'Food name | meals', bkLog: 'MEAL LOG', bkLogCols: 'Date | meal | food',
  },
  ms: {
    language: 'Bahasa', theme: 'Tema',
    themeOriginal: 'Asal', themeSoft: 'Putih lembut', themeColorful: 'Berwarna', themeDark: 'Gelap', themeWarm: 'Hangat',
    breakfast: 'Sarapan', lunch: 'Makan tengah hari', dinner: 'Makan malam',
    breakfastShort: 'S', lunchShort: 'T', dinnerShort: 'M',
    navSpin: 'Putar', navFoods: 'Makanan', navHistory: 'Sejarah',
    spinBtn: 'PUTAR', notDecided: 'belum pilih', today: 'Hari ini', clear: 'Padam', delete: 'Buang',
    emptyWheel: 'Belum ada makanan untuk waktu ini.', addFoods: 'Tambah makanan',
    foodPlaceholder: 'cth. Nasi lemak', addFood: 'Tambah makanan',
    tagHint: 'Ketik tag waktu makan untuk pilih roda mana makanan ini muncul.',
    yourFoods: 'Makanan anda ({n})', noFoods: 'Belum ada makanan. Tambah yang pertama di atas.',
    mostEaten: 'Paling kerap dimakan', mealLog: 'Log makan', nothingYet: 'Belum ada rekod.',
    logEmpty: 'Putar roda dan simpan hidangan untuk mula merekod.',
    yourData: 'Data anda',
    dataNote: 'Makanan dan log makan anda disimpan pada peranti ini sahaja. Eksport sandaran (.txt) untuk simpan dengan selamat, baca dalam Notepad atau aplikasi nota, atau pindah ke telefon lain.',
    exportBackup: 'Eksport sandaran', importBackup: 'Import sandaran', installApp: 'Pasang aplikasi',
    resultTitle: '{meal} hari ini ialah…', saveResult: 'Simpan untuk hari ini', spinAgain: 'Putar lagi',
    pickMeal: 'Pilih sekurang-kurangnya satu waktu makan', alreadyListed: 'Sudah ada dalam senarai', added: '{name} ditambah',
    savedMeal: '{food} disimpan untuk {meal}', backupSaved: 'Sandaran disimpan',
    restored: '{foods} makanan, {days} hari dipulihkan', notBackup: 'Fail itu bukan sandaran Makan Wheel',
    confirmImport: 'Ganti semua makanan dan sejarah makan pada peranti ini dengan sandaran ini?', installed: 'Sudah dipasang!',
    bkTitle: 'SANDARAN MAKAN WHEEL', bkExported: 'Dieksport',
    bkHelp: 'Anda boleh sunting fail ini. Satu item setiap baris dan kekalkan pemisah " | ".', bkMeals: 'Waktu makan',
    bkFoods: 'MAKANAN', bkFoodsCols: 'Nama makanan | waktu makan', bkLog: 'LOG MAKAN', bkLogCols: 'Tarikh | waktu makan | makanan',
  },
  zh: {
    language: '语言', theme: '主题',
    themeOriginal: '原版', themeSoft: '柔白', themeColorful: '缤纷', themeDark: '深色', themeWarm: '暖棕',
    breakfast: '早餐', lunch: '午餐', dinner: '晚餐',
    breakfastShort: '早', lunchShort: '午', dinnerShort: '晚',
    navSpin: '转盘', navFoods: '食物', navHistory: '记录',
    spinBtn: '转', notDecided: '未决定', today: '今天', clear: '清除', delete: '删除',
    emptyWheel: '这一餐还没有食物。', addFoods: '添加食物',
    foodPlaceholder: '例如：椰浆饭', addFood: '添加食物',
    tagHint: '点选餐别标签，选择食物出现在哪个转盘。',
    yourFoods: '我的食物（{n}）', noFoods: '还没有食物，请在上方添加第一个。',
    mostEaten: '最常吃', mealLog: '饮食记录', nothingYet: '还没有记录。',
    logEmpty: '转动转盘并保存一餐，开始你的记录。',
    yourData: '我的数据',
    dataNote: '你的食物和饮食记录只保存在这台设备上。导出备份（.txt）可以妥善保存、用记事本或手机备忘录查看，或转移到另一部手机。',
    exportBackup: '导出备份', importBackup: '导入备份', installApp: '安装应用',
    resultTitle: '今天的{meal}是…', saveResult: '保存为今天的一餐', spinAgain: '再转一次',
    pickMeal: '请至少选择一个餐别', alreadyListed: '已经在列表中', added: '已添加 {name}',
    savedMeal: '已将 {food} 保存为{meal}', backupSaved: '备份已保存',
    restored: '已恢复 {foods} 个食物、{days} 天记录', notBackup: '这个文件不是 Makan Wheel 备份',
    confirmImport: '要用这个备份替换这台设备上的所有食物和饮食记录吗？', installed: '已安装！',
    bkTitle: 'MAKAN WHEEL 备份', bkExported: '导出日期',
    bkHelp: '你可以编辑这个文件。每行一项，并保留 " | " 分隔符。', bkMeals: '餐别',
    bkFoods: '食物', bkFoodsCols: '食物名称 | 餐别', bkLog: '饮食记录', bkLogCols: '日期 | 餐别 | 食物',
  },
};
const LANG_LOCALE = { en: 'en-MY', ms: 'ms-MY', zh: 'zh-CN' };
const LANG_KEY = 'makanwheel.lang';

let LANG = (() => {
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
  if (I18N[saved]) return saved;
  const nav = (navigator.language || 'en').toLowerCase();
  return nav.startsWith('zh') ? 'zh' : nav.startsWith('ms') ? 'ms' : 'en';
})();

function t(key, vars) {
  const s = I18N[LANG][key] ?? I18N.en[key] ?? key;
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : s;
}
function mealName(meal) { return t(meal); }

function setLang(lang) {
  if (!I18N[lang]) lang = 'en';
  LANG = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  applyI18n();
}
function applyI18n() {
  document.documentElement.lang = lang2html(LANG);
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  document.querySelectorAll('[data-i18n-title]').forEach(el => el.title = t(el.dataset.i18nTitle));
}
function lang2html(lang) { return lang === 'zh' ? 'zh-Hans' : lang; }
