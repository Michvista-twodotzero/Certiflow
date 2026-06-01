<script lang="ts">
  import { authSession } from '$lib/auth'
  import Icon from '$lib/components/Icon.svelte'

  const metrics = [
    { value: 'AI audits', label: 'Upload reports and photos for guided safety review.' },
    { value: 'OSHA-focused', label: 'Built around construction hazards, violations, and corrective actions.' },
    { value: 'Fast follow-up', label: 'Track reports, notify users, and keep the workflow moving.' },
    { value: 'Live updates', label: 'Status changes and notifications stay visible in the app.' },
  ]

  const steps = [
    {
      icon: 'upload',
      title: '1. Upload Reports',
      body: 'Send in site photos, PDFs, and inspection files for analysis.',
    },
    {
      icon: 'shield',
      title: '2. AI Audit',
      body: 'CertiFlow reviews the material, extracts text when needed, and flags safety issues.',
    },
    {
      icon: 'violations',
      title: '3. Resolve Risks',
      body: 'Review violations, update status, and notify the right people to fix them.',
    },
  ]

  const capabilities = [
    {
      title: 'Core engine',
      eyebrow: 'Automated OSHA screening',
      body: 'AI-assisted reviews help teams spot hazards in construction reports and images faster.',
      highlight: 'Rule-aware review',
    },
    {
      title: 'Real-time updates',
      eyebrow: 'Project status visibility',
      body: 'Reports move through the queue, notifications update the UI, and users can track progress.',
      highlight: 'Live dashboard',
    },
    {
      title: 'Team collaboration',
      eyebrow: 'Shared compliance workflow',
      body: 'Projects, reports, and violations can be reviewed from one system instead of scattered tools.',
      highlight: 'Shared workspace',
    },
    {
      title: 'Operations view',
      eyebrow: 'Actionable summaries',
      body: 'Violation severity, report status, and resolution history make follow-up easier.',
      highlight: 'Response ready',
    },
  ]

  $: primaryCtaHref = $authSession ? '/dashboard' : '/auth'
  $: primaryCtaLabel = $authSession ? 'Open Dashboard' : 'Get Started Free'
</script>

<svelte:head>
  <title>CertiFlow | Automate Your Site Safety Compliance</title>
  <meta
    name="description"
    content="CertiFlow uses AI to audit construction reports and photos, flag OSHA-style risks, and help teams resolve safety issues faster."
  />
</svelte:head>

