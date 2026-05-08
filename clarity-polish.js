function applyClarityPolish() {
  const style = document.createElement('style');
  style.textContent = `
    body { background: #f3f9fc !important; }

    .atmosphere {
      background:
        linear-gradient(180deg, rgba(250,254,255,.86) 0%, rgba(238,248,253,.78) 34%, rgba(219,239,238,.62) 70%, rgba(166,196,181,.46) 100%),
        linear-gradient(120deg, rgba(226,219,252,.16), rgba(204,234,249,.22), rgba(255,236,175,.12)),
        url("https://commons.wikimedia.org/wiki/Special:FilePath/Misty%20coniferous%20forest%20on%20a%20slope%20%28Unsplash%29.jpg") !important;
      background-size: cover !important;
      background-position: center bottom !important;
      filter: saturate(calc(1.08 + var(--cosmic-intensity) * .22)) brightness(calc(1.08 + var(--cosmic-intensity) * .13)) contrast(.94) !important;
    }

    .atmosphere::before {
      opacity: calc(.48 + var(--cosmic-intensity) * .18) !important;
      background:
        radial-gradient(ellipse at 24% 42%, rgba(170,215,242,.28), transparent 36%),
        radial-gradient(ellipse at 42% 22%, rgba(198,178,236,.26), transparent 34%),
        radial-gradient(ellipse at 58% 28%, rgba(255,232,158,.26), transparent 34%),
        radial-gradient(ellipse at 74% 58%, rgba(174,221,236,.22), transparent 38%) !important;
      animation-duration: calc(4.4s - var(--cosmic-intensity) * 1.4s) !important;
    }

    .atmosphere::after {
      opacity: .58 !important;
      background:
        linear-gradient(180deg, rgba(255,255,255,.38), transparent 42%, rgba(235,248,247,.16)),
        radial-gradient(circle at 20% 12%, rgba(194,181,232,.16), transparent 28%),
        radial-gradient(circle at 82% 18%, rgba(171,218,242,.20), transparent 34%),
        radial-gradient(circle at 50% 10%, rgba(255,237,176,.13), transparent 30%) !important;
    }

    .sky-wash { opacity: calc(.64 + var(--cosmic-intensity) * .18) !important; mix-blend-mode: screen !important; }
    .distant-light { opacity: calc(.46 + var(--cosmic-intensity) * .34) !important; filter: blur(12px) saturate(calc(1.08 + var(--cosmic-intensity) * .18)) brightness(calc(1.12 + var(--cosmic-intensity) * .20)) !important; }

    .fog-bank {
      height: 16vh !important;
      bottom: 17vh !important;
      filter: blur(6px) !important;
      opacity: calc(.16 + var(--cosmic-intensity) * .10) !important;
      background:
        radial-gradient(ellipse at 18% 62%, rgba(255,255,255,.28), transparent 58%),
        radial-gradient(ellipse at 52% 44%, rgba(230,242,248,.22), transparent 60%),
        radial-gradient(ellipse at 82% 60%, rgba(210,232,232,.14), transparent 62%) !important;
    }

    body.cosmic-writing .fog-bank,
    body.cosmic-has-words .fog-bank { opacity: calc(.20 + var(--cosmic-intensity) * .12) !important; }

    .ribbon {
      opacity: var(--o, calc(.42 + var(--cosmic-intensity) * .18)) !important;
      filter: blur(var(--blur, 6px)) saturate(calc(1.08 + var(--cosmic-intensity) * .16)) brightness(1.06) !important;
      background:
        radial-gradient(ellipse at 18% 50%, rgba(255,255,255,.45), transparent 44%),
        radial-gradient(ellipse at 46% 50%, rgba(214,220,255,.34), transparent 50%),
        radial-gradient(ellipse at 72% 50%, rgba(186,226,248,.30), transparent 50%),
        radial-gradient(ellipse at 58% 50%, rgba(255,233,166,.24), transparent 46%),
        linear-gradient(90deg, transparent, rgba(255,255,255,.30), rgba(210,225,252,.24), rgba(255,233,166,.16), transparent) !important;
    }

    .glass-noise { opacity: .018 !important; }

    .panel,
    .history-wrap {
      background: rgba(255,255,255,.065) !important;
      border-color: rgba(255,255,255,.28) !important;
      box-shadow: 0 22px 58px rgba(18,42,62,.065) !important;
      backdrop-filter: blur(.75px) saturate(1.06) brightness(1.02) !important;
      -webkit-backdrop-filter: blur(.75px) saturate(1.06) brightness(1.02) !important;
    }

    .panel::before,
    .history-wrap::before,
    .step-card::after,
    .result-intro::after,
    .task-field::after { opacity: .34 !important; }

    textarea,
    select,
    .result-intro,
    .step-card,
    .history-item,
    .letter-item,
    .comfort-card,
    .day-cell {
      background: rgba(255,255,255,.052) !important;
      border-color: rgba(255,255,255,.25) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 10px 24px rgba(18,42,62,.028) !important;
    }

    textarea:focus,
    select:focus {
      background: rgba(255,255,255,.09) !important;
      border-color: rgba(183,210,232,.46) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 4px rgba(190,220,238,.10), 0 14px 34px rgba(21,42,58,.04) !important;
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
      background: rgba(255,255,255,.055) !important;
      border-color: rgba(255,255,255,.28) !important;
    }

    .choice.is-active,
    .segment.is-active,
    .mood-filter.is-active,
    .mood-pill.is-active {
      background: linear-gradient(135deg, rgba(177,211,237,.20), rgba(199,184,238,.13), rgba(255,230,164,.12)) !important;
      border-color: rgba(255,255,255,.46) !important;
    }

    .primary-btn,
    .secondary-btn,
    .cosmic-btn.primary {
      background: linear-gradient(135deg, #5d82a0, #8179b9) !important;
      box-shadow: 0 12px 28px rgba(45,76,105,.16) !important;
    }

    .calendar-wrap::after { opacity: .36 !important; }
    .reader-body,
    .whisper-panel,
    .reader-panel { background: linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.045)) !important; }
    .reader-body { border-color: rgba(255,255,255,.30) !important; }
  `;
  document.head.appendChild(style);
}

applyClarityPolish();
