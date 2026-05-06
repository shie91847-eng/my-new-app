const COSMIC_LETTERS_KEY = 'tinyStepsLetters';
const COSMIC_PARTICLE_COUNT = window.innerWidth < 640 ? 28 : 44;

function cosmicById(id) {
  return document.getElementById(id);
}

function getLetters() {
  try {
    return JSON.parse(localStorage.getItem(COSMIC_LETTERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function setLetters(items) {
  localStorage.setItem(COSMIC_LETTERS_KEY, JSON.stringify(items.slice(0, 12)));
}

function setCosmicIntensity(value) {
  const safeValue = Math.max(0, Math.min(1, value));
  document.documentElement.style.setProperty('--cosmic-intensity', safeValue.toFixed(2));
}

function formatLetterDate(iso) {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderLetters() {
  const section = cosmicById('lettersSection');
  const list = cosmicById('lettersList');
  if (!section || !list) return;

  const letters = getLetters();
  section.hidden = letters.length === 0;
  list.innerHTML = '';

  letters.forEach((letter) => {
    const article = document.createElement('article');
    article.className = 'letter-item';

    const date = document.createElement('p');
    date.className = 'letter-date';
    date.textContent = formatLetterDate(letter.time);

    const text = document.createElement('p');
    text.className = 'letter-text';
    text.textContent = letter.text;

    article.append(date, text);
    list.appendChild(article);
  });
}

function openWhisper() {
  const dialog = cosmicById('whisperDialog');
  const input = cosmicById('whisperInput');
  document.body.classList.add('cosmic-writing');
  setCosmicIntensity(input?.value.trim() ? 0.45 : 0.22);
  if (dialog && typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else if (dialog) {
    dialog.setAttribute('open', '');
  }
  setTimeout(() => input?.focus(), 60);
}

function closeWhisper() {
  const dialog = cosmicById('whisperDialog');
  document.body.classList.remove('cosmic-writing');
  document.body.classList.remove('cosmic-has-words');
  setCosmicIntensity(0);
  if (dialog?.open) dialog.close();
}

function createCosmicParticles() {
  const layer = cosmicById('cosmicParticles');
  if (!layer) return;
  layer.innerHTML = '';

  for (let i = 0; i < COSMIC_PARTICLE_COUNT; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'cosmic-particle';

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * (window.innerWidth < 640 ? 230 : 340);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 120 - Math.random() * 110;

    particle.style.setProperty('--x', `${x.toFixed(1)}px`);
    particle.style.setProperty('--y', `${y.toFixed(1)}px`);
    particle.style.setProperty('--size', `${(3 + Math.random() * 8).toFixed(1)}px`);
    particle.style.setProperty('--scale', `${(0.72 + Math.random() * 1.5).toFixed(2)}`);
    particle.style.setProperty('--duration', `${(2.5 + Math.random() * 1.4).toFixed(2)}s`);
    particle.style.setProperty('--delay', `${(Math.random() * 0.58).toFixed(2)}s`);
    layer.appendChild(particle);
  }
}

function releaseToUniverse() {
  const input = cosmicById('whisperInput');
  const overlay = cosmicById('cosmicOverlay');
  const text = input?.value.trim();
  if (!text) {
    input?.focus();
    return;
  }

  input.value = '';
  createCosmicParticles();
  closeWhisper();
  setCosmicIntensity(0.85);

  overlay?.classList.remove('is-active');
  void overlay?.offsetWidth;
  overlay?.classList.add('is-active');

  window.setTimeout(() => {
    overlay?.classList.remove('is-active');
    setCosmicIntensity(0);
  }, 3900);
}

function saveLetter() {
  const input = cosmicById('whisperInput');
  const text = input?.value.trim();
  if (!text) {
    input?.focus();
    return;
  }

  const letters = getLetters();
  setLetters([{ text, time: new Date().toISOString() }, ...letters]);
  input.value = '';
  closeWhisper();
  renderLetters();

  const section = cosmicById('lettersSection');
  section?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function exportLettersAsTxt() {
  const letters = getLetters();
  if (!letters.length) return;

  const content = [
    'Tiny Steps｜心里的微光记录',
    `导出时间：${formatLetterDate(new Date().toISOString())}`,
    '',
    ...letters.slice().reverse().flatMap((letter, index) => [
      `【${index + 1}】${formatLetterDate(letter.time)}`,
      letter.text,
      '',
      '——',
      '',
    ]),
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const day = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `tiny-steps-notes-${day}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function clearLetters() {
  localStorage.removeItem(COSMIC_LETTERS_KEY);
  renderLetters();
}

function updateWritingAtmosphere() {
  const input = cosmicById('whisperInput');
  const length = input?.value.trim().length || 0;
  const intensity = length ? Math.min(1, 0.34 + length / 180) : 0.22;
  document.body.classList.toggle('cosmic-has-words', Boolean(length));
  setCosmicIntensity(intensity);
}

function initCosmicWhispers() {
  cosmicById('openWhisperBtn')?.addEventListener('click', openWhisper);
  cosmicById('closeWhisperBtn')?.addEventListener('click', closeWhisper);
  cosmicById('releaseBtn')?.addEventListener('click', releaseToUniverse);
  cosmicById('saveLetterBtn')?.addEventListener('click', saveLetter);
  cosmicById('exportLettersBtn')?.addEventListener('click', exportLettersAsTxt);
  cosmicById('clearLettersBtn')?.addEventListener('click', clearLetters);
  cosmicById('whisperInput')?.addEventListener('input', updateWritingAtmosphere);

  cosmicById('whisperDialog')?.addEventListener('cancel', () => {
    document.body.classList.remove('cosmic-writing');
    document.body.classList.remove('cosmic-has-words');
    setCosmicIntensity(0);
  });

  renderLetters();
}

initCosmicWhispers();
