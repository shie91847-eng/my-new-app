const state = {
  blocker: 'too-big',
  energy: 'soft',
  currentPlan: null,
};

const blockerText = {
  'too-big': '太大',
  'cant-start': '难开始',
  fear: '怕做差',
  'low-energy': '没力气',
  messy: '很混乱',
  'little-time': '时间少',
};

const energyText = {
  soft: '微弱能量',
  steady: '平稳能量',
  deep: '清醒能量',
};

const typeText = {
  study: '学习',
  writing: '写作',
  life: '整理',
  creative: '创作',
  admin: '事务',
};

const typeProfiles = {
  study: {
    cue: '先把内容变小，再让记忆有落点。',
    first: ['打开最相关的一页', '只看标题和小标题', '圈出一个最小范围', '找出最像考点的一小块'],
    focus: ['整理三个关键词', '做一道代表性练习', '把一个概念讲给自己听', '用问题—答案的形式写两行'],
    close: ['写一句今天看懂了什么', '标出下次继续的位置', '把最容易忘的点写到旁边', '给这个小范围起一个标题'],
  },
  writing: {
    cue: '先有草稿，再谈好坏。空白被填上一点，阻力就会变小。',
    first: ['打开文档并写下题目', '列出三个关键词', '写一句很粗糙的开头', '把要表达的意思先写成口语'],
    focus: ['补三个小标题', '每个小标题下写一句话', '先写最容易的一段', '把一个模糊想法扩成三句话'],
    close: ['保留最顺的一句', '给下一段留一个提示词', '把不确定的地方先标出来', '写下下一次要接着写的位置'],
  },
  life: {
    cue: '生活任务不必一次恢复秩序，先让一个小角落变轻。',
    first: ['只选一个手边角落', '拿起离你最近的一样东西', '准备一个临时收纳处', '先清出一个能放东西的平面'],
    focus: ['只处理五样东西', '分成留下、移走、丢弃', '把一个表面清出来', '只完成一个区域的归位'],
    close: ['让一个小区域恢复清爽', '把剩下的东西集中到一处', '看一眼完成后的角落', '写下明天只需要继续哪里'],
  },
  creative: {
    cue: '创作先不追求完整，先让轮廓出现。',
    first: ['写下核心想法', '画一个很粗的结构', '只决定第一屏或第一段', '列出三个你想保留的感觉'],
    focus: ['推进一个可见模块', '做一个低精度版本', '先完成一个能被展示的小片段', '只打磨最影响观感的一处'],
    close: ['保存当前版本', '写下下次要改的一点', '保留一个不急着打磨的草稿', '给当前版本起一个临时名字'],
  },
  admin: {
    cue: '事务类任务最怕混在一起，先把入口、材料、下一步分开。',
    first: ['找到入口页面或材料', '确认截止时间', '列出需要谁或什么信息', '先打开相关页面并停在那里'],
    focus: ['只填最确定的部分', '发出一个询问或确认', '完成一个能被提交的小步骤', '把缺失材料单独列出来'],
    close: ['写清下一步等什么', '保存凭证或链接', '把未完成原因记下来', '把下一次要做的动作写成一句话'],
  },
};

const blockerStrategies = {
  'too-big': {
    intro: '不是你不够努力，是边界太宽。先把整片森林收成一条小径。',
    titles: ['收窄边界', '推进一小段', '留下路标'],
    principle: '只保留一个小范围，暂时不碰其余部分。',
  },
  'cant-start': {
    intro: '开始不需要状态很好。先让身体到场，心会慢一点跟上。',
    titles: ['打开入口', '试运行十分钟', '停在好继续的位置'],
    principle: '把“完成”换成“进入现场”。',
  },
  fear: {
    intro: '怕做差时，先允许它粗糙。可修改的东西，必须先存在。',
    titles: ['做低标准版本', '只修一处', '保留可见进展'],
    principle: '先生成一个不完美版本，再决定是否修改。',
  },
  'low-energy': {
    intro: '能量低时，不需要冲刺。只取回一点点掌控感。',
    titles: ['选省力入口', '轻轻推进', '及时收住'],
    principle: '把动作降到几乎不会失败。',
  },
  messy: {
    intro: '混乱时先别排序。让脑内的雨落到纸面上，再选一滴。',
    titles: ['清空噪音', '挑一个入口', '写清下一步'],
    principle: '先外化，再选择；不要在脑子里硬排。',
  },
  'little-time': {
    intro: '时间少时，不做完整计划。只抓最有回声的一小块。',
    titles: ['锁定关键小块', '做高价值推进', '留下可交接结果'],
    principle: '只做最能减少后续阻力的一步。',
  },
};

