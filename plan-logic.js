const detailProfiles = {
  study: {
    name: '学习任务',
    lens: '学习任务的关键不是一次记住全部，而是先把范围、证据和复习痕迹分开。',
    diagnostic: '我会先帮你确定：要学哪一小块、要留下什么痕迹、下次回来怎么接上。',
    actions: {
      start: ['圈定一个最小章节或一个概念', '只看目录、标题和例题，不急着背', '把资料打开到最相关的一页', '先写下三个你已经看见的关键词'],
      focus: ['用自己的话解释一个概念', '做一道最能代表这一块的题', '把一个易错点改写成提醒', '整理成“问题—答案—例子”三行'],
      close: ['写下今天真正弄清楚的一句话', '标出下次继续的位置', '把没懂的点单独列出来', '给这一小块起一个复习标题'],
    },
  },
  writing: {
    name: '写作任务',
    lens: '写作任务最怕空白。先让粗糙内容出现，再逐步整理成可读版本。',
    diagnostic: '我会先帮你分清：主题是什么、先写哪一段、这一轮只打磨到什么程度。',
    actions: {
      start: ['写下题目和一句口语版中心意思', '列三个关键词，不要求顺序', '先写一个很粗糙的开头', '把想说的话写成几句自然语言'],
      focus: ['补出三个小标题', '先写最容易的一段', '把一个模糊想法扩成三句话', '给每个小标题写一句支撑句'],
      close: ['保留最顺的一句话', '标出下一段要接什么', '把不确定处先用括号圈出', '保存一个可继续修改的版本'],
    },
  },
  life: {
    name: '生活整理',
    lens: '生活任务不需要一次恢复秩序，先让一个可见角落变轻。',
    diagnostic: '我会先帮你选一个区域、一个动作和一个收尾标准，避免越整理越乱。',
    actions: {
      start: ['只选一个手边角落', '准备一个临时收纳处', '先清出一个平面', '拿起离你最近的一样东西'],
      focus: ['只处理五样东西', '分成留下、移走、丢弃', '只完成一个区域归位', '设置十分钟整理区'],
      close: ['把剩下的集中到一处', '把垃圾或工具顺手收走', '看一眼完成后的角落', '写下明天继续哪里'],
    },
  },
  creative: {
    name: '创作项目',
    lens: '创作先不追求完整，先让轮廓出现，再决定哪里值得打磨。',
    diagnostic: '我会先帮你把想法变成可见小版本，而不是一直停在脑子里。',
    actions: {
      start: ['写下核心想法和想保留的感觉', '画一个很粗的结构', '只决定第一屏或第一段', '列三个你最想呈现的元素'],
      focus: ['推进一个可见模块', '做一个低精度版本', '先完成一个能展示的小片段', '只打磨最影响观感的一处'],
      close: ['保存当前版本', '写下下次要改的一点', '给当前版本起临时名字', '记录最值得继续的地方'],
    },
  },
  admin: {
    name: '事务任务',
    lens: '事务类任务最怕材料、截止和等待项混在一起。先把入口和下一步分开。',
    diagnostic: '我会先帮你确认缺什么、能先做什么、哪里需要等待别人或材料。',
    actions: {
      start: ['找到入口页面或材料', '确认截止时间', '列出还缺什么信息', '把相关材料放到同一个地方'],
      focus: ['只填最确定的部分', '先处理最有截止感的一项', '发出一个询问或确认', '完成一个能保存的小步骤'],
      close: ['保存凭证或链接', '写清下一步等什么', '把未完成原因记下来', '确认是否还需要别人回复'],
    },
  },
};

const obstacleDetails = {
  'too-big': '任务边界太宽，当前最重要的是缩范围，而不是证明自己能一次处理全部。',
  'cant-start': '开始阻力很高，所以第一步应该像“进入现场”，而不是“完成成果”。',
  fear: '你在意质量，所以更容易被空白吓住。先要有低标准版本，再谈修改。',
  'low-energy': '能量偏低时，计划必须保护余力。能留下痕迹就很好，不适合硬冲。',
  messy: '混乱说明信息还没有外化。先把念头从脑子里倒出来，再选动作。',
  'little-time': '时间压力会压缩思考空间，所以要先做最低可交付版，再考虑优化。',
};

