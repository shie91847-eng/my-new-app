function applyClarityPolish() {
  const style = document.createElement('style');
  style.textContent = `
    body { background: #eaf3f8 !important; }

    .atmosphere {
      background:
        linear-gradient(180deg, rgba(235,246,252,.42) 0%, rgba(218,232,248,.28) 34%, rgba(190,218,224,.22) 62%, rgba(128,168,148,.16) 100%),
        radial-gradient(circle at 18% 12%, rgba(174,160,213,.22), transparent 30%),
        radial-gradient(circle at 78% 18%, rgba(141,186,218,.26), transparent 34%),
        url("./IMG_20260506_123026.jpg") !important;
      background-size: cover !important;
      background-position: center center !important;
      background-attachment: scroll !important;
      filter: saturate(calc(1.12 + var(--cosmic-intensity) * .28)) brightness(calc(1.025 + var(--cosmic-intensity) * .11)) contrast(.99) !important;
    }

    .atmosphere::before {
      opacity: calc(.66 + var(--cosmic-intensity) * .22) !important;
      background:
        radial-gradient(ellipse at 20% 42%, rgba(142,210,248,.40), transparent 38%),
        radial-gradient(ellipse at 42% 22%, rgba(190,158,240,.36), transparent 34%),
        radial-gradient(ellipse at 58% 28%, rgba(255,224,126,.36), transparent 34%),
        radial-gradient(ellipse at 78% 58%, rgba(154,222,238,.30), transparent 40%) !important;
      animation-duration: calc(3.6s - var(--cosmic-intensity) * 1.2s) !important;
    }

    .atmosphere::after {
      opacity: .68 !important;
      background:
        linear-gradient(180deg, rgba(255,255,255,.18), transparent 40%, rgba(217,239,236,.12)),
        radial-gradient(circle at 20% 12%, rgba(190,160,238,.24), transparent 30%),
        radial-gradient(circle at 82% 18%, rgba(135,210,248,.28), transparent 34%),
        radial-gradient(circle at 48% 10%, rgba(255,225,132,.22), transparent 30%) !important;
      animation-duration: calc(3.8s - var(--cosmic-intensity) * 1.1s) !important;
    }

    .sky-wash {
      opacity: calc(.56 + var(--cosmic-intensity) * .24) !important;
      mix-blend-mode: screen !important;
      animation-duration: calc(9s - var(--cosmic-intensity) * 3s) !important;
    }

    .distant-light {
      opacity: calc(.40 + var(--cosmic-intensity) * .35) !important;
      filter: blur(13px) saturate(calc(1.13 + var(--cosmic-intensity) * .23)) brightness(calc(1.05 + var(--cosmic-intensity) * .17)) !important;
    }

    .fog-bank {
      height: 18vh !important;
      bottom: 17vh !important;
      filter: blur(6px) !important;
      opacity: calc(.22 + var(--cosmic-intensity) * .12) !important;
      background:
        radial-gradient(ellipse at 18% 62%, rgba(255,255,255,.26), transparent 58%),
        radial-gradient(ellipse at 52% 44%, rgba(225,240,246,.22), transparent 60%),
        radial-gradient(ellipse at 82% 60%, rgba(201,226,225,.15), transparent 62%) !important;
    }

    body.cosmic-writing .fog-bank,
    body.cosmic-has-words .fog-bank { opacity: calc(.25 + var(--cosmic-intensity) * .14) !important; }

    .ribbon {
      opacity: var(--o, calc(.58 + var(--cosmic-intensity) * .20)) !important;
      filter: blur(var(--blur, 6px)) saturate(calc(1.18 + var(--cosmic-intensity) * .22)) brightness(1.07) !important;
      animation-duration: calc(10.5s - var(--cosmic-intensity) * 3.5s) !important;
      background:
        radial-gradient(ellipse at 18% 50%, rgba(255,255,255,.46), transparent 44%),
        radial-gradient(ellipse at 43% 50%, rgba(205,196,255,.44), transparent 50%),
        radial-gradient(ellipse at 72% 50%, rgba(157,222,250,.40), transparent 50%),
        radial-gradient(ellipse at 58% 50%, rgba(255,226,140,.38), transparent 46%),
        linear-gradient(90deg, transparent, rgba(255,255,255,.26), rgba(185,209,252,.30), rgba(255,224,140,.26), transparent) !important;
    }

    .glass-noise { opacity: .024 !important; }

    .panel,
    .history-wrap {
      background: rgba(255,255,255,.045) !important;
      border-color: rgba(255,255,255,.22) !important;
      box-shadow: 0 22px 58px rgba(18,42,62,.075) !important;
      backdrop-filter: blur(.55px) saturate(1.05) !important;
      -webkit-backdrop-filter: blur(.55px) saturate(1.05) !important;
    }

    .panel::before,
    .history-wrap::before,
    .step-card::after,
    .result-intro::after,
    .task-field::after { opacity: .46 !important; }

    textarea,
    select,
    .result-intro,
    .step-card,
    .history-item,
    .letter-item,
    .comfort-card,
    .day-cell {
      background: rgba(255,255,255,.035) !important;
      border-color: rgba(255,255,255,.20) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.11), 0 10px 24px rgba(18,42,62,.032) !important;
    }

    textarea:focus,
    select:focus {
      background: rgba(255,255,255,.07) !important;
      border-color: rgba(178,212,232,.42) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 0 0 4px rgba(190,220,238,.09), 0 14px 34px rgba(21,42,58,.04) !important;
    }

    .choice,
    .segment,
    .ghost-btn,
    .reuse-btn,
    .text-btn,
    .mood-filter,
    .month-btn,
    .mood-pill,
    .more-cards-btn,
    .read-card-btn {
      background: rgba(255,255,255,.042) !important;
      border-color: rgba(255,255,255,.22) !important;
    }

    .choice.is-active,
    .segment.is-active,
    .mood-filter.is-active,
    .mood-pill.is-active {
      background: linear-gradient(135deg, rgba(167,211,240,.18), rgba(197,174,238,.12), rgba(255,225,145,.12)) !important;
      border-color: rgba(255,255,255,.38) !important;
    }

    .primary-btn,
    .secondary-btn,
    .cosmic-btn.primary {
      background: linear-gradient(135deg, #557b99, #7b73b2) !important;
      box-shadow: 0 12px 28px rgba(45,76,105,.17) !important;
    }

    .calendar-wrap::after { opacity: .44 !important; }
    .reader-body,
    .whisper-panel,
    .reader-panel { background: linear-gradient(145deg, rgba(255,255,255,.15), rgba(255,255,255,.04)) !important; }
    .reader-body { border-color: rgba(255,255,255,.26) !important; }
  `;
  document.head.appendChild(style);
}

applyClarityPolish();
