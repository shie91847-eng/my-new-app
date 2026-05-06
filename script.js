const state = {
  blocker: 'too-big',
  energy: 'soft',
  lastMode: 'normal',
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
    first: '只选一个最小范围',
    focus: '把内容压成三个关键词',
    finish: '留下一句能复述的话',
    examples: ['翻到最相关的一页', '圈出三个陌生词', '只做一道题'],
  },
  writing: {
    first: '先写一个粗略标题',
    focus: '只补三句草稿',
    finish: '保留最顺的一句',
    examples: ['打开文档', '写下三个关键词', '先写最容易的一段'],
  },
  life: {
    first: '只处理一个手边角落',
    focus: '按留下、移走、丢弃分开',
    finish: '让一个小区域恢复清爽',
    examples: ['清一个桌角', '收五样东西', '处理一个袋子'],
  },
  creative: {
    first: '先做一个很粗的轮廓',
    focus: '只推进一个可见模块',
    finish: '保存当前版本',
    examples: ['写下核心想法', '画一个结构', '先做第一屏'],
  },
  admin: {
    first: '先找到入口和材料',
    focus: '只完成一个可确认步骤',
    finish: '写清下一步等什么',
    examples: ['打开相关页面', '找到截止时间', '先填确定的部分'],
  },
};

const blockerStrategies = {
  'too-big': {
    intro: '不是你不够努力，是边界太宽。先把森林收成一条小径。',
    title1: '把全部缩成一角',
    title2: '只推进一小段',
    title3: '留下可继续的痕迹',
  },
  'cant-start': {
    intro: '开始不需要状态很好。先让身体到场，心会慢一点跟上。',
    title1: '只打开，不立刻完成',
    title2: '试运行十分钟',
    title3: '停在容易继续的位置',
  },
  fear: {
    intro: '怕做差时，先允许它粗糙。可修改的东西，必须先存在。',
    title1: '做一个低标准草稿',
    title2: '只修最明显的一处',
    title3: '保留一个可见进展',
  },
  'low-energy': {
    intro: '能量低时，不需要冲刺。只取回一点点掌控感。',
    title1: '做一个不会失败的动作',
    title2: '温和推进十分钟',
    title3: '及时收住',
  },
  messy: {
    intro: '混乱时先别排序。让脑内的雨落到纸面上，再选一滴。',
    title1: '先清空噪音',
    title2: '只选最轻的入口',
    title3: '写清下一步',
  },
  'little-time': {
    intro: '时间少时，不做完整计划。只抓最有回声的一小块。',
    title1: '锁定关键小块',
    title2: '做高价值推进',
    title3: '留下可交接的结果',
  },
};

function byId(id) { return document.getElementById(id); }

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

function createRain() {
  const layer = byId('rainLayer');
  if (!layer) return;
  layer.innerHTML = '';
  const count = window.innerWidth < 640 ? 36 : 76;
  for (let i = 0; i < count; i += 1) {
    const drop = document.createElement('span');
    drop.className = 'drop';
    drop.style.left = `${Math.random() * 112}%`;
    drop.style.setProperty('--h', `${34 + Math.random() * 72}px`);
    drop.style.setProperty('--d', `${2.6 + Math.random() * 4.8}s`);
    drop.style.setProperty('--delay', `${Math.random() * -7}s`);
    drop.style.setProperty('--o', `${0.16 + Math.random() * 0.38}`);
    layer.appendChild(drop);
  }
}

function detectType(task) {
  const text = task.toLowerCase();
  const rules = [
    ['study', ['复习', '学习', '背', '考试', '题', '课件', '知识', '解剖', '生理', '免疫', '病理', '笔记']],
    ['writing', ['写', '论文', '报告', 'ppt', '文档', '开题', '总结', '文章', '作业']],
    ['life', ['收拾', '整理', '打扫', '洗', '房间', '桌子', '衣服', '家务']],
    ['creative', ['项目', '设计', '网页', '画', '创作', '代码', 'app', '作品', '灵感']],
    ['admin', ['报名', '申请', '邮件', '表格', '材料', '缴费', '预约', '手续']],
  ];
  const matched = rules.find(([, words]) => words.some((word) => text.includes(word)));
  return matched ? matched[0] : 'creative';
}