<section class="landing-shell">
  <div class="nav-bar">
    <a class="brand-mark" href="/" aria-label="CertiFlow home">
      <img src="/certiflow.png" alt="CertiFlow" />
      <span>CertiFlow</span>
    </a>

    <nav class="nav-links" aria-label="Primary">
      <a href="#features">Features</a>
      <a href="#how-it-works">How it Works</a>
      <a href="#pricing">Pricing</a>
      <a href="/auth">Log In</a>
    </nav>

    <a class="nav-cta" href={primaryCtaHref}>{primaryCtaLabel}</a>
  </div>

  <section class="hero" id="features">
    <div class="hero-copy">
      <div class="eyebrow-pill">
        <span class="dot"></span>
        <span>AI safety intelligence</span>
      </div>
      <h1>Automate Your Site<br /><span>Safety Compliance</span></h1>
      <p class="hero-subtitle">
        CertiFlow reviews construction reports and site photos with AI, flags violations, and helps teams move faster from upload to resolution.
      </p>

      <div class="hero-actions">
        <a class="primary-button hero-button" href={primaryCtaHref}>{primaryCtaLabel}</a>
        <a class="ghost-button hero-button secondary" href="#how-it-works">View Demo</a>
      </div>

      <div class="metric-strip">
        {#each metrics as metric}
          <article>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        {/each}
      </div>
    </div>

    <div class="hero-visual" aria-hidden="true">
      <div class="hero-scene heatmap-scene">
        <div class="scene-glow scene-glow-left"></div>
        <div class="scene-glow scene-glow-right"></div>
        <div class="heatmap-grid"></div>
        <div class="heatmap-plane"></div>
        <div class="heatmap-slab slab-back"></div>
        <div class="heatmap-slab slab-front"></div>
        <div class="heat-spot hot-1"></div>
        <div class="heat-spot hot-2"></div>
        <div class="heat-spot hot-3"></div>
        <div class="heat-spot hot-4"></div>
        <div class="scan-line"></div>
        <div class="scene-card floating-card card-1">
          <span class="card-kicker">Live risk map</span>
          <strong>3D safety heatmap</strong>
          <span>Hot zones and priority hazards highlighted</span>
        </div>
        <div class="scene-card floating-card card-2">
          <span class="card-kicker">OSHA focus</span>
          <strong>Structured review</strong>
          <span>Confidence bands and safe areas stay visible</span>
        </div>
      </div>
    </div>
  </section>

  <section class="stats-bar" aria-label="Key benefits">
    <div><span>24/7</span><strong>Real-time monitoring</strong></div>
    <div><span>AI</span><strong>Report analysis</strong></div>
    <div><span>Projects</span><strong>Tracked in one place</strong></div>
    <div><span>Alerts</span><strong>Sent to the right team</strong></div>
  </section>

  <section class="works" id="how-it-works">
    <div class="section-heading">
      <p>How it Works</p>
      <h2>From upload to resolution in a few clear steps</h2>
    </div>

    <div class="steps-grid">
      {#each steps as step}
        <article class="step-card">
          <div class="step-icon"><Icon name={step.icon} size={20} /></div>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="capabilities">
    <div class="section-heading center">
      <p>Safety Infrastructure, Digitized</p>
      <h2>Everything the product actually does, mapped to the workflow</h2>
    </div>

    <div class="capability-grid">
      <article class="capability-card wide">
        <div class="capability-copy">
          <p class="eyebrow-text">Core engine</p>
          <h3>Automated OSHA-aware review</h3>
          <p>
            CertiFlow analyses construction photos and reports, extracts text from files, and uses AI to surface likely violations and suggestions.
          </p>
          <div class="mini-badge">Rule-aware compliance checks</div>
        </div>
        <div class="capability-illustration">
          <div class="blueprint-grid"></div>
          <div class="heatmap-plane heatmap-plane-card"></div>
          <div class="heatmap-slab slab-back slab-back-card"></div>
          <div class="heat-spot hot-card hot-card-1"></div>
          <div class="heat-spot hot-card hot-card-2"></div>
          <div class="heat-spot hot-card hot-card-3"></div>
          <div class="heatmap-legend">
            <span>Risk density</span>
            <div class="legend-bar"></div>
          </div>
        </div>
      </article>

      <article class="capability-card">
        <p class="eyebrow-text">Real-time status</p>
        <h3>Track progress without hunting through tabs</h3>
        <p>Reports move through the queue, notifications update the UI, and the dashboard shows what needs attention now.</p>
      </article>

      <article class="capability-card">
        <p class="eyebrow-text">Collaboration</p>
        <h3>Project, report, and violation views stay connected</h3>
        <p>Teams can open a project, inspect reports, and follow issue severity without losing context.</p>
      </article>

      <article class="capability-card">
        <p class="eyebrow-text">Operations</p>
        <h3>Clear follow-up and resolution paths</h3>
        <p>Statuses, summaries, and violation lists are built for action, not just storage.</p>
      </article>
    </div>
  </section>

  <section class="pricing-cta" id="pricing">
    <div class="pricing-copy">
      <h2>Ready to upgrade your safety culture?</h2>
      <p>
        Start with the free workflow, then move straight into automated report review, violation tracking, and team follow-up.
      </p>
      <div class="hero-actions center">
        <a class="primary-button hero-button dark" href={primaryCtaHref}>{#if $authSession}Open Dashboard{:else}Join CertiFlow Today{/if}</a>
        <a class="ghost-button hero-button light" href="#features">Review Features</a>
      </div>
    </div>
  </section>

  <footer class="landing-footer">
    <div class="footer-brand">
      <img src="/certiflow.png" alt="" />
      <div>
        <strong>CertiFlow</strong>
        <span>Digital site safety compliance</span>
      </div>
    </div>

    <div class="footer-links">
      <a href="/auth">Privacy Policy</a>
      <a href="/auth">Terms of Service</a>
      <a href="/auth">Contact Support</a>
      <a href="/auth">Documentation</a>
    </div>
  </footer>
</section>

<style>
  :global(body) {
    background:
      radial-gradient(circle at top left, rgba(255, 159, 10, 0.08), transparent 28%),
      radial-gradient(circle at 80% 15%, rgba(100, 210, 255, 0.07), transparent 20%),
      linear-gradient(180deg, #070b16 0%, #090d19 100%);
  }

  .landing-shell {
    min-height: 100vh;
    color: #eef1f7;
    overflow-x: hidden;
    background:
      radial-gradient(circle at top left, rgba(255, 159, 10, 0.09), transparent 28%),
      radial-gradient(circle at 85% 18%, rgba(100, 210, 255, 0.08), transparent 22%),
      linear-gradient(180deg, #070b16 0%, #090d19 100%);
  }

  .nav-bar,
  .hero,
  .stats-bar,
  .works,
  .capabilities,
  .pricing-cta,
  .landing-footer {
    width: min(1200px, calc(100% - 2rem));
    margin: 0 auto;
  }

  .nav-bar {
    height: 4.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .brand-mark {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    color: #f9c46b;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  .brand-mark img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    color: rgba(240, 244, 250, 0.82);
    font-size: 0.92rem;
  }

  .nav-links a {
    position: relative;
  }

  .nav-links a:hover {
    color: #fff;
  }

  .nav-cta {
    background: linear-gradient(180deg, #ffad2f 0%, #ff9f0a 100%);
    color: #140d00;
    font-weight: 800;
    padding: 0.65rem 1rem;
    border-radius: 0.25rem;
    box-shadow: 0 10px 25px rgba(255, 159, 10, 0.16);
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(27rem, 36rem);
    gap: 2rem;
    align-items: center;
    padding: 3.5rem 0 2rem;
    min-height: calc(100vh - 4.25rem);
  }

  .hero-copy {
    max-width: 40rem;
  }

  .eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.35rem 0.55rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.82);
    background: rgba(255, 255, 255, 0.03);
    font-size: 0.74rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 1.2rem;
  }

  .dot {
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 999px;
    background: #ff9f0a;
    box-shadow: 0 0 0 4px rgba(255, 159, 10, 0.16);
  }

  h1 {
    margin: 0;
    font-size: clamp(3rem, 6vw, 5.1rem);
    line-height: 0.94;
    letter-spacing: -0.06em;
    font-weight: 800;
    max-width: 10ch;
  }

  h1 span {
    color: #f8b34f;
  }

  .hero-subtitle {
    margin: 1.25rem 0 0;
    max-width: 34rem;
    color: rgba(229, 235, 246, 0.75);
    font-size: 1.02rem;
    line-height: 1.7;
  }

  .hero-actions {
    display: flex;
    gap: 0.8rem;
    margin-top: 1.8rem;
    flex-wrap: wrap;
  }

  .hero-actions.center {
    justify-content: center;
  }

  .hero-button {
    min-width: 11.5rem;
    justify-content: center;
  }

  .hero-button.secondary {
    border-color: rgba(255, 255, 255, 0.24);
    color: #eef1f7;
    background: rgba(255, 255, 255, 0.02);
  }

  .hero-button.dark {
    background: #0d1223;
    color: #fff;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
  }

  .hero-button.light {
    border-color: rgba(13, 18, 35, 0.35);
    color: #2b1700;
    background: rgba(255, 255, 255, 0.16);
  }

  .metric-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    margin-top: 2.6rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .metric-strip article {
    padding: 1rem 0.35rem 1rem 0;
    min-height: 4rem;
  }

  .metric-strip strong {
    display: block;
    font-size: 0.95rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #fff;
  }

  .metric-strip span {
    display: block;
    margin-top: 0.25rem;
    color: rgba(236, 241, 248, 0.7);
    font-size: 0.8rem;
    line-height: 1.45;
  }

  .hero-visual {
    min-height: 36rem;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1400px;
  }

  .hero-scene {
    position: relative;
    width: min(100%, 34rem);
    height: 34rem;
    border-radius: 1.25rem;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(8, 12, 25, 0.12) 0%, rgba(8, 12, 25, 0.62) 100%),
      radial-gradient(circle at 78% 30%, rgba(67, 120, 204, 0.22), transparent 30%),
      radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.42), transparent 35%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.42);
    transform: rotateY(-18deg) rotateX(8deg);
    transform-style: preserve-3d;
  }

  .hero-scene::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(120deg, rgba(255, 159, 10, 0.06) 0%, transparent 35%),
      linear-gradient(180deg, transparent 0 60%, rgba(0, 0, 0, 0.45) 100%);
    pointer-events: none;
  }

  .scene-glow,
  .heatmap-grid,
  .heatmap-plane,
  .heatmap-slab,
  .heat-spot,
  .scan-line,
  .heatmap-legend,
  .scene-card {
    position: absolute;
  }

  .scene-glow {
    border-radius: 999px;
    filter: blur(30px);
    opacity: 0.8;
  }

  .scene-glow-left {
    width: 16rem;
    height: 16rem;
    left: -4rem;
    top: 8rem;
    background: rgba(255, 159, 10, 0.14);
  }

  .scene-glow-right {
    width: 15rem;
    height: 15rem;
    right: -3rem;
    top: 4rem;
    background: rgba(100, 210, 255, 0.1);
  }

  .heatmap-scene {
    background:
      linear-gradient(180deg, rgba(8, 12, 25, 0.08) 0%, rgba(8, 12, 25, 0.6) 100%),
      radial-gradient(circle at 25% 25%, rgba(255, 159, 10, 0.16), transparent 18%),
      radial-gradient(circle at 68% 34%, rgba(100, 210, 255, 0.2), transparent 22%),
      linear-gradient(145deg, #11182b 0%, #080c16 58%, #05070e 100%);
  }

  .heatmap-grid,
  .heatmap-plane,
  .heatmap-slab,
  .heat-spot,
  .scan-line,
  .heatmap-legend {
    position: absolute;
  }

  .heatmap-grid {
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 3rem 3rem;
    opacity: 0.5;
    transform: perspective(700px) rotateX(68deg) translateY(5rem);
    transform-origin: center bottom;
  }

  .heatmap-plane {
    left: 10%;
    right: 8%;
    bottom: 18%;
    height: 38%;
    border-radius: 1rem;
    background:
      radial-gradient(circle at 18% 72%, rgba(255, 164, 38, 0.34), transparent 16%),
      radial-gradient(circle at 60% 40%, rgba(100, 210, 255, 0.22), transparent 20%),
      radial-gradient(circle at 76% 58%, rgba(255, 69, 58, 0.26), transparent 16%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.03),
      0 18px 36px rgba(0, 0, 0, 0.35);
    transform: perspective(900px) rotateX(72deg) rotateZ(-12deg);
    transform-origin: center center;
  }

  .heatmap-slab {
    background: rgba(10, 14, 26, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.22);
    transform: perspective(900px) rotateX(68deg) rotateZ(-12deg);
    transform-origin: center center;
  }

  .slab-back {
    left: 12%;
    top: 20%;
    width: 54%;
    height: 18%;
    opacity: 0.55;
  }

  .slab-front {
    right: 11%;
    bottom: 13%;
    width: 42%;
    height: 16%;
    opacity: 0.68;
  }

  .heat-spot {
    width: 6.25rem;
    height: 6.25rem;
    border-radius: 999px;
    filter: blur(4px);
    transform: translateZ(20px);
  }

  .heat-spot::before {
    content: '';
    position: absolute;
    inset: 20%;
    border-radius: inherit;
    background: inherit;
    filter: blur(18px);
    opacity: 0.7;
  }

  .hot-1 {
    left: 18%;
    top: 35%;
    background: radial-gradient(circle, rgba(255, 182, 63, 0.9) 0%, rgba(255, 159, 10, 0.18) 52%, transparent 74%);
  }

  .hot-2 {
    left: 43%;
    top: 26%;
    width: 5.25rem;
    height: 5.25rem;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(100, 210, 255, 0.32) 42%, transparent 70%);
  }

  .hot-3 {
    right: 16%;
    top: 30%;
    background: radial-gradient(circle, rgba(255, 93, 93, 0.9) 0%, rgba(255, 69, 58, 0.24) 50%, transparent 72%);
  }

  .hot-4 {
    right: 26%;
    bottom: 22%;
    width: 7rem;
    height: 7rem;
    background: radial-gradient(circle, rgba(255, 159, 10, 0.92) 0%, rgba(255, 159, 10, 0.2) 38%, transparent 74%);
  }

  .scan-line {
    left: 12%;
    right: 12%;
    top: 55%;
    height: 0.18rem;
    background: linear-gradient(90deg, transparent 0%, rgba(100, 210, 255, 0.78) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 159, 10, 0.72) 80%, transparent 100%);
    box-shadow: 0 0 24px rgba(100, 210, 255, 0.35);
    transform: rotate(-8deg);
    animation: scan 4.5s ease-in-out infinite;
  }

  .heatmap-legend {
    left: 1rem;
    bottom: 1rem;
    display: inline-flex;
    flex-direction: column;
    gap: 0.45rem;
    padding: 0.75rem 0.9rem;
    border-radius: 0.8rem;
    background: rgba(7, 10, 18, 0.76);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .heatmap-legend span {
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(237, 243, 252, 0.8);
  }

  .legend-bar {
    width: 8.5rem;
    height: 0.65rem;
    border-radius: 999px;
    background: linear-gradient(90deg, #17315f 0%, #3b6ca8 25%, #64d2ff 50%, #ffbf43 72%, #ff453a 100%);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .floating-card {
    width: 12rem;
    padding: 0.9rem 1rem;
    border-radius: 0.8rem;
    background: rgba(15, 22, 38, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 18px 35px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }

  .floating-card strong {
    display: block;
    font-size: 0.98rem;
    margin: 0.2rem 0 0.18rem;
  }

  .floating-card span,
  .floating-card .card-kicker {
    display: block;
    font-size: 0.78rem;
    color: rgba(230, 235, 245, 0.78);
  }

  .card-kicker {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #f7b24f;
  }

  .card-1 {
    right: 1rem;
    top: 9rem;
    animation: float 6s ease-in-out infinite;
  }

  .card-2 {
    left: 1rem;
    bottom: 6rem;
    animation: float 7s ease-in-out infinite reverse;
  }

  .stats-bar {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-top: 0.5rem;
  }

  .stats-bar div {
    padding: 0.95rem 0;
    color: rgba(245, 248, 252, 0.86);
  }

  .stats-bar span {
    display: block;
    font-size: 0.76rem;
    color: #f7b24f;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .stats-bar strong {
    display: block;
    margin-top: 0.2rem;
    font-size: 0.84rem;
    font-weight: 600;
  }

  .works,
  .capabilities {
    padding: 3rem 0 0;
  }

  .section-heading {
    text-align: left;
    margin-bottom: 1.25rem;
  }

  .section-heading.center {
    text-align: center;
  }

  .section-heading p {
    margin: 0;
    color: #f7b24f;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .section-heading h2 {
    margin: 0.45rem 0 0;
    font-size: clamp(1.6rem, 3.2vw, 2.4rem);
    line-height: 1.1;
    letter-spacing: -0.04em;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .step-card,
  .capability-card {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(12, 18, 33, 0.82);
    box-shadow: 0 24px 40px rgba(0, 0, 0, 0.24);
    border-radius: 0.5rem;
  }

  .step-card {
    padding: 1.15rem;
    min-height: 12rem;
  }

  .step-card h3,
  .capability-card h3 {
    margin: 0.8rem 0 0.5rem;
    font-size: 1.03rem;
  }

  .step-card p,
  .capability-card p {
    margin: 0;
    color: rgba(230, 235, 245, 0.72);
    line-height: 1.6;
    font-size: 0.92rem;
  }

  .step-icon {
    width: 2.4rem;
    height: 2.4rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.35rem;
    background: rgba(100, 210, 255, 0.08);
    color: #7dd8ff;
    border: 1px solid rgba(125, 216, 255, 0.18);
  }

  .capability-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .capability-card {
    padding: 1.2rem;
    min-height: 14rem;
    position: relative;
    overflow: hidden;
  }

  .capability-card.wide {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 1rem;
    align-items: center;
  }

  .capability-copy {
    position: relative;
    z-index: 1;
  }

  .eyebrow-text {
    margin: 0 0 0.45rem;
    color: #f7b24f;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .mini-badge {
    display: inline-flex;
    margin-top: 1rem;
    padding: 0.45rem 0.7rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    background: rgba(255, 255, 255, 0.03);
    font-size: 0.8rem;
  }

  .capability-illustration {
    position: relative;
    min-height: 12rem;
    border-radius: 0.45rem;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(8, 12, 25, 0.1), rgba(8, 12, 25, 0.6)),
      radial-gradient(circle at 65% 40%, rgba(100, 210, 255, 0.12), transparent 28%);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .blueprint-grid {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, transparent 0 94%, rgba(255, 255, 255, 0.05) 94% 100%),
      linear-gradient(transparent 0 94%, rgba(255, 255, 255, 0.05) 94% 100%);
    background-size: 3rem 3rem;
    opacity: 0.5;
  }

  .heatmap-plane-card {
    left: 12%;
    right: 10%;
    bottom: 18%;
    height: 44%;
    border-radius: 0.8rem;
    background:
      radial-gradient(circle at 20% 70%, rgba(255, 159, 10, 0.34), transparent 18%),
      radial-gradient(circle at 54% 38%, rgba(100, 210, 255, 0.24), transparent 22%),
      radial-gradient(circle at 78% 55%, rgba(255, 69, 58, 0.26), transparent 16%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
    transform: perspective(900px) rotateX(72deg) rotateZ(-10deg);
    transform-origin: center center;
  }

  .slab-back-card {
    left: 18%;
    top: 22%;
    width: 44%;
    height: 18%;
    opacity: 0.55;
    transform: perspective(900px) rotateX(68deg) rotateZ(-10deg);
  }

  .hot-card {
    filter: blur(2px);
  }

  .hot-card-1 {
    left: 24%;
    top: 36%;
    width: 5.6rem;
    height: 5.6rem;
    background: radial-gradient(circle, rgba(255, 187, 73, 0.88) 0%, rgba(255, 159, 10, 0.18) 52%, transparent 76%);
  }

  .hot-card-2 {
    left: 46%;
    top: 28%;
    width: 4.8rem;
    height: 4.8rem;
    background: radial-gradient(circle, rgba(100, 210, 255, 0.9) 0%, rgba(100, 210, 255, 0.22) 45%, transparent 74%);
  }

  .hot-card-3 {
    right: 18%;
    top: 34%;
    width: 6rem;
    height: 6rem;
    background: radial-gradient(circle, rgba(255, 69, 58, 0.88) 0%, rgba(255, 69, 58, 0.22) 50%, transparent 76%);
  }

  .heatmap-legend {
    left: auto;
    right: 1rem;
    bottom: 1rem;
  }

  @keyframes scan {
    0%,
    100% {
      transform: translateY(-6%) rotate(-8deg);
      opacity: 0.75;
    }
    50% {
      transform: translateY(26%) rotate(-8deg);
      opacity: 1;
    }
  }

  .pricing-cta {
    margin-top: 3rem;
    padding: 3rem 0;
  }

  .pricing-copy {
    border-radius: 0.75rem;
    padding: 2.5rem 1.25rem;
    text-align: center;
    background:
      radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.12), transparent 18%),
      radial-gradient(circle at 80% 45%, rgba(255, 255, 255, 0.08), transparent 16%),
      linear-gradient(180deg, #f8a80d 0%, #ef9900 100%);
    color: #2a1700;
    box-shadow: 0 30px 70px rgba(255, 153, 0, 0.14);
  }

  .pricing-copy h2 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.08;
    letter-spacing: -0.04em;
  }

  .pricing-copy p {
    margin: 0.85rem auto 0;
    max-width: 42rem;
    line-height: 1.65;
    color: rgba(42, 23, 0, 0.82);
  }

  .landing-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    padding: 1rem 0 1.5rem;
    color: rgba(240, 245, 250, 0.8);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .footer-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .footer-brand img {
    width: 1.7rem;
    height: 1.7rem;
    object-fit: contain;
  }

  .footer-brand strong,
  .footer-brand span {
    display: block;
  }

  .footer-brand span {
    font-size: 0.8rem;
    color: rgba(240, 245, 250, 0.62);
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-end;
    font-size: 0.86rem;
  }

  .footer-links a:hover {
    color: #fff;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 1080px) {
    .hero {
      grid-template-columns: 1fr;
      padding-top: 2rem;
    }

    .hero-visual {
      min-height: 28rem;
    }

    .metric-strip,
    .stats-bar {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .capability-card.wide {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .nav-bar {
      height: auto;
      padding: 0.9rem 0;
      flex-wrap: wrap;
      justify-content: center;
    }

    .nav-links {
      order: 3;
      width: 100%;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .hero {
      min-height: auto;
      padding-top: 1.4rem;
    }

    h1 {
      max-width: none;
      font-size: clamp(2.5rem, 12vw, 4rem);
    }

    .metric-strip,
    .stats-bar,
    .steps-grid,
    .capability-grid {
      grid-template-columns: 1fr;
    }

    .hero-actions,
    .landing-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .footer-links {
      justify-content: flex-start;
    }
  }
</style>
