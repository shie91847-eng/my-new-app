const COSMIC_LETTERS_KEY = 'tinyStepsLetters';

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

function formatLetterDate(iso) {
  return new Date(iso).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
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
  if (dialog?.open) dialog.close();
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
  closeWhisper();
  overlay?.classList.add('is-active');

  window.setTimeout(() => {
    overlay?.classList.remove('is-active');
  }, 1850);
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

function clearLetters() {
  localStorage.removeItem(COSMIC_LETTERS_KEY);
  renderLetters();
}

function initCosmicWhispers() {
  cosmicById('openWhisperBtn')?.addEventListener('click', openWhisper);
  cosmicById('closeWhisperBtn')?.addEventListener('click', closeWhisper);
  cosmicById('releaseBtn')?.addEventListener('click', releaseToUniverse);
  cosmicById('saveLetterBtn')?.addEventListener('click', saveLetter);
  cosmicById('clearLettersBtn')?.addEventListener('click', clearLetters);

  cosmicById('whisperDialog')?.addEventListener('cancel', () => {
    document.body.classList.remove('cosmic-writing');
  });

  renderLetters();
}

initCosmicWhispers();
