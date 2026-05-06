const state = {
  blocker: 'too-big',
  energy: 'soft',
  lastMode: 'normal',
  currentPlan: null,
};

const blockerText = {
  'too-big': '任务太大',
  'cant-start': '开始不了',
  fear: '怕做不好',
  'low-energy': '太累了',
  messy: '脑子很乱',
  'little-time': '时间太少',
};

const energyText = {
  soft: '很低能量',
  steady: '普通能量',
  deep: '可以认真做',
};

const typeText = {
  study: '学习 / 复习',
  writing: '写作 / 报告',
  life: '生活整理',
  creative: '创作 / 项目',
  admin: '杂事 / 事务',
};

const typeProfiles = {
  study: {
    object: '资料',
    first: '只定位一个最小范围',
    focus: '把内容变成三个关键词',
    finish: '用一句话复述刚刚看懂的部分',
    examples: ['翻到最相关的一页', '圈出三个陌生词', '只做一道相关题'],
  },
  writing: {
    object: '文档',
    first: '先写一个不完美标题',
    focus: '只补三个小标题或三句草稿',
    finish: '把最顺的一句留下来，其他先不修',
    examples: ['打开空文档', '写下三个关键词', '先写最容易的一段'],
  },
  life: {
    object: '空间',
    first: '只处理一个手边区域',
    focus: '按留下、移走、丢弃分三类',
    finish: '拍一下整理后的角落，给自己一个结束感',
    examples: ['只清一个桌角', '只收五样东西', '只处理一个袋子'],
  },
  creative: {
    object: '项目',
    first: '先做一个粗糙草图或列表',
    focus: '只推进一个能被看见的小模块',
    finish: '保存当前版本，不急着打磨全部',
    examples: ['写下核心想法', '画一个很粗的结构', '先做首页第一屏'],
  },
  admin: {
    object: '事项',
    first: '先找出入口和所需材料',
    focus: '只完成一个可提交或可确认的小步骤',
    finish: '记录下一步要等什么或问谁',
    examples: ['打开相关页面', '找到截止时间', '先填最确定的部分'],
  },
};

const blockerStrategies = {
  'too-big': {
    intro: '它现在不是你不够努力，而是边界太大。我们先把范围收窄到一个可以下手的入口。',
    title1: '先把全部改成一个角落',
    title2: '只推进一小段，不追求完整',
    title3: '用一句话留下完成感',
  },
  'cant-start': {
    intro: '开始不了的时候，不要先要求进入状态。先制造一个低阻力动作，让身体比大脑先到场。',
    title1: '只打开，不立刻做',
    title2: '给自己一个十分钟试运行',
    title3: '停在一个下次容易继续的位置',
  },
  fear: {
    intro: '怕做不好时，第一步要故意降低标准。先允许它粗糙，才会有东西可以修改。',
    title1: '先做一个草稿版',
    title2: '只修最明显的一处',
    title3: '保留一个可见进展',
  },
  'low-energy': {
    intro: '能量低的时候，目标不是冲刺，而是轻轻恢复一点掌控感。今天的小步可以很小。',
    title1: '做一个几乎不会失败的动作',
    title2: '只维持十分钟的温和推进',
    title3: '完成后及时收住',
  },
  messy: {
    intro: '脑子乱的时候，先不要排序。把混乱外化出来，再从里面挑一个最容易开始的点。',
    title1: '先清空脑内噪音',
    title2: '只选一个最轻的入口',
    title3: '把下一步写清楚',
  },
  'little-time': {
    intro: '时间少的时候，不做完整计划。只抓最有收益的一小块，让这段时间真的落地。',
    title1: '先锁定最关键的小块',
    title2: '用十分钟做高价值推进',
    title3: '留下一个可交接的结果',
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
  if (energy === 'soft') return '这版会尽量轻，只要求你开始，不要求你表现好。';
  if (energy === 'steady') return '这版会保留一点推进感，但不会把任务排得太满。';
  return '这版可以稍微深入一点，但仍然把边界控制在清楚的小范围里。';
}

function makePlan(mode = 'normal') {
  const rawTask = byId('taskInput').value.trim();
  const task = rawTask || '我有一件事情想做，但现在有点卡住';
  const selectedType = byId('taskType').value;
  const taskType = selectedType === 'auto' ? detectType(task) : selectedType;
  const profile = typeProfiles[taskType];
  const strategy = blockerStrategies[state.blocker];

  let stepOne = `${profile.first}：${profile.examples[0]}。先不要判断做得好不好，只让任务从“想象里”落到眼前。`;
  let stepTwo = `${profile.focus}。如果中途卡住，就只问自己：这里最小的下一步是什么？`;
  let stepThree = `${profile.finish}。结束时写下“我下次从这里继续”，避免重新开始的压力。`;

  if (state.blocker === 'messy') {
    stepOne = `拿一张纸或打开备忘录，把关于「${task}」想到的内容全部倒出来，不分类、不排序，写满 2 分钟就停。`;
  }
  if (state.blocker === 'fear') {
    stepOne = `给「${task}」做一个故意不完美的草稿版。目标不是正确，而是先有一个可以修改的东西。`;
  }
  if (state.blocker === 'little-time') {
    stepOne = `先问：如果只剩 10 分钟，「${task}」里最值得保留的一小块是什么？把其他部分暂时放到旁边。`;
  }
  if (state.energy === 'soft') {
    stepTwo = `只做 6 到 10 分钟。选 ${profile.examples[1]}，做到“有一点痕迹”就算数，不需要进入完美状态。`;
  }
  if (state.energy === 'deep') {
    stepTwo = `${profile.focus}，然后补一个验证动作：检查一个例子、对照一个标准，或把结果读一遍。`;
  }
  if (mode === 'lighter') {
    stepOne = `把「${task}」缩到几乎不会失败：${profile.examples[0]}，只做 60 秒也可以。`;
    stepTwo = `继续之前先停一下。如果还有力气，再做 ${profile.examples[1]}；没有力气，今天也已经开始了。`;
    stepThree = '收尾只需要一句话：我已经碰过它了。下次从这个入口继续。';
  }
  if (mode === 'specific') {
    stepOne = `设置 2 分钟计时器，打开和「${task}」最相关的页面、文档或空间，并把第一个要看的位置标出来。`;
    stepTwo = `设置 10 分钟计时器，只执行一个动作：${profile.examples[2]}。过程中不要切换任务。`;
    stepThree = '最后 1 分钟写下三个词：做了什么、卡在哪里、下一步是什么。';
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
  setTimeout(() => { byId('saveBtn').textContent = '保存这次'; }, 1200);
}

function renderHistory() {
  const list = byId('historyList');
  const history = getHistory();
  list.innerHTML = '';
  if (!history.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-history';
    empty.textContent = '还没有记录。生成并保存一次后，这里会留下最近的小步。';
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
