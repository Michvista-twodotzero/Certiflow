<div class="scene">
  <div class="glow glow-left"></div>
  <div class="glow glow-right"></div>
  <div class="grid"></div>
  <div class="plane"></div>
  <div class="slab slab-back"></div>
  <div class="slab slab-front"></div>
  <div class="spot spot-amber"></div>
  <div class="spot spot-blue"></div>
  <div class="spot spot-red"></div>
  <div class="scan-line"></div>

  <div class="copy">
    <p class="eyebrow">Core engine</p>
    <h3>Automated OSHA Referencing</h3>
    <p>
      CertiFlow reviews construction photos and reports, extracts text with OCR or native parsing, and surfaces likely violations with action-oriented summaries.
    </p>
    <div class="chip">Rule-aware compliance checks</div>
  </div>
</div>

<style>
  .scene {
    position: relative;
    width: 100%;
    min-height: 28rem;
    border-radius: 1rem;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(8, 12, 25, 0.12) 0%, rgba(8, 12, 25, 0.62) 100%),
      radial-gradient(circle at 78% 30%, rgba(67, 120, 204, 0.22), transparent 30%),
      radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.42), transparent 35%),
      linear-gradient(145deg, #11182b 0%, #080c16 58%, #05070e 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.42);
    transform: perspective(1400px) rotateY(-18deg) rotateX(8deg);
    transform-style: preserve-3d;
  }

  .copy {
    position: absolute;
    left: 1.2rem;
    bottom: 1.2rem;
    z-index: 2;
    width: min(24rem, calc(100% - 2.4rem));
    padding: 1rem 1rem 0.95rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    background: rgba(7, 12, 22, 0.72);
    backdrop-filter: blur(10px);
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.22);
  }

  .copy h3 {
    margin: 0 0 0.45rem;
    color: #f4f7ff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.15rem;
    letter-spacing: -0.03em;
  }

  .copy p {
    margin: 0;
    color: rgba(229, 235, 246, 0.78);
    line-height: 1.55;
    font-size: 0.92rem;
  }

  .glow,
  .grid,
  .plane,
  .slab,
  .spot,
  .scan-line {
    position: absolute;
  }

  .glow {
    border-radius: 999px;
    filter: blur(28px);
    opacity: 0.8;
  }

  .glow-left {
    width: 14rem;
    height: 14rem;
    left: -4rem;
    top: 7rem;
    background: rgba(255, 159, 10, 0.14);
  }

  .glow-right {
    width: 13rem;
    height: 13rem;
    right: -3rem;
    top: 3rem;
    background: rgba(100, 210, 255, 0.12);
  }

  .grid {
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 3rem 3rem;
    opacity: 0.45;
    transform: perspective(700px) rotateX(68deg) translateY(5rem);
    transform-origin: center bottom;
  }

  .plane {
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

  .slab {
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

  .spot {
    width: 6rem;
    height: 6rem;
    border-radius: 999px;
    filter: blur(4px);
  }

  .spot::before {
    content: '';
    position: absolute;
    inset: 20%;
    border-radius: inherit;
    background: inherit;
    filter: blur(18px);
    opacity: 0.7;
  }

  .spot-amber {
    left: 18%;
    top: 35%;
    background: radial-gradient(circle, rgba(255, 182, 63, 0.9) 0%, rgba(255, 159, 10, 0.18) 52%, transparent 74%);
  }

  .spot-blue {
    left: 44%;
    top: 26%;
    width: 5rem;
    height: 5rem;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(100, 210, 255, 0.34) 42%, transparent 70%);
  }

  .spot-red {
    right: 16%;
    top: 31%;
    background: radial-gradient(circle, rgba(255, 93, 93, 0.9) 0%, rgba(255, 69, 58, 0.24) 50%, transparent 72%);
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

  .eyebrow {
    margin: 0 0 0.3rem;
    color: #f7b24f;
    text-transform: uppercase;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .chip {
    display: inline-flex;
    margin-top: 0.85rem;
    padding: 0.4rem 0.65rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    background: rgba(255, 255, 255, 0.03);
    font-size: 0.77rem;
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

  @media (max-width: 760px) {
    .scene {
      min-height: 20rem;
    }

    .copy {
      left: 0.85rem;
      right: 0.85rem;
      bottom: 0.85rem;
      width: auto;
      padding: 0.85rem;
    }
  }
</style>
