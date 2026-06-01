<script lang="ts">
  import Icon from '$lib/components/Icon.svelte'
</script>

<section class="section" id="features">
  <h2>Safety Infrastructure, Digitized</h2>

  <div class="grid">
    <article class="card wide">
      <div class="copy">
        <p class="eyebrow">Core engine</p>
        <h3>Automated OSHA Referencing</h3>
        <p>
          CertiFlow reviews construction photos and reports, extracts text with OCR or native parsing, and surfaces likely violations with action-oriented summaries.
        </p>
        <div class="chip">Scan, flag, and stay in sync</div>
      </div>
    </article>

    <article class="card">
      <Icon name="alert" size={34} />
      <h3>Real-time Risk Detection</h3>
      <p>
        Spot hazards early, then use the dashboard to track status, severity, and follow-up.
      </p>
    </article>

    <article class="card">
      <Icon name="projects" size={34} />
      <h3>Seamless Team Collaboration</h3>
      <p>
        Share projects, reports, and violations in one workflow so managers and reviewers stay aligned.
      </p>
    </article>

    <article class="card">
      <Icon name="dashboard" size={34} />
      <h3>Project &amp; Report Overview</h3>
      <p>
        See recent audits, unresolved items, and completion status without bouncing between tools.
      </p>
    </article>
  </div>
</section>

<style>
  .section {
    width: min(1200px, calc(100% - 2rem));
    margin: 0 auto;
    padding: 2.5rem 0 0;
  }

  h2 {
    margin: 0 0 1.1rem;
    text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.7rem, 3vw, 2.3rem);
    letter-spacing: -0.04em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 1rem;
  }

  .card {
    position: relative;
    padding: 1.15rem;
    background: rgba(18, 24, 39, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
    overflow: hidden;
    min-height: 14rem;
  }

  .card:not(.wide) {
    grid-column: span 4;
  }

  .card h3 {
    margin: 0.8rem 0 0.4rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.05rem;
  }

  .card p {
    margin: 0;
    color: rgba(229, 235, 246, 0.73);
    line-height: 1.6;
    font-size: 0.94rem;
  }

  .card :global(svg) {
    color: #f8b34f;
  }

  .wide {
    grid-column: 1 / -1;
  }

  .copy {
    position: relative;
    z-index: 1;
  }

  .eyebrow {
    margin: 0 0 0.35rem;
    color: #f7b24f;
    text-transform: uppercase;
    font-size: 0.74rem;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .chip {
    display: inline-flex;
    margin-top: 0.95rem;
    padding: 0.45rem 0.7rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    background: rgba(255, 255, 255, 0.03);
    font-size: 0.8rem;
  }

  @media (max-width: 940px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .card:not(.wide) {
      grid-column: auto;
    }
  }
</style>
