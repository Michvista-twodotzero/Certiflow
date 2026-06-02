<script lang="ts">
  export let loggedIn = false
</script>

<section class="cta" id="pricing">
  <div class="inner">
    <h2>Ready to upgrade your safety<br />culture?</h2>
    <p>
      Join 140+ industry leaders who are using CertiFlow to automate their compliance and protect their workers.
    </p>

    <div class="actions">
      {#if loggedIn}
        <a class="button dark" href="/dashboard">Open Dashboard</a>
      {:else}
        <a class="button dark" href="/auth">Join CertiFlow Today</a>
      {/if}
      <a class="button light" href="#features">Schedule a Demo</a>
    </div>
  </div>
</section>

<style>
  .cta {
    width: min(1200px, calc(100% - 4rem));
    margin: 3rem auto 0;
    padding: 0;
  }

  .inner {
    position: relative;
    overflow: hidden;
    padding: 3.5rem 2rem;
    text-align: center;
    border-radius: 0.75rem;
    background:
      radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.12), transparent 18%),
      radial-gradient(circle at 80% 45%, rgba(255, 255, 255, 0.08), transparent 16%),
      linear-gradient(180deg, #f8a80d 0%, #ef9900 100%);
    color: #2a1700;
    box-shadow: 0 30px 70px rgba(255, 153, 0, 0.14);
  }

  h2 {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    line-height: 1.15;
    letter-spacing: -0.04em;
    color: #1a0e00;
  }

  p {
    margin: 1rem auto 0;
    max-width: 38rem;
    color: rgba(42, 23, 0, 0.72);
    line-height: 1.65;
    font-size: 0.95rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    justify-content: center;
    margin-top: 1.8rem;
  }

  .button {
    padding: 0.82rem 1.3rem;
    border-radius: 0.3rem;
    font-weight: 700;
    font-size: 0.9rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .button:hover {
    transform: translateY(-1px);
  }

  .dark {
    background: #0d1223;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .dark:hover {
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.3);
  }

  .light {
    background: rgba(255, 255, 255, 0.22);
    color: #2a1700;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 600px) {
    .inner {
      padding: 2.5rem 1.5rem;
    }
  }
</style>
