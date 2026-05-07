const detailProfiles = {
  study: {
    name: '学习任务',
    lens: '这类任务不用一口气学完，先把范围收小，再留下能复习的痕迹。',
    actions: {
      start: ['打开最相关的一页，只看标题和小标题', '圈出一个最小章节或一个概念', '先写下三个已经看见的关键词', '把资料摊开到眼前，选出今天只碰的一小块'],
      focus: ['用自己的话解释一个概念', '做一道最有代表性的小题', '把一个易错点写成提醒', '整理成“问题—答案—例子”三行'],
      close: ['写下今天真正看懂的一句话', '标出下次继续的位置', '把还没懂的地方单独留出来', '给这一小块起一个复习标题'],
    },
  },
  writing: {
    name: '写作任务',
    lens: '这类任务最怕一直停在空白里。先让草稿出现，再慢慢把它变好。',
    actions: {
      start: ['写下题目和一句很口语的中心意思', '列三个关键词，不要求顺序', '先写一个粗糙开头', '把想说的话先写成自然语言'],
      focus: ['补出三个小标题', '先写最容易的一段', '把一个模糊想法扩成三句话', '给每个小标题写一句支撑句'],
      close: ['保留最顺的一句话', '标出下一段要接什么', '把不确定处先用括号圈出', '保存一个下次能继续改的版本'],
    },
  },
  life: {
    name: '生活整理',
    lens: '这类任务不需要一下子恢复秩序，先让一个可见角落变轻。',
    actions: {
      start: ['只选一个手边角落', '准备一个临时收纳处', '先清出一个平面', '拿起离你最近的一样东西'],
      focus: ['只处理五样东西', '分成留下、移走、丢弃', '只完成一个区域归位', '设置十分钟整理区'],
      close: ['把剩下的集中到一处', '把垃圾或工具顺手收走', '看一眼完成后的角落', '写下明天继续哪里'],
    },
  },
  creative: {
    name: '创作项目',
    lens: '这类任务先不追求完整，先让轮廓出现，再决定哪里值得打磨。',
    actions: {
      start: ['写下核心想法和想保留的感觉', '画一个很粗的结构', '只决定第一屏或第一段', '列三个最想呈现的元素'],
      focus: ['推进一个看得见的小模块', '做一个低精度版本', '先完成一个能展示的小片段', '只打磨最影响观感的一处'],
      close: ['保存当前版本', '写下下次要改的一点', '给当前版本起临时名字', '记录最值得继续的地方'],
    },
  },
  admin: {
    name: '事务任务',
    lens: '这类任务容易被材料、截止和等待项搅在一起，先把入口和下一步分开。',
    actions: {
      start: ['找到入口页面或材料', '确认截止时间', '列出还缺什么信息', '把相关材料放到同一个地方'],
      focus: ['只填最确定的部分', '先处理最有截止感的一项', '发出一个询问或确认', '完成一个可以保存的小步骤'],
      close: ['保存凭证或链接', '写清下一步等什么', '把未完成原因记下来', '确认是否还需要别人回复'],
    },
  },
};

const obstacleDetails = {
  'too-big': '它现在看起来太大了，所以我们先不碰全部，只切出一个小范围。',
  'cant-start': '最难的是开始，所以第一步只负责把你带到任务旁边，不要求马上进入状态。',
  fear: '你可能很在意结果好不好，所以先做一个可以修改的低标准版本。',
  'low-energy': '现在能量不高，计划要轻一点，先保留余力，不靠硬撑推进。',
  messy: '现在像是很多念头挤在一起，先让它们落到纸面上，再选一个入口。',
  'little-time': '时间比较紧，所以先抓最能降低风险的一小块，别把精力花在完整规划上。',
};

const hintExplanations = {
  hasDeadline: '你提到了时间压力，所以这次先做保底版，再考虑优化。',
  hasMany: '你描述里有“多、乱、复杂”的感觉，所以先把范围切小。',
  hasBlank: '你现在可能卡在入口，所以第一步要小到不用再犹豫。',
  hasQualityFear: '你可能担心做得不好，所以先允许它粗糙一点。',
  needsReview: '这更像检查或复盘，所以先找一个最值得修的地方。',
  needsDecision: '这里有选择成本，所以先比较，再试走，不急着定下来。',
  needsCommunication: '这里涉及沟通，所以先写清事实、需求和下一步。',
  needsResearch: '这里需要资料，所以先限定查找范围，避免越查越散。',
  needsDelivery: '这里有交付倾向，所以先做一个能被看见、能继续加工的版本。',
};

