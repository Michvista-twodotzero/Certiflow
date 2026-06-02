<footer class="footer">
  <div class="footer-top">
    <div class="brand">
      <img src="/certiflow.png" alt="" />
      <div>
        <strong>CertiFlow</strong>
        <span>&copy; 2026 CertiFlow. Industrial Safety Compliance</span>
      </div>
    </div>

    <div class="footer-center">
      <a href="/auth">Privacy Policy</a>
      <a href="/auth">Terms of Service</a>
      <a href="/auth">Contact Support</a>
      <a href="/auth">Documentation</a>
    </div>

    <div class="footer-right">
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Share" class="social-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </a>
      <button class="social-btn" aria-label="Settings">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      </button>
    </div>
  </div>
</footer>

<style>
  .footer {
    width: min(1200px, calc(100% - 4rem));
    margin: 1.8rem auto 0;
    padding: 1.2rem 0 1.8rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(240, 245, 250, 0.72);
  }

  .footer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-shrink: 0;
  }

  .brand img {
    width: 1.4rem;
    height: 1.4rem;
    object-fit: contain;
  }

  .brand strong {
    display: block;
    color: #fff;
    font-size: 0.9rem;
  }

  .brand span {
    display: block;
    font-size: 0.72rem;
    color: rgba(240, 245, 250, 0.5);
    margin-top: 0.1rem;
  }

  .footer-center {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    justify-content: center;
    font-size: 0.82rem;
  }

  .footer-center a:hover {
    color: #fff;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.65);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .social-btn:hover {
    border-color: rgba(255, 255, 255, 0.3);
    color: #fff;
  }

  @media (max-width: 760px) {
    .footer-top {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .footer-center {
      justify-content: flex-start;
    }
  }
</style>
