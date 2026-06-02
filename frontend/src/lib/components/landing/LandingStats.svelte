<section class="stats">
  <div class="stat">
    <span class="number">140+</span>
    <strong class="label">Projects Trusted</strong>
  </div>
  <div class="stat">
    <span class="number">46,000+</span>
    <strong class="label">Violations Resolved</strong>
  </div>
  <div class="stat">
    <span class="number">98.8%</span>
    <strong class="label">AI Accuracy Rate</strong>
  </div>
  <div class="stat">
    <span class="number">24/7</span>
    <strong class="label">Real-Time Monitoring</strong>
  </div>
</section>

<style>
  .stats {
    width: min(1200px, calc(100% - 4rem));
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    padding: 1.4rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .stat {
    text-align: center;
    padding: 0.5rem 0;
    position: relative;
  }

  .stat:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    bottom: 15%;
    width: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  .number {
    display: block;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.3rem, 2.2vw, 1.8rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .label {
    display: block;
    margin-top: 0.3rem;
    color: rgba(236, 241, 248, 0.55);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
  }

  @media (max-width: 760px) {
    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem 0;
    }

    .stat:nth-child(2)::after {
      display: none;
    }
  }
</style>