function planPick(list, seed = 0) {
  return list[Math.abs(seed) % list.length];
}

function planHash(text) {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function activeHintTexts(hints) {
  return Object.keys(hints)
    .filter((key) => hints[key])
    .slice(0, 2)
    .map((key) => hintExplanations[key]);
}

function softEnergyLine(energy) {
  if (energy === 'soft') return '你现在的能量偏轻，所以这份计划会把门槛放低：先开始，先留下痕迹，不要求漂亮。';
  if (energy === 'steady') return '你现在比较稳，可以做一段真正的推进，但每一步仍然要有边界。';
  return '你现在比较清醒，可以多做一点整理和检查，但也不需要把整件事一次吃完。';
}

function modeLine(mode) {
  if (mode === 'lighter') return '这次我会把它拆得更轻，轻到你只需要先碰一下任务。';
  if (mode === 'specific') return '这次我会把动作写得更具体，让你照着做时不用临场再想。';
  return '这次先给你一个稳稳的小版本：能开始，能推进，也能收住。';
}

function taskGoal({ task, taskType, hints }) {
  if (hints.hasDeadline || hints.needsDelivery) return `这一轮先不追求把「${task}」彻底做完，而是做出一个最低可用版本：能看懂、能交代、能继续补。`;
  if (hints.needsDecision) return `这一轮先不逼自己立刻决定，而是把「${task}」变成几个能比较的小选项。`;
  if (hints.needsResearch) return `这一轮先不查完所有资料，只找一条真正有用的线索，并写清它能帮你什么。`;
  if (hints.needsCommunication) return `这一轮先写出一条能发送的草稿：事实是什么、你需要什么、下一步是什么。`;
  if (taskType === 'study') return `这一轮只处理「${task}」里的一个小知识块，目标是留下能复习的痕迹。`;
  if (taskType === 'writing') return `这一轮只让「${task}」从空白变成草稿，先有东西，再慢慢改。`;
  return `这一轮只让「${task}」出现一个清楚的小进展，不急着把全部解决。`;
}

function buildPlanIntro({ taskType, hints, mainBlocker }) {
  const profile = detailProfiles[taskType];
  const hintsText = activeHintTexts(hints);
  const clue = hintsText.length ? hintsText.join(' ') : '你没有写出特别强的截止或交付压力，所以先按“降低入口、留下痕迹”的方式拆。';
  return `我先把它当作${profile.name}来处理。${profile.lens} ${obstacleDetails[mainBlocker]} ${clue}`;
}

function buildStepActions({ taskType, mainBlocker, hints, seed }) {
  const profile = detailProfiles[taskType];
  let startAction = planPick(profile.actions.start, seed);
  let focusAction = planPick(profile.actions.focus, seed + 5);
  let closeAction = planPick(profile.actions.close, seed + 9);

  if (hints.needsResearch) {
    startAction = '只选一个关键词、一个来源，或者一个参考方向';
    focusAction = '只收集一条真正能用的信息，并写下它能解决什么问题';
    closeAction = '把资料链接、关键词和下一步用途放在同一个地方';
  }
  if (hints.needsDecision) {
    startAction = '列出 2 到 3 个选项，每个只写一句好处和一句代价';
    focusAction = '选一个最低成本的试走动作，而不是直接做最终决定';
    closeAction = '写下你现在更倾向哪一项，以及还缺哪条信息';
  }
  if (hints.needsCommunication) {
    startAction = '写一条草稿，只包含事实、需求和下一步';
    focusAction = '把草稿改到清楚、简短、礼貌即可，不反复打磨';
    closeAction = '决定现在发送、稍后复看，还是等待补充信息';
  }
  if (mainBlocker === 'little-time' || hints.hasDeadline || hints.needsDelivery) {
    focusAction = '先做最能降低风险的一小块，让它变成一个最低可用的雏形';
  }
  if (mainBlocker === 'messy') {
    startAction = '把所有相关念头写满两分钟，不分类，也不急着整理';
  }
  if (mainBlocker === 'fear' || hints.hasQualityFear) {
    startAction = '故意做一个低标准版本，让它先存在';
  }
  if (mainBlocker === 'cant-start' || hints.hasBlank) {
    startAction = `${startAction}。如果还是卡住，就只做打开、摆好、写第一行这类进入动作`;
  }

  return { startAction, focusAction, closeAction };
}

function timeBox(mode, energy) {
  if (mode === 'lighter') return { start: '60 秒', focus: '3 到 5 分钟', close: '30 秒' };
  if (mode === 'specific') return { start: energy === 'soft' ? '2 分钟' : '4 分钟', focus: energy === 'deep' ? '18 分钟' : '10 分钟', close: '2 分钟' };
  if (energy === 'soft') return { start: '1 到 2 分钟', focus: '6 到 8 分钟', close: '1 分钟' };
  if (energy === 'deep') return { start: '5 分钟', focus: '15 到 20 分钟', close: '3 分钟' };
  return { start: '3 分钟', focus: '10 到 12 分钟', close: '2 分钟' };
}

function buildEnhancedSteps({ task, taskType, mainBlocker, hints, seed, mode }) {
  const actions = buildStepActions({ taskType, mainBlocker, hints, seed });
  const time = timeBox(mode, state.energy);

  const stepOne = `先用 ${time.start} 把任务摆到眼前。你要做的是：${actions.startAction}。这一步不要追求进度，只要让自己知道“我现在处理的是哪一小块”。如果你做完后能说出这一小块的名字，就已经成功。`;

  const stepTwo = `再用 ${time.focus} 只推进一个小结果。你要做的是：${actions.focusAction}。这一段最重要的是不临时扩展范围；冒出别的想法，就先记在旁边。结束时要留下一个看得见的东西，比如一句话、一个标题、一个草稿、一个已处理的小区域，或者一个可继续的版本。`;

  const stepThree = `最后用 ${time.close} 收尾。你要做的是：${actions.closeAction}。收尾不是走流程，它是为了让下次的你不用重新从混乱里开始。最后补一句很短的话：下一次从哪里继续，最先做什么。`;

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
  const blockers = state.blockers.map((key) => blockerText[key]).join('、');
  const steps = buildEnhancedSteps({ task, taskType, mainBlocker, hints, seed, mode });
  const titles = blockerStrategies[mainBlocker].titles;

  return {
    task,
    taskType,
    blocker: state.blockers.join(','),
    energy: state.energy,
    mode,
    intro: `${buildPlanIntro({ taskType, hints, mainBlocker })} 当前阻力：${blockers}。${softEnergyLine(state.energy)} ${modeLine(mode)}`,
    title1: mode === 'specific' ? '先定清楚入口' : titles[0],
    text1: `${taskGoal({ task, taskType, hints })} ${steps.stepOne}`,
    title2: mode === 'lighter' ? '轻轻推进一点' : titles[1],
    text2: steps.stepTwo,
    title3: '收住，并留给下次',
    text3: steps.stepThree,
    time: new Date().toISOString(),
  };
}

function applyHeroAndLightPolish() {
  const title = document.getElementById('page-title');
  if (title) title.textContent = '把卡住的事，拆成一个能开始的小动作';

  const style = document.createElement('style');
  style.textContent = `
    @media (min-width: 921px) {
      .hero { max-width: 1120px; }
      .hero h1 {
        max-width: none;
        white-space: nowrap;
        font-size: clamp(42px, 4.6vw, 72px);
        line-height: 1.08;
        letter-spacing: -0.06em;
      }
      .lead { width: min(760px, 100%); }
      .micro-guide { width: min(720px, 100%); }
    }

    @media (max-width: 640px) {
      .hero h1 {
        max-width: 9.6em;
        white-space: normal;
      }
    }

    .atmosphere {
      filter: saturate(calc(1.06 + var(--cosmic-intensity) * .24)) brightness(calc(1.02 + var(--cosmic-intensity) * .095)) !important;
    }
    .distant-light {
      opacity: calc(.50 + var(--cosmic-intensity) * .42) !important;
      filter: blur(14px) saturate(calc(1.18 + var(--cosmic-intensity) * .22)) brightness(calc(1.04 + var(--cosmic-intensity) * .18)) !important;
    }
    .sky-wash {
      opacity: calc(.86 + var(--cosmic-intensity) * .28) !important;
    }
    body.cosmic-writing .atmosphere,
    body.cosmic-has-words .atmosphere {
      filter: saturate(calc(1.12 + var(--cosmic-intensity) * .28)) brightness(calc(1.045 + var(--cosmic-intensity) * .12)) !important;
    }
  `;
  document.head.appendChild(style);
}

applyHeroAndLightPolish();
