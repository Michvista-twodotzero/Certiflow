<section class="stats">
  <div><span>AI audits</span><strong>Report and photo review</strong></div>
  <div><span>OCR</span><strong>Native text + fallback extraction</strong></div>
  <div><span>Violations</span><strong>Tracked and resolved</strong></div>
  <div><span>Live</span><strong>Status updates and alerts</strong></div>
</section>

<style>
  .stats {
    width: min(1200px, calc(100% - 2rem));
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    padding: 0.85rem 0 0.95rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(6, 10, 18, 0.18);
  }

  .stats div {
    padding: 0.3rem 0;
  }

  .stats span {
    display: block;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1rem, 1.7vw, 1.45rem);
    font-weight: 700;
  }

  .stats strong {
    display: block;
    margin-top: 0.15rem;
    color: rgba(236, 241, 248, 0.7);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @media (max-width: 760px) {
    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
