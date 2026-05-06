const MOOD_CARD_STEP = 12;
const MOOD_CALENDAR_KEY = 'tinyStepsMoodCalendar';
const moodById = (id) => document.getElementById(id);

const comfortGroups = [
  { key: '低落', hint: '先降门槛', tone: '低落时，任务不需要被推进很多，先让自己重新靠近它。把目标缩成一个不会压垮你的动作：打开资料、写下标题、只看一小段。你不是在逃避，而是在给大脑一个重新进入现场的入口。' },
  { key: '焦虑', hint: '先稳住', tone: '焦虑会把任务变成一团未来的风险。先把它拉回眼前：现在能确认什么，能做哪一步，能暂时放下什么。你要做的不是解决全部，而是把下一步变得可执行。' },
  { key: '疲惫', hint: '先省力', tone: '疲惫时不适合用意志力硬推。选择最省力的版本：只整理材料，只做一道题，只写三句话。小步不是退让，是在保护持续性，让你明天还有力气回来。' },
  { key: '紧绷', hint: '先松开', tone: '紧绷会让每个任务都像考试。先把身体松下来，再处理事情。你可以给任务设一个短时间边界：十分钟只做一件事，到点就停。边界会让大脑知道它是安全的。' },
  { key: '混乱', hint: '先外化', tone: '混乱时不要在脑子里排序。把所有念头写出来，不分类也没关系。写完后只圈出一个最轻的小入口。外化会减少内耗，让任务从一团雾变成可以选择的路。' },
  { key: '自责', hint: '先复盘', tone: '自责常常想逼你变好，但它太重了。把攻击换成复盘：发生了什么，哪里可以调整，下一次具体换哪一步。你可以负责，也可以不伤害自己。' },
  { key: '迷茫', hint: '先试走', tone: '迷茫时不必立刻确定完整路线。先选一个低成本试走动作：看一个例子、列两个选项、做一个草稿。试走会带来信息，信息会慢慢替你照亮方向。' },
  { key: '平静', hint: '稳步推进', tone: '平静是很适合推进的状态。你可以比平时多做一点，但仍然保留边界：确定一个小成果，完成后及时收尾。稳定不是一次冲很远，而是每次都知道怎么继续。' }
];

const scenes = [
  ['任务太大', '把“完成整件事”换成“确认一个小范围”。先切掉九成，只保留眼前这一块。'],
  ['迟迟开始不了', '把开始定义得更小：打开、摆好、写第一句、看第一段，都算进入任务。'],
  ['担心做不好', '先做低标准版本。粗糙的草稿可以被修改，空白却只能继续吓人。'],
  ['时间不够', '先做保底版。问自己：最少交出什么，能让后续压力下降一点。'],
  ['脑子很乱', '先清空两分钟，把念头倒出来，再从里面选一个最轻的动作。'],
  ['落后感很强', '把比较收回来。今天的目标不是追上所有人，而是拿回一个具体进度。'],
  ['被评价刺痛', '把反馈和自我价值分开。能改的记下来，不能吸收的先放到一边。'],
  ['复习没状态', '先看目录和标题，不急着背。让大脑知道今天要碰的是哪一小块。'],
  ['写作卡住', '先写口语版。把想法说出来，再慢慢整理成正式表达。'],
  ['杂事堆积', '先列等待项和可行动作。很多压力来自混在一起，而不是事情本身。']
];

const endings = [
  '现在请只选一个动作，并把它小到十分钟内可以开始。完成后不用立刻加码，先写下“我做到了哪一步”。这会让你的大脑看见进展，而不是只看见剩余。',
  '如果你愿意，可以给这一步设一个温柔边界：开始时间、停止时间、完成标准。边界不是限制你，而是保护你不被任务吞掉。',
  '你不需要靠责备自己来前进。更有效的方式是降低入口、保留反馈、及时收尾。这样任务会更像一条路，而不是一堵墙。',
  '这张卡不是让你立刻变好，而是帮你把状态和任务重新对齐。状态轻时就轻做，状态稳时再推进。你可以用适合今天的方式完成今天。'
];

const comfortCards = comfortGroups.flatMap((group, groupIndex) => scenes.map((scene, sceneIndex) => ({
  id: `${group.key}-${sceneIndex}`,
  mood: group.key,
  hint: group.hint,
  title: `${group.key}｜${scene[0]}`,
  text: `${group.tone}${scene[1]}把事实、感受和下一步分开：事实是任务现在在哪里；感受是你为什么变重；下一步是一个能被执行的动作。${endings[(groupIndex + sceneIndex) % endings.length]}`
})));

