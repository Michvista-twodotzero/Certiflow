<script lang="ts">
  export let loggedIn = false
</script>

<section class="hero" id="features">
  <img src="/hero-bg.png" alt="" class="hero-bg" />
  <div class="hero-overlay"></div>

  <div class="content">
    <div class="pill">
      <span class="dot"></span>
      <span>AI systems online</span>
    </div>

    <h1>Automate Your Site <br /><span>Safety Compliance</span></h1>

    <p>
      AI-driven audit analysis that identifies OSHA violations in seconds, not days. Ensure every beam, bolt, and harness meets industrial standards with computer vision.
    </p>

    <div class="actions">
      <a class="button primary" href="/auth">Get Started Free</a>
      <a class="button secondary" href="#how-it-works">View Demo</a>
      {#if loggedIn}
        <a class="button secondary" href="/dashboard">Open Dashboard</a>
      {/if}
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 82vh;
    display: flex;
    align-items: flex-end;
    padding: 0 2rem 4rem;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    z-index: 0;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(to top, rgba(6, 9, 19, 0.95) 0%, rgba(6, 9, 19, 0.7) 30%, rgba(6, 9, 19, 0.25) 60%, rgba(6, 9, 19, 0.1) 100%);
  }

  .content {
    position: relative;
    z-index: 2;
    max-width: 38rem;
    padding-left: 1rem;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.3rem 0.65rem;
    border: 1px solid rgba(48, 209, 88, 0.35);
    background: rgba(48, 209, 88, 0.08);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #30d158;
    border-radius: 0.2rem;
    margin-bottom: 1rem;
  }

  .dot {
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 999px;
    background: #30d158;
    box-shadow: 0 0 0 3px rgba(48, 209, 88, 0.2);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 3px rgba(48, 209, 88, 0.2); }
    50% { box-shadow: 0 0 0 6px rgba(48, 209, 88, 0.1); }
  }

  h1 {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.6rem, 5.5vw, 4.2rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
    font-weight: 700;
    color: #fff;
  }

  h1 span {
    color: #f8b34f;
  }

  p {
    margin: 1.2rem 0 0;
    max-width: 32rem;
    color: rgba(229, 235, 246, 0.72);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    margin-top: 1.8rem;
  }

  .button {
    padding: 0.82rem 1.3rem;
    border-radius: 0.3rem;
    font-weight: 700;
    font-size: 0.9rem;
    transition: transform 0.2s ease, opacity 0.2s ease, border-color 0.2s ease;
  }

  .button:hover {
    transform: translateY(-1px);
  }

  .primary {
    background: linear-gradient(180deg, #ffad2f 0%, #ff9f0a 100%);
    color: #140d00;
  }

  .secondary {
    border: 1.5px solid rgba(255, 255, 255, 0.28);
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(6px);
  }

  @media (max-width: 768px) {
    .hero {
      min-height: 70vh;
      padding: 0 1rem 3rem;
    }

    .content {
      padding-left: 0;
    }

    h1 {
      font-size: clamp(2rem, 10vw, 3.2rem);
    }
  }
</style>
