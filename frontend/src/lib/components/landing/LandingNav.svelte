<script lang="ts">
  export let loggedIn = false
</script>

<nav class="nav">
  <a class="brand" href="/" aria-label="CertiFlow home">
    <img src="/certiflow.png" alt="" />
    <span>CertiFlow</span>
  </a>

  <div class="links" aria-label="Primary">
    <a href="#features">Features</a>
    <a href="#how-it-works">How it Works</a>
    <a href="#pricing">Pricing</a>
    <a href="/auth">Log In</a>
  </div>

  <div class="actions">
    <a class="action secondary" href="/auth">Get Started</a>
    {#if loggedIn}
      <a class="action primary" href="/dashboard">Open Dashboard</a>
    {/if}
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1.2rem;
    background: rgba(9, 13, 25, 0.82);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    color: #f9c46b;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .brand img {
    width: 1.45rem;
    height: 1.45rem;
    object-fit: contain;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: rgba(240, 244, 250, 0.78);
    font-size: 0.95rem;
  }

  .links a:hover {
    color: #fff;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .action {
    border-radius: 0.25rem;
    padding: 0.62rem 0.95rem;
    font-weight: 700;
    font-size: 0.92rem;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease,
      background-color 0.2s ease;
  }

  .action:hover {
    transform: translateY(-1px);
  }

  .action.secondary {
    color: #fff;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.14);
  }

  .action.primary {
    background: linear-gradient(180deg, #ffad2f 0%, #ff9f0a 100%);
    color: #140d00;
  }

  @media (max-width: 860px) {
    .nav {
      flex-wrap: wrap;
      justify-content: center;
    }

    .links {
      order: 3;
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
</style>