let activeMood = '全部';
let visibleCardCount = MOOD_CARD_STEP;
let currentCalendarDate = new Date();
let selectedDateKey = dateKey(new Date());

const moodLevels = [
  { label: '低落', value: 1 },
  { label: '紧绷', value: 2 },
  { label: '疲惫', value: 3 },
  { label: '混乱', value: 4 },
  { label: '平静', value: 5 },
  { label: '柔软', value: 6 },
  { label: '明亮', value: 7 },
  { label: '充盈', value: 8 }
];

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function readMoodMap() {
  try { return JSON.parse(localStorage.getItem(MOOD_CALENDAR_KEY) || '{}'); }
  catch { return {}; }
}

function writeMoodMap(map) {
  localStorage.setItem(MOOD_CALENDAR_KEY, JSON.stringify(map));
}

function renderComfortFilters() {
  const box = moodById('moodFilters');
  if (!box) return;
  box.innerHTML = '';
  ['全部', ...comfortGroups.map(group => group.key)].forEach(name => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mood-filter${name === activeMood ? ' is-active' : ''}`;
    btn.textContent = name;
    btn.addEventListener('click', () => {
      activeMood = name;
      visibleCardCount = MOOD_CARD_STEP;
      renderComfortFilters();
      renderComfortCards();
    });
    box.appendChild(btn);
  });
}

function getFilteredCards() {
  const query = moodById('moodSearch')?.value.trim() || '';
  return comfortCards.filter(card => {
    const byMood = activeMood === '全部' || card.mood === activeMood;
    const byText = !query || `${card.title}${card.hint}${card.text}`.includes(query);
    return byMood && byText;
  });
}

function renderComfortCards() {
  const grid = moodById('moodGrid');
  const more = moodById('moreCardsBtn');
  if (!grid || !more) return;
  const cards = getFilteredCards();
  grid.innerHTML = '';
  cards.slice(0, visibleCardCount).forEach(card => {
    const article = document.createElement('article');
    article.className = 'comfort-card';
    article.innerHTML = `<span class="card-tag">${card.mood} · ${card.hint}</span><h3>${card.title}</h3><p>${card.text}</p>`;
    grid.appendChild(article);
  });
  more.hidden = visibleCardCount >= cards.length;
}

function renderCalendar() {
  const grid = moodById('calendarGrid');
  const title = moodById('monthTitle');
  if (!grid || !title) return;
  const map = readMoodMap();
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  title.textContent = `${year}年 ${month + 1}月`;
  grid.innerHTML = '';

  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  for (let i = 0; i < 42; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = dateKey(day);
    const mood = map[key];
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'day-cell';
    if (day.getMonth() !== month) cell.classList.add('is-muted');
    if (key === selectedDateKey) cell.classList.add('is-selected');
    if (mood) cell.dataset.mood = mood.label;
    cell.innerHTML = `<span class="day-number">${day.getDate()}</span>${mood ? `<span class="day-mood">${mood.label}</span>` : ''}`;
    cell.addEventListener('click', () => {
      selectedDateKey = key;
      renderCalendar();
      renderMoodPicker();
    });
    grid.appendChild(cell);
  }
}

function renderMoodPicker() {
  const picker = moodById('moodPicker');
  if (!picker) return;
  const map = readMoodMap();
  picker.innerHTML = '';
  moodLevels.forEach(level => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mood-pill${map[selectedDateKey]?.label === level.label ? ' is-active' : ''}`;
    btn.textContent = level.label;
    btn.addEventListener('click', () => {
      const next = readMoodMap();
      next[selectedDateKey] = { label: level.label, value: level.value };
      writeMoodMap(next);
      renderCalendar();
      renderMoodPicker();
    });
    picker.appendChild(btn);
  });
}

function initMoodModules() {
  renderComfortFilters();
  renderComfortCards();
  renderCalendar();
  renderMoodPicker();

  moodById('moodSearch')?.addEventListener('input', () => {
    visibleCardCount = MOOD_CARD_STEP;
    renderComfortCards();
  });
  moodById('moreCardsBtn')?.addEventListener('click', () => {
    visibleCardCount += MOOD_CARD_STEP;
    renderComfortCards();
  });
  moodById('prevMonthBtn')?.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  });
  moodById('nextMonthBtn')?.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
  });
}

initMoodModules();
