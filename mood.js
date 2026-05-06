const MOOD_CARD_STEP = 5;
const MOOD_CALENDAR_KEY = 'tinyStepsMoodCalendar';
const moodById = (id) => document.getElementById(id);

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

const moodThemes = [
  {
    mood: '低落', hint: '先降门槛',
    openings: [
      '低落的时候，任务常常像蒙了一层灰，明明知道它在那里，却很难走近。你可以先不要求自己振作，只把今天的入口降到很低。',
      '如果心里有一点沉，不必急着把它赶走。低落有时是在提醒你：最近消耗太多，需要用更轻的方式重新靠近任务。',
      '当你觉得自己提不起劲，先别把这解释成不够努力。很多时候，大脑只是需要一个安全、很小、不会失败的起点。'
    ],
    closings: [
      '把今天的目标改成“碰到它一次”。打开资料、写下标题、标出下次继续的位置，都算数。你先回来，进度会慢慢跟上。',
      '请给这一步一个柔软的完成标准：十分钟内能做完，做完后能看见一点痕迹。痕迹比漂亮更重要。',
      '如果只能做一点，就做一点。你不是在原地，你是在用今天还能承受的方式，保留和任务之间的连接。'
    ]
  },
  {
    mood: '焦虑', hint: '先稳住',
    openings: [
      '焦虑会把任务推到很远的未来，让每一步都像在预演失败。先把视线收回来，只看眼前能确认的一小块。',
      '当心跳变快、脑子开始排练各种结果时，不必跟着它跑。你可以先写下事实，而不是想象。',
      '焦虑不是敌人，它是在提醒你某件事很重要。只是它说话太急，所以你需要替它慢下来。'
    ],
    closings: [
      '把纸分成三栏：已知、未知、下一步。未知可以先空着，下一步只写一个动作。任务会因此从风暴变回路线。',
      '给自己一个短边界：现在只处理十分钟。十分钟结束后再决定是否继续，不提前替整天负责。',
      '你要找的不是完美方案，而是能让局面向前一点的动作。先让身体回到此刻，任务才会变清楚。'
    ]
  },
  {
    mood: '疲惫', hint: '先省力',
    openings: [
      '疲惫时，最需要的不是更用力，而是更聪明地分配力气。任务可以被缩小，标准也可以暂时调低。',
      '如果身体和脑子都很钝，就别把自己推进高强度模式。先选择最省力、最少切换、最容易收尾的一步。',
      '疲惫会让普通任务也变得沉重。你可以把今天当作维护日，不追求突破，只保留节奏。'
    ],
    closings: [
      '只做一个轻动作：整理材料、画一个框架、读一个小节。做完就停，留下明天能接上的位置。',
      '请把“完成很多”换成“减少一点阻力”。哪怕只是把文件放好，也是在替之后的自己铺路。',
      '不要用透支换进度。稳定的任务拆解，应该让你完成后还有一点余地，而不是完全耗空。'
    ]
  },
  {
    mood: '紧绷', hint: '先松开',
    openings: [
      '紧绷的时候，任务会变得像一场审判。先把肩膀放下来，让身体知道：这不是考试，只是一个可以被拆开的事情。',
      '如果你发现自己一直绷着、催着、盯着结果，先暂停一下。过度用力会让任务边缘变硬，反而更难进入。',
      '紧绷并不代表你做不好，它只是说明你太想做好了。先把“必须完美”换成“先有一个版本”。'
    ],
    closings: [
      '给任务一个温柔限制：十分钟，只做一块，到点收住。边界会让大脑更安心，也更愿意开始。',
      '先做低压版本。你可以粗糙，可以不完整，可以以后再修。今天先让它存在。',
      '完成后不要马上挑刺，先写一句“这一轮推进了什么”。看见进展，是松开紧绷的第一步。'
    ]
  },
  {
    mood: '混乱', hint: '先外化',
    openings: [
      '混乱时，最累的不是任务本身，而是所有念头挤在脑子里。先把它们倒出来，不分类也没关系。',
      '当你不知道从哪里开始，就先别急着开始。把脑内的碎片写下来，让它们从雾里落到纸上。',
      '混乱像一张没有边界的网。你需要的不是立刻理清全部，而是找到一个可以剪开的线头。'
    ],
    closings: [
      '写满两分钟后，只圈一个最轻的动作。不是最重要，也不是最完美，而是最容易让你重新动起来。',
      '把任务分成“现在做、以后做、等别人、先不管”。分类一出现，压力就会少一层。',
      '请让下一步具体到动词：打开、标注、复制、写三句、发一条。动词会把混乱带回行动。'
    ]
  },
  {
    mood: '自责', hint: '先复盘',
    openings: [
      '自责常常披着“我要变好”的外衣，但它说话太重，会让你更难行动。先把苛刻语气放轻一点。',
      '如果你一直在怪自己，先停一下。任务需要复盘，不需要把整个人都放到审判台上。',
      '自责想要你修正问题，可真正有用的修正，通常来自清楚的观察，而不是一遍遍责备。'
    ],
    closings: [
      '写下三句：发生了什么、我学到什么、下次换哪一步。这样你保留了成长，也放下了多余的重量。',
      '把“我怎么又这样”改成“下一次我需要什么提示”。提示能帮助你行动，苛责只会消耗能量。',
      '你可以负责，也可以继续温柔。今天先修一个动作，不必急着证明自己已经彻底改变。'
    ]
  },
  {
    mood: '迷茫', hint: '先试走',
    openings: [
      '迷茫时，不必急着找到完整答案。很多方向不是想出来的，而是在低成本试走里慢慢显形。',
      '当选择太多，先不要追求最终决定。你可以做一个小实验，让真实反馈替你照亮一点路。',
      '迷茫不是没有能力，而是信息还不够清楚。与其反复想，不如让任务产生一点可观察的结果。'
    ],
    closings: [
      '先选一个试走动作：看一个例子、列两个方案、做一个粗稿。试走不是承诺终点，只是收集信息。',
      '把选择写成两个问题：我现在最想减少什么阻力，我最愿意先尝试哪一步。答案会比空想更稳。',
      '完成试走后，记下感受：更清楚了什么，哪里仍然模糊。模糊被命名后，就不再那么可怕。'
    ]
  },
  {
    mood: '平静', hint: '稳步推进',
    openings: [
      '平静是一种很珍贵的工作状态。它不需要被浪费在无限加码里，而适合用来做清楚、稳定的小推进。',
      '当你感觉比较稳，可以适度多走一点，但仍然别把任务开得太大。稳定的节奏比一阵猛冲更可靠。',
      '平静时，大脑更容易看见结构。你可以趁这个时段整理边界、补一小块、或者把下一步写清楚。'
    ],
    closings: [
      '给自己一个明确成果：整理一页、完成一段、复习一个概念。做完收尾，让进度保持清爽。',
      '不要因为状态好就把自己塞满。留下余地，下一次回来时会更容易继续。',
      '把今天的推进记录下来。稳定不是没有波动，而是你越来越知道怎样接住自己的节奏。'
    ]
  }
];