function byId(id) { return document.getElementById(id); }
function pick(list, seed = 0) { return list[Math.abs(seed) % list.length]; }
function hashText(text) { return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0); }
function rand(min, max) { return min + Math.random() * (max - min); }

function setChoice(containerId, key) {
  const container = byId(containerId);
  container.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    container.querySelectorAll('button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    state[key] = button.dataset.value;
  });
}

function preloadBackground() {
  const img = new Image();
  img.src = './IMG_20260506_123026.jpg';
  img.onload = () => document.documentElement.classList.add('bg-ready');
  img.onerror = () => document.documentElement.classList.add('bg-fallback');
}

function createForest() {
  const back = byId('pineLayerBack');
  const front = byId('pineLayerFront');
  if (!back || !front) return;
  back.innerHTML = '';
  front.innerHTML = '';
  const isSmall = window.innerWidth < 640;
  const backCount = isSmall ? 4 : 7;
  const frontCount = isSmall ? 4 : 7;

  const makeTree = (layer, depth, index, count) => {
    const tree = document.createElement('span');
    tree.className = 'pine';
    const isFront = depth === 'front';
    const baseLeft = (index / Math.max(count - 1, 1)) * 112 - 6;
    const tall = isFront ? rand(76, 142) : rand(56, 108);
    const w = isFront ? rand(78, 138) : rand(62, 116);
    tree.style.setProperty('--left', `${baseLeft + rand(-3, 3)}%`);
    tree.style.setProperty('--bottom', `${rand(-5, 4)}%`);
    tree.style.setProperty('--h', `${tall}px`);
    tree.style.setProperty('--w', `${w}px`);
    tree.style.setProperty('--o', `${isFront ? rand(0.18, 0.34) : rand(0.10, 0.22)}`);
    tree.style.setProperty('--y', `${rand(-2, 8)}px`);
    layer.appendChild(tree);
  };

  for (let i = 0; i < backCount; i += 1) makeTree(back, 'back', i, backCount);
  for (let i = 0; i < frontCount; i += 1) makeTree(front, 'front', i, frontCount);
}

function createMist() {
  const layer = byId('mistRibbons');
  if (!layer) return;
  layer.innerHTML = '';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = reduceMotion ? 1 : (window.innerWidth < 640 ? 2 : 3);
  for (let i = 0; i < count; i += 1) {
    const ribbon = document.createElement('span');
    ribbon.className = 'ribbon';
    ribbon.style.setProperty('--top', `${rand(48, 74)}%`);
    ribbon.style.setProperty('--h', `${rand(32, 62)}px`);
    ribbon.style.setProperty('--blur', `${rand(6, 9)}px`);
    ribbon.style.setProperty('--o', `${rand(0.18, 0.34)}`);
    ribbon.style.setProperty('--d', `${rand(32, 48)}s`);
    ribbon.style.setProperty('--delay', `${rand(-18, 0)}s`);
    layer.appendChild(ribbon);
  }
}

function createRain() {
  const layer = byId('rainLayer');
  if (!layer) return;
  layer.innerHTML = '';
}

function detectType(task) {
  const text = task.toLowerCase();
  const rules = [
    ['study', ['复习', '学习', '背', '考试', '题', '课程', '知识', '笔记', '阅读', '练习', 'quiz', 'test']],
    ['writing', ['写', '论文', '报告', 'ppt', '文档', '开题', '总结', '文章', '作业', '邮件草稿', 'draft', 'essay']],
    ['life', ['收拾', '整理', '打扫', '洗', '房间', '桌子', '衣服', '家务', '厨房', '行李']],
    ['creative', ['项目', '设计', '网页', '画', '创作', '代码', 'app', '作品', '灵感', '视频', '方案']],
    ['admin', ['报名', '申请', '邮件', '表格', '材料', '缴费', '预约', '手续', '文件', '提交']],
  ];
  const matched = rules.find(([, words]) => words.some((word) => text.includes(word)));
  return matched ? matched[0] : 'creative';
}