const hintExplanations = {
  hasDeadline: '你提到了时间压力，所以这次优先保底，不先追求完整。',
  hasMany: '你描述里有“多、乱、复杂”的信号，所以先把范围切小。',
  hasBlank: '你现在可能卡在入口处，所以第一步要小到不用再想。',
  hasQualityFear: '你可能担心结果不好，所以先允许草稿存在。',
  needsReview: '这更像复盘或检查任务，所以重点是找一个最值得修的点。',
  needsDecision: '这里有选择成本，所以先比较，再试走，不急着定终局。',
  needsCommunication: '这里涉及沟通，所以先写清事实、需求和下一步。',
  needsResearch: '这里需要资料或线索，所以先限定查找，不让搜索变成新任务。',
  needsDelivery: '这里有交付倾向，所以先做能展示、能提交、能继续加工的版本。',
};

function listActiveHints(hints) {
  return Object.keys(hints).filter((key) => hints[key]);
}

function planPick(list, seed = 0) {
  return list[Math.abs(seed) % list.length];
}

function planHash(text) {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function describeEnergyForPlan(energy) {
  if (energy === 'soft') return '你现在选择的是微弱能量，所以计划会偏轻：先建立连接，避免一上来就耗尽。';
  if (energy === 'steady') return '你现在是平稳能量，适合做一段可见推进，但仍然需要清楚边界。';
  return '你现在比较清醒，可以多做一点结构化处理，但仍然不需要把任务一次做完。';
}

function modeLabel(mode) {
  if (mode === 'lighter') return '这次会把动作再降一档，只保留最轻入口。';
  if (mode === 'specific') return '这次会把时间、动作和收尾标准写得更明确。';
  return '这次会先给你一个稳定版本：能开始、能推进、能收住。';
}

function buildReasoningLine({ taskType, hints, mainBlocker }) {
  const profile = detailProfiles[taskType];
  const activeHints = listActiveHints(hints).slice(0, 2).map((key) => hintExplanations[key]);
  const hintText = activeHints.length ? activeHints.join(' ') : '你的描述里没有特别强的截止或交付信号，所以先按“降低入口、留下痕迹”的方式拆。';
  return `我把它识别成${profile.name}。${profile.lens} ${obstacleDetails[mainBlocker]} ${hintText}`;
}

function buildDefinition({ task, taskType, hints }) {
  if (hints.hasDeadline || hints.needsDelivery) return `这一轮先不追求完整完成「${task}」，而是做出一个最低可交付版本：别人能看懂，你自己也能继续加工。`;
  if (hints.needsDecision) return `这一轮的目标不是立刻做最终选择，而是把「${task}」变成几个能比较、能试走的选项。`;
  if (hints.needsResearch) return `这一轮的目标不是查完所有资料，而是找到一条可靠线索，并把它变成能推动下一步的信息。`;
  if (hints.needsCommunication) return `这一轮的目标是写出一条能表达事实、需求和下一步的沟通草稿。`;
  if (taskType === 'study') return `这一轮只负责把「${task}」切成一个小知识块，并留下能复习的痕迹。`;
  if (taskType === 'writing') return `这一轮只负责让「${task}」从空白变成可修改草稿。`;
  return `这一轮只负责让「${task}」出现一个清楚的小进展。`;
}

function buildEnhancedSteps({ task, taskType, mainBlocker, hints, seed, mode }) {
  const profile = detailProfiles[taskType];
  let startAction = planPick(profile.actions.start, seed);
  let focusAction = planPick(profile.actions.focus, seed + 5);
  let closeAction = planPick(profile.actions.close, seed + 9);
  let startTime = '3 分钟';
  let focusTime = '10 分钟';
  let closeTime = '2 分钟';

  if (state.energy === 'soft') {
    startTime = '1 到 2 分钟';
    focusTime = '6 分钟';
    closeTime = '1 分钟';
  }

  if (state.energy === 'deep') {
    startTime = '5 分钟';
    focusTime = '15 到 20 分钟';
    closeTime = '3 分钟';
  }

  if (mode === 'lighter') {
    startTime = '60 秒';
    focusTime = '3 到 5 分钟';
    closeTime = '30 秒';
  }

  if (mode === 'specific') {
    startTime = state.energy === 'soft' ? '2 分钟' : '4 分钟';
    focusTime = state.energy === 'deep' ? '18 分钟' : '10 分钟';
    closeTime = '2 分钟';
  }

  if (hints.needsResearch) {
    startAction = '限定一个关键词、一个来源或一个参考方向';
    focusAction = '只收集一条真正能用的资料，并写下它能帮你解决什么';
    closeAction = '把资料链接、关键词和下一步用途放在一起';
  }

  if (hints.needsDecision) {
    startAction = '列出 2 到 3 个选项，每个只写一句好处和一句代价';
    focusAction = '选一个最低成本试走动作，不急着做最终决定';
    closeAction = '写下目前更倾向哪一项，以及还缺哪条信息';
  }

  if (hints.needsCommunication) {
    startAction = '写一条草稿，只包含事实、需求、下一步';
    focusAction = '把草稿改到清楚、简短、礼貌即可，不反复打磨';
    closeAction = '决定现在发送、稍后复看，还是等待补充信息';
  }

  if (mainBlocker === 'little-time' || hints.hasDeadline || hints.needsDelivery) {
    focusAction = '先做最能降低后续风险的一小块，形成最低可交付雏形';
  }

  if (mainBlocker === 'messy') {
    startAction = '把所有相关念头写满两分钟，不分类、不判断';
  }

  if (mainBlocker === 'fear' || hints.hasQualityFear) {
    startAction = '故意做一个低标准版本，让它先存在';
  }

  const stepOne = `先用 ${startTime} 做“进入现场”。具体动作是：${startAction}。这一步的判断标准不是完成多少，而是让任务从脑子里落到眼前。做完后，你应该能说清：我现在到底要处理哪一小块。`;
  const stepTwo = `再用 ${focusTime} 做“单点推进”。具体动作是：${focusAction}。这一段只允许围绕一个小结果，不临时扩展范围。如果冒出别的想法，先记在旁边，不马上切换。完成标准是：留下一个看得见、能继续的痕迹。`;
  const stepThree = `最后用 ${closeTime} 做“温柔收尾”。具体动作是：${closeAction}。收尾不是形式，它是在帮下次的你减少重新开始的阻力。最后补一句：下一次从哪里继续，最先做什么。`;

  return { stepOne, stepTwo, stepThree };
}

function makePlan(mode = 'normal') {
  const rawTask = byId('taskInput').value.trim();
  const task = rawTask || '我有一件事情想做，但现在有点卡住';
  const selectedType = byId('taskType').value;
  const taskType = selectedType === 'auto' ? detectType(task) : selectedType;
  const mainBlocker = primaryBlocker();
  const hints = detectTaskHints(task);
  const seed = planHash(task + taskType + state.blockers.join('-') + state.energy + mode);
  const profile = detailProfiles[taskType];
  const blockers = state.blockers.map((key) => blockerText[key]).join('、');
  const steps = buildEnhancedSteps({ task, taskType, mainBlocker, hints, seed, mode });
  const titles = blockerStrategies[mainBlocker].titles;

  return {
    task,
    taskType,
    blocker: state.blockers.join(','),
    energy: state.energy,
    mode,
    intro: `${buildReasoningLine({ taskType, hints, mainBlocker })} 当前阻力：${blockers}。${describeEnergyForPlan(state.energy)} ${modeLabel(mode)} ${profile.diagnostic}`,
    title1: mode === 'specific' ? '明确入口' : titles[0],
    text1: `${buildDefinition({ task, taskType, hints })} ${steps.stepOne}`,
    title2: mode === 'lighter' ? '轻量推进' : titles[1],
    text2: steps.stepTwo,
    title3: '收尾与下次连接',
    text3: steps.stepThree,
    time: new Date().toISOString(),
  };
}