function energyLine(energy) {
  if (energy === 'soft') return '这版很轻，只负责开始。';
  if (energy === 'steady') return '这版保留推进，但不把今天排满。';
  return '这版可以深入一点，但边界依然清楚。';
}

function makePlan(mode = 'normal') {
  const rawTask = byId('taskInput').value.trim();
  const task = rawTask || '我有一件事情想做，但现在有点卡住';
  const selectedType = byId('taskType').value;
  const taskType = selectedType === 'auto' ? detectType(task) : selectedType;
  const profile = typeProfiles[taskType];
  const strategy = blockerStrategies[state.blocker];

  let stepOne = `${profile.first}：${profile.examples[0]}。不用评价，只让它出现在眼前。`;
  let stepTwo = `${profile.focus}。如果卡住，只问：下一步最小能小到哪里？`;
  let stepThree = `${profile.finish}。最后写一句“下次从这里继续”。`;

  if (state.blocker === 'messy') {
    stepOne = `把关于「${task}」想到的内容写满 2 分钟。不分类，不排序，只让雨落下来。`;
  }
  if (state.blocker === 'fear') {
    stepOne = `给「${task}」做一个故意不完美的版本。目标不是正确，是让它可以被修改。`;
  }
  if (state.blocker === 'little-time') {
    stepOne = `只问一句：如果只有 10 分钟，「${task}」里最值得保留的一小块是什么？`;
  }
  if (state.energy === 'soft') {
    stepTwo = `只做 6 到 10 分钟。选 ${profile.examples[1]}，有一点痕迹就停。`;
  }
  if (state.energy === 'deep') {
    stepTwo = `${profile.focus}，再做一次轻检查：看一个例子、对一个标准，或读一遍结果。`;
  }
  if (mode === 'lighter') {
    stepOne = `把「${task}」缩到几乎不会失败：${profile.examples[0]}，60 秒也算。`;
    stepTwo = `还有力气，再做 ${profile.examples[1]}；没有力气，今天已经碰到它了。`;
    stepThree = '收尾只留一句：我已经开始过。';
  }
  if (mode === 'specific') {
    stepOne = `设置 2 分钟，打开和「${task}」最相关的页面、文档或空间，标出第一个位置。`;
    stepTwo = `设置 10 分钟，只做一件事：${profile.examples[2]}。中途不切换。`;
    stepThree = '最后写三个词：做了什么、卡在哪里、下一步是什么。';
  }

  return {
    task,
    taskType,
    blocker: state.blocker,
    energy: state.energy,
    mode,
    intro: `${strategy.intro} ${energyLine(state.energy)}`,
    title1: strategy.title1,
    text1: stepOne,
    title2: strategy.title2,
    text2: stepTwo,
    title3: strategy.title3,
    text3: stepThree,
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

function init() {
  createRain();
  window.addEventListener('resize', () => {
    clearTimeout(window.__tinyStepsRainTimer);
    window.__tinyStepsRainTimer = setTimeout(createRain, 250);
  });
  setChoice('blockerChoices', 'blocker');
  setChoice('energyChoices', 'energy');
  byId('generateBtn').addEventListener('click', () => renderPlan(makePlan('normal')));
  byId('lighterBtn').addEventListener('click', () => renderPlan(makePlan('lighter')));
  byId('specificBtn').addEventListener('click', () => renderPlan(makePlan('specific')));
  byId('saveBtn').addEventListener('click', saveCurrent);
  byId('exampleBtn').addEventListener('click', () => {
    byId('taskInput').value = '我要整理一个学习计划，但事情太多，不知道从哪里开始。';
    byId('taskType').value = 'study';
  });
  renderHistory();
}

init();