function detectTaskHints(task) {
  const text = task.toLowerCase();
  return {
    hasDeadline: /截止|ddl|deadline|明天|今晚|今天|马上|很急|来不及/.test(text),
    hasMany: /很多|好多|一堆|全部|太多|复杂|乱/.test(text),
    hasBlank: /不知道|没思路|空白|不会开始|从哪里/.test(text),
    hasQualityFear: /不够好|怕|担心|完美|出错|不好看|做差/.test(text),
  };
}

function energyLine(energy) {
  if (energy === 'soft') return '这版会很轻：只负责开始，不负责完美。';
  if (energy === 'steady') return '这版会保留推进感，但不给今天加太多重量。';
  return '这版可以稍微深入一点，同时保留清楚边界。';
}

function modeTone(mode) {
  if (mode === 'lighter') return '这一次把门槛再降一点，只求轻轻碰到任务。';
  if (mode === 'specific') return '这一次把动作写得更明确，让你不用临场再想。';
  return '先用一个稳定的小步骤，把事情从混乱里带出来。';
}

function buildSteps({ task, profile, strategy, hints, seed, mode }) {
  const actionOne = pick(profile.first, seed);
  const actionTwo = pick(profile.focus, seed + 3);
  const actionThree = pick(profile.close, seed + 7);

  let stepOne = `${strategy.principle} 现在先做：${actionOne}。不用评价成果，只让「${task}」从脑子里落到眼前。`;
  let stepTwo = `接着做一个十分钟的小推进：${actionTwo}。过程中只追踪一个问题：下一步还能不能再小一点？`;
  let stepThree = `${actionThree}。结束时给下次留下一个清楚入口，而不是把自己重新丢回混乱里。`;

  if (hints.hasDeadline) {
    stepTwo = `优先做最能减少风险的一步：${actionTwo}。先保证有可交付的雏形，再考虑补充细节。`;
  }
  if (hints.hasMany || state.blocker === 'too-big') {
    stepOne = `把「${task}」切掉九成，只保留一个小范围：${actionOne}。其余内容先放到“之后再看”。`;
  }
  if (hints.hasBlank || state.blocker === 'cant-start') {
    stepOne = `先只做进入动作：${actionOne}。打开、拿出、放到眼前，就已经算开始。`;
  }
  if (hints.hasQualityFear || state.blocker === 'fear') {
    stepOne = `先做一个低标准版本。它可以粗糙、短、不完整；存在，比漂亮更重要。`;
    stepTwo = `只修一处最明显的地方，或者只补：${actionTwo}。不要同时追求漂亮和完整。`;
  }
  if (state.blocker === 'low-energy') {
    stepOne = `选择最省力的入口：${actionOne}。能做 60 秒也算数。`;
    stepTwo = `如果还有余力，只做一点：${actionTwo}；如果没有，就在这里收住。`;
  }
  if (state.blocker === 'messy') {
    stepOne = `把关于「${task}」的念头写满两分钟。不分类、不排序，让它先落下来。`;
    stepTwo = `从刚写下的内容里圈出最轻的一项，再做：${actionTwo}。`;
  }
  if (state.blocker === 'little-time') {
    stepOne = `先问：如果只有十分钟，「${task}」里最值得保留的一小块是什么？`;
    stepTwo = `只做这块里的：${actionTwo}。其余部分先不碰。`;
  }
  if (state.energy === 'soft') {
    stepTwo = `只做 6 到 10 分钟：${actionTwo}。有一点痕迹就停，不需要进入最佳状态。`;
    stepThree = '收尾只写一句：我已经开始过。然后留下下次继续的位置。';
  }
  if (state.energy === 'deep') {
    stepTwo = `${actionTwo}，再加一个轻检查：看一个例子、对一个标准，或把结果读一遍。`;
    stepThree = `${actionThree}，再补一句“下一轮可以优化什么”。这样进度会更稳。`;
  }
  if (mode === 'lighter') {
    stepOne = `把「${task}」缩到几乎不会失败：${actionOne}，60 秒也算。`;
    stepTwo = `还有力气，再做一点：${actionTwo}；没有力气，就到这里。`;
    stepThree = '收尾只留一句：我已经碰到它了。';
  }
  if (mode === 'specific') {
    stepOne = `设置 2 分钟，完成这个明确动作：${actionOne}。`;
    stepTwo = `设置 10 分钟，只执行：${actionTwo}。期间不切换任务。`;
    stepThree = `最后 1 分钟完成：${actionThree}，并写下下一步。`;
  }

  return { stepOne, stepTwo, stepThree };
}

