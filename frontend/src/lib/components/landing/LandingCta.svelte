<script lang="ts">
  export let loggedIn = false
</script>

<section class="cta" id="pricing">
  <div class="inner">
    <h2>Ready to upgrade your safety culture?</h2>
    <p>
      Join teams using CertiFlow to automate report review, track violations, and keep follow-up moving.
    </p>

    <div class="actions">
      {#if loggedIn}
        <a class="button dark" href="/dashboard">Open Dashboard</a>
      {:else}
        <a class="button dark" href="/auth">Join CertiFlow Today</a>
      {/if}
      <a class="button light" href="#features">Review Features</a>
    </div>
  </div>
</section>

<style>
  .cta {
    width: min(1200px, calc(100% - 2rem));
    margin: 2.4rem auto 0;
    padding: 0;
  }

  .inner {
    position: relative;
    overflow: hidden;
    padding: 2.6rem 1.1rem;
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
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.08;
    letter-spacing: -0.04em;
  }

  p {
    margin: 0.9rem auto 0;
    max-width: 42rem;
    color: rgba(42, 23, 0, 0.82);
    line-height: 1.65;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .button {
    padding: 0.86rem 1.1rem;
    border-radius: 0.25rem;
    font-weight: 700;
    font-size: 0.94rem;
    transition: transform 0.2s ease;
  }

  .button:hover {
    transform: translateY(-1px);
  }

  .dark {
    background: #0d1223;
    color: #fff;
  }

  .light {
    background: rgba(255, 255, 255, 0.16);
    color: #2a1700;
  }
</style>
