<script lang="ts">
  import Icon from '$lib/components/Icon.svelte'
</script>

<section class="section">
  <h2>Safety Infrastructure, Digitized</h2>

  <div class="grid">
    <!-- Row 1: Main feature card (large) + Side card -->
    <article class="card card-main">
      <div class="card-main-inner">
        <div class="card-main-text">
          <p class="eyebrow">Core Engine</p>
          <h3>Automated OSHA Referencing</h3>
          <p class="desc">
            No more manual rule checking. Our system is pre-loaded with every current OSHA sub part, ensuring full compliance across all construction disciplines.
          </p>
          <div class="chip">
            <span class="chip-dot"></span>
            Rule 1926.501(b)(1) - Verified Compliance
          </div>
        </div>
        <div class="card-main-img">
          <img src="/feature-construction.png" alt="Construction site inspection" />
        </div>
      </div>
    </article>

    <article class="card card-side">
      <div class="icon-box danger">
        <Icon name="alert" size={28} />
      </div>
      <h3>Real-time Risk Detection</h3>
      <p class="desc">
        Spot critical safety hazards—like missing toe boards or unsecured scaffolding—before they become costly incidents.
      </p>
    </article>

    <!-- Row 2: Two smaller cards -->
    <article class="card card-bottom">
      <div class="icon-box accent">
        <Icon name="projects" size={24} />
      </div>
      <h3>Seamless Team Collaboration</h3>
      <p class="desc">
        Assign fixes to site managers directly. Automated notifications keep everyone in the loop until the hazard is cleared.
      </p>
    </article>

    <article class="card card-bottom">
      <div class="icon-box info">
        <Icon name="dashboard" size={24} />
      </div>
      <h3>Comprehensive Site Mapping</h3>
      <p class="desc">
        Integrate drone telemetry to create 3D safety heatmaps of your entire job site.
      </p>
    </article>
  </div>
</section>

<style>
  .section {
    width: min(1200px, calc(100% - 4rem));
    margin: 0 auto;
    padding: 3.5rem 0 0;
  }

  h2 {
    margin: 0 0 1.5rem;
    text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.7rem, 3vw, 2.3rem);
    letter-spacing: -0.04em;
    color: #fff;
  }

  .grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 1.25rem;
  }

  .card {
    position: relative;
    background: rgba(14, 19, 32, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 0.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transition: border-color 0.3s ease, transform 0.3s ease;
  }

  .card:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }

  /* Main feature card */
  .card-main {
    grid-row: span 1;
    padding: 0;
  }

  .card-main-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
  }

  .card-main-text {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-main-img {
    position: relative;
    overflow: hidden;
  }

  .card-main-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .card-main-img::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(14, 19, 32, 0.3), transparent);
  }

  /* Side card */
  .card-side {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Bottom cards */
  .card-bottom {
    padding: 1.5rem;
  }

  .eyebrow {
    margin: 0 0 0.35rem;
    color: #f7b24f;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    font-weight: 700;
  }

  .card h3 {
    margin: 0 0 0.5rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    color: #fff;
    font-weight: 600;
  }

  .desc {
    margin: 0;
    color: rgba(229, 235, 246, 0.62);
    line-height: 1.6;
    font-size: 0.9rem;
  }

  .icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 0.45rem;
    margin-bottom: 1rem;
  }

  .icon-box.danger {
    background: rgba(255, 69, 58, 0.12);
    color: #ff453a;
  }

  .icon-box.accent {
    background: rgba(255, 159, 10, 0.12);
    color: #ff9f0a;
  }

  .icon-box.info {
    background: rgba(100, 210, 255, 0.12);
    color: #64d2ff;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: 1rem;
    padding: 0.4rem 0.7rem;
    border-radius: 999px;
    border: 1px solid rgba(48, 209, 88, 0.25);
    color: #30d158;
    background: rgba(48, 209, 88, 0.06);
    font-size: 0.72rem;
    font-weight: 500;
  }

  .chip-dot {
    width: 0.35rem;
    height: 0.35rem;
    border-radius: 999px;
    background: #30d158;
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .card-main-inner {
      grid-template-columns: 1fr;
    }

    .card-main-img {
      height: 14rem;
    }
  }
</style>