function makePlan(mode = 'normal') {
  const rawTask = byId('taskInput').value.trim();
  const task = rawTask || '我有一件事情想做，但现在有点卡住';
  const selectedType = byId('taskType').value;
  const taskType = selectedType === 'auto' ? detectType(task) : selectedType;
  const profile = typeProfiles[taskType];
  const strategy = blockerStrategies[state.blocker];
  const hints = detectTaskHints(task);
  const seed = hashText(task + taskType + state.blocker + state.energy + mode);
  const steps = buildSteps({ task, profile, strategy, hints, seed, mode });

  return {
    task,
    taskType,
    blocker: state.blocker,
    energy: state.energy,
    mode,
    intro: `${strategy.intro} ${profile.cue} ${energyLine(state.energy)} ${modeTone(mode)}`,
    title1: strategy.titles[0],
    text1: steps.stepOne,
    title2: strategy.titles[1],
    text2: steps.stepTwo,
    title3: strategy.titles[2],
    text3: steps.stepThree,
    time: new Date().toISOString(),
  };
}

function renderPlan(plan) {
  state.currentPlan = plan;
  byId('emptyState').hidden = true;
  byId('result').hidden = false;
  byId('resultIntro').textContent = plan.intro;
  byId('stepOneTitle').textContent = plan.title1;
  byId('stepOneText').textContent = plan.text1;
  byId('stepTwoTitle').textContent = plan.title2;
  byId('stepTwoText').textContent = plan.text2;
  byId('stepThreeTitle').textContent = plan.title3;
  byId('stepThreeText').textContent = plan.text3;
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('tinyStepsHistory') || '[]'); }
  catch { return []; }
}

function setHistory(items) {
  localStorage.setItem('tinyStepsHistory', JSON.stringify(items.slice(0, 9)));
}

function saveCurrent() {
  if (!state.currentPlan) return;
  const history = getHistory();
  setHistory([state.currentPlan, ...history.filter((item) => item.task !== state.currentPlan.task)]);
  renderHistory();
  byId('saveBtn').textContent = '已保存';
  setTimeout(() => { byId('saveBtn').textContent = '保存'; }, 1200);
}

function renderHistory() {
  const list = byId('historyList');
  const history = getHistory();
  list.innerHTML = '';
  if (!history.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-history';
    empty.textContent = '还没有记录。保存一次后，这里会留下最近的小步。';
    list.appendChild(empty);
    return;
  }
  const template = byId('historyTemplate');
  history.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.history-task').textContent = item.task;
    node.querySelector('.history-meta').textContent = `${typeText[item.taskType]} · ${blockerText[item.blocker]} · ${energyText[item.energy]}`;
    node.querySelector('.reuse-btn').addEventListener('click', () => {
      byId('taskInput').value = item.task;
      byId('taskType').value = item.taskType;
      renderPlan(makePlan(item.mode || 'normal'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    list.appendChild(node);
  });
}

function regenerateAtmosphere() {
  createForest();
  createMist();
  createRain();
}

function init() {
  preloadBackground();
  regenerateAtmosphere();
  window.addEventListener('resize', () => {
    clearTimeout(window.__tinyStepsAtmosphereTimer);
    window.__tinyStepsAtmosphereTimer = setTimeout(regenerateAtmosphere, 350);
  });
  setChoice('blockerChoices', 'blocker');
  setChoice('energyChoices', 'energy');
  byId('generateBtn').addEventListener('click', () => renderPlan(makePlan('normal')));
  byId('lighterBtn').addEventListener('click', () => renderPlan(makePlan('lighter')));
  byId('specificBtn').addEventListener('click', () => renderPlan(makePlan('specific')));
  byId('saveBtn').addEventListener('click', saveCurrent);
  byId('exampleBtn').addEventListener('click', () => {
    byId('taskInput').value = '我有一个报告要写，但不知道从哪里开始。';
    byId('taskType').value = 'writing';
  });
  renderHistory();
}

init();
