<script lang="ts">
  import LandingVisual from '$lib/components/landing/LandingVisual.svelte'

  export let loggedIn = false
</script>

<section class="hero" id="features">
  <div class="layout">
    <div class="content">
      <div class="pill">
        <span class="dot"></span>
        <span>AI systems online</span>
      </div>

      <h1>Automate Your Site <br /><span>Safety Compliance</span></h1>

      <p>
        AI-driven audit analysis that reviews site photos and reports, extracts text when needed, and flags likely OSHA violations in seconds.
      </p>

      <div class="actions">
        <a class="button primary" href="/auth">Get Started Free</a>
        <a class="button secondary" href="#how-it-works">View Demo</a>
        {#if loggedIn}
          <a class="button tertiary" href="/dashboard">Open Dashboard</a>
        {/if}
      </div>
    </div>

    <div class="visual" aria-hidden="true">
      <LandingVisual />
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: calc(100vh - 4.8rem);
    padding: 3.2rem 1.2rem 2rem;
    overflow: hidden;
  }

  .layout {
    width: min(1200px, 100%);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
    gap: 2rem;
    align-items: center;
  }

  .content {
    position: relative;
    max-width: 44rem;
    padding-left: 0.1rem;
  }

  .visual {
    justify-self: end;
    width: min(100%, 42rem);
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.34rem 0.55rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
    font-size: 0.73rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.82);
  }

  .dot {
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 999px;
    background: #ff9f0a;
    box-shadow: 0 0 0 4px rgba(255, 159, 10, 0.16);
  }

  h1 {
    margin: 1rem 0 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.8rem, 6vw, 4.9rem);
    line-height: 0.94;
    letter-spacing: -0.06em;
    font-weight: 700;
    max-width: 10ch;
  }

  h1 span {
    color: #f8b34f;
  }

  p {
    margin: 1.15rem 0 0;
    max-width: 34rem;
    color: rgba(229, 235, 246, 0.76);
    font-size: 1.02rem;
    line-height: 1.72;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    margin-top: 1.8rem;
  }

  .button {
    padding: 0.86rem 1.1rem;
    border-radius: 0.25rem;
    font-weight: 700;
    font-size: 0.94rem;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease,
      border-color 0.2s ease;
  }

  .button:hover {
    transform: translateY(-1px);
  }

  .primary {
    background: linear-gradient(180deg, #ffad2f 0%, #ff9f0a 100%);
    color: #140d00;
  }

  .secondary,
  .tertiary {
    border: 1px solid rgba(255, 255, 255, 0.22);
    color: #eef1f7;
    background: rgba(255, 255, 255, 0.02);
  }

  @media (max-width: 1080px) {
    .hero {
      min-height: auto;
      padding-top: 2rem;
    }

    .layout {
      grid-template-columns: 1fr;
    }

    .visual {
      justify-self: stretch;
      width: 100%;
      margin-top: 0.5rem;
    }
  }

  @media (max-width: 760px) {
    .hero {
      padding: 1.6rem 1rem 1rem;
    }

    h1 {
      max-width: none;
      font-size: clamp(2.5rem, 12vw, 4rem);
    }
  }
</style>
