<script lang="ts">
  import HeatmapVisual from './HeatmapVisual.svelte'
  export let loggedIn = false
</script>

<section class="hero" id="features">
  <div class="backdrop" aria-hidden="true">
    <img
      alt=""
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6Hyd5znxucS125gcRHZd9pXMxoJXAqU9tGKXWRNjVpzBC16-Meq5g1JEweSsF-6S33RNDpIinKMgrwtXJvJKDu3NuZCkwbjwfIxiIPbmTzFPowDeL2kFTW7VOY-5tRAcTqyxODv6bGA0UwJY5AEiGriLsNZc4eaQP6tbNWwht66wszW1Tuqc3HDW2GGi0UgGrNP2YfqCl-cOHEqgKse1xEOIBpHtZDuK_9CoUXDviLYTEUatyEP5Wgb5lgp46Uiki8is6vLZKOxg"
    />
    <div class="overlay"></div>
  </div>

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

  <div class="visual-wrap" aria-hidden="true">
    <HeatmapVisual />
  </div>
</section>

<style>
  .hero {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(24rem, 34rem);
    align-items: center;
    gap: 2rem;
    min-height: calc(100vh - 4.8rem);
    padding: 3.2rem 1.2rem 2rem;
    overflow: hidden;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.42;
  }

  .backdrop img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(9, 13, 25, 0.94) 0%, rgba(9, 13, 25, 0.72) 45%, rgba(9, 13, 25, 0.12) 100%);
  }

  .content,
  .visual-wrap {
    position: relative;
    z-index: 1;
  }

  .content {
    max-width: 44rem;
    padding-left: 0.1rem;
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

  .visual-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1400px;
  }

  @media (max-width: 1080px) {
    .hero {
      grid-template-columns: 1fr;
      min-height: auto;
      padding-top: 2rem;
    }

    .visual-wrap {
      order: -1;
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