const scenes = [
  ['任务太大', '这时先别看全貌，只切出一个小范围。'],
  ['迟迟开始不了', '入口要小到几乎不需要勇气。'],
  ['担心做不好', '先允许一个粗糙版本出现。'],
  ['时间不够', '先做能降低风险的保底步骤。'],
  ['脑子很乱', '先把念头外化，再选一个动作。'],
  ['落后感很强', '先把比较收回来，看今天能推进什么。'],
  ['被评价刺痛', '先分开反馈和自我价值。'],
  ['复习没状态', '先看结构，再进入细节。'],
  ['写作卡住', '先写口语版，让想法落地。'],
  ['杂事堆积', '先分出可行动作和等待事项。']
];

const comfortCards = moodThemes.flatMap((theme, themeIndex) => scenes.map((scene, sceneIndex) => {
  const opening = theme.openings[sceneIndex % theme.openings.length];
  const closing = theme.closings[(sceneIndex + themeIndex) % theme.closings.length];
  const middle = `${scene[1]}你可以把任务拆成三层：现在能碰到的入口、十分钟内能留下的痕迹、结束前要写清的下一步。这样做不是为了把情绪压下去，而是让情绪变成选择任务力度的线索。`;
  const reflection = `如果此刻仍然觉得重，就把标准再往下调一档。真正适合你的拆解，不该让你更害怕任务，而应该让你觉得“我可以先试一下”。`;
  return {
    id: `${theme.mood}-${sceneIndex}`,
    mood: theme.mood,
    hint: theme.hint,
    title: `${theme.mood}｜${scene[0]}`,
    text: `${opening}${middle}${closing}${reflection}`,
    paragraphs: [opening, middle, closing, reflection]
  };
}));

let activeMood = '全部';
let visibleCardCount = MOOD_CARD_STEP;
let currentCalendarDate = new Date();
let selectedDateKey = dateKey(new Date());

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function readMoodMap() {
  try { return JSON.parse(localStorage.getItem(MOOD_CALENDAR_KEY) || '{}'); }
  catch { return {}; }
}

function writeMoodMap(map) { localStorage.setItem(MOOD_CALENDAR_KEY, JSON.stringify(map)); }

function renderComfortFilters() {
  const box = moodById('moodFilters');
  if (!box) return;
  box.innerHTML = '';
  ['全部', ...moodThemes.map(theme => theme.mood)].forEach(name => {
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

function openMoodReader(card) {
  let dialog = moodById('moodReaderDialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'moodReaderDialog';
    dialog.className = 'mood-reader-dialog';
    document.body.appendChild(dialog);
  }
  const paragraphs = card.paragraphs.map(text => `<p>${text}</p>`).join('');
  dialog.innerHTML = `<div class="reader-panel"><button class="reader-close" type="button" aria-label="关闭">×</button><p class="label">${card.mood} · ${card.hint}</p><h2>${card.title}</h2><div class="reader-body">${paragraphs}</div></div>`;
  dialog.querySelector('.reader-close').addEventListener('click', () => dialog.close());
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
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
    const preview = card.text.length > 92 ? `${card.text.slice(0, 92)}…` : card.text;
    article.innerHTML = `<span class="card-tag">${card.mood} · ${card.hint}</span><h3>${card.title}</h3><p class="card-preview">${preview}</p><button class="read-card-btn" type="button">进入阅读</button>`;
    article.querySelector('.read-card-btn').addEventListener('click', () => openMoodReader(card));
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
  moodById('moodSearch')?.addEventListener('input', () => { visibleCardCount = MOOD_CARD_STEP; renderComfortCards(); });
  moodById('moreCardsBtn')?.addEventListener('click', () => { visibleCardCount += MOOD_CARD_STEP; renderComfortCards(); });
  moodById('prevMonthBtn')?.addEventListener('click', () => { currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1); renderCalendar(); });
  moodById('nextMonthBtn')?.addEventListener('click', () => { currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1); renderCalendar(); });
}

initMoodModules();
