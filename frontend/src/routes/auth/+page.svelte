<script lang="ts">
  import { goto } from '$app/navigation'
  import { login, register } from '$lib/auth'
  import Icon from '$lib/components/Icon.svelte'

  let mode: 'login' | 'register' = 'login'
  let name = ''
  let email = ''
  let password = ''
  let showPassword = false
  let loading = false
  let error = ''

  async function handleSubmit() {
    loading = true
    error = ''

    try {
      if (mode === 'register') {
        await register({ name, email, password })
      } else {
        await login({ email, password })
      }

      goto('/')
    } catch (err) {
      error = err instanceof Error ? err.message : 'Authentication failed'
    } finally {
      loading = false
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') handleSubmit()
  }
</script>

<div class="auth-wrapper">
  <!-- Ambient glow background -->
  <div class="auth-glow-bg"></div>
  <div class="auth-glow-bg" style="top: 30%; left: 35%; width: 20rem; height: 20rem; background: radial-gradient(circle, rgba(100, 210, 255, 0.04) 0%, transparent 70%);"></div>

  <div class="auth-glass-card">
    <!-- Brand Logo -->
    <div style="text-align: center; margin-bottom: 1.75rem;">
      <div class="auth-logo-wrap">
        <img src="/certiflow.png" alt="CertiFlow logo" class="auth-logo-image" />
      </div>
      <h1 style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.5rem; margin: 0 0 0.15rem 0; color: #fff; letter-spacing: -0.01em;">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p style="color: var(--text-muted); margin: 0; font-size: 0.9rem; line-height: 1.4;">
        {mode === 'login'
          ? 'Sign in to access your safety compliance dashboard.'
          : 'Get started with automated compliance reporting.'}
      </p>
    </div>

    <!-- Tab Switcher -->
    <div class="auth-tab-bar">
      <button
        class="auth-tab"
        class:active={mode === 'login'}
        on:click={() => { mode = 'login'; error = '' }}
      >
        Sign In
      </button>
      <button
        class="auth-tab"
        class:active={mode === 'register'}
        on:click={() => { mode = 'register'; error = '' }}
      >
        Register
      </button>
    </div>

    <!-- Error -->
    {#if error}
      <div class="alert error" style="margin-top: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </div>
      </div>
    {/if}

    <!-- Form -->
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.25rem;">
      {#if mode === 'register'}
        <div class="field">
          <label for="auth-name">Full Name</label>
          <div class="input-icon-wrapper">
            <input id="auth-name" bind:value={name} placeholder="Michelle Adeyemi" on:keydown={handleKeydown} />
            <span class="input-icon"><Icon name="user" size={16} /></span>
          </div>
        </div>
      {/if}

      <div class="field">
        <label for="auth-email">Email Address</label>
        <div class="input-icon-wrapper">
          <input id="auth-email" bind:value={email} type="email" placeholder="name@company.com" on:keydown={handleKeydown} />
          <span class="input-icon"><Icon name="mail" size={16} /></span>
        </div>
      </div>

      <div class="field">
        <label for="auth-password">Password</label>
        <div class="input-icon-wrapper" style="position: relative;">
          <input
            id="auth-password"
            bind:value={password}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            on:keydown={handleKeydown}
            style="padding-right: 2.75rem;"
          />
          <span class="input-icon"><Icon name="lock" size={16} /></span>
          <button
            type="button"
            class="password-toggle"
            on:click={() => (showPassword = !showPassword)}
            tabindex="-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
          </button>
        </div>
      </div>
    </div>

    <!-- Submit -->
    <button
      class="primary-button"
      style="width: 100%; padding: 0.9rem 1rem; font-weight: 700; margin-top: 1.5rem; font-size: 0.95rem;"
      on:click={handleSubmit}
      disabled={loading}
    >
      {#if loading}
        <span class="spinner"></span>
        <span>Please wait...</span>
      {:else}
        <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
      {/if}
    </button>

    <!-- Footer -->
    <p style="text-align: center; margin: 1.25rem 0 0 0; font-size: 0.82rem; color: var(--text-muted);">
      {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
      <button
        style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: 600; font-size: 0.82rem; padding: 0; text-decoration: underline; text-underline-offset: 2px;"
        on:click={() => { mode = mode === 'login' ? 'register' : 'login'; error = '' }}
      >
        {mode === 'login' ? 'Create one' : 'Sign in'}
      </button>
    </p>
  </div>
</div>

<style>
  .auth-logo-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 0.75rem;
    background: transparent !important;
    margin-bottom: 1rem;
    overflow: hidden;
    border: none !important;
  }

  .auth-logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .auth-tab-bar {
    display: flex;
    gap: 0;
    background-color: rgba(6, 9, 19, 0.6);
    border: 1px solid var(--border);
    border-radius: 0.35rem;
    padding: 0.2rem;
  }

  .auth-tab {
    flex: 1;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 0.88rem;
    font-weight: 600;
    padding: 0.6rem 0;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }

  .auth-tab.active {
    background-color: var(--panel-soft);
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .auth-tab:hover:not(.active) {
    color: #ccc;
  }

  .password-toggle {
    position: absolute;
    right: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .password-toggle:hover {
    color: var(--text);
  }

  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
