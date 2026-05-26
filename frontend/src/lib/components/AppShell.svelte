<script lang="ts">
  import { page } from '$app/stores'
  import { authSession, logout } from '$lib/auth'
  import { notifications, unreadCount } from '$lib/notifications'
  import Icon from '$lib/components/Icon.svelte'

  let showNotifications = false

  function isActive(href: string) {
    return href === '/' ? $page.url.pathname === href : $page.url.pathname.startsWith(href)
  }

  function toggleNotifications() {
    showNotifications = !showNotifications
    if (showNotifications) {
      notifications.markAllRead()
    }
  }

  function closeNotifications() {
    showNotifications = false
  }

  function formatTimeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }
</script>

<svelte:window on:click={closeNotifications} />

<div class="app-shell">
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark brand-image-wrap">
        <img src="/certiflow.png" alt="CertiFlow logo" class="brand-image" />
      </div>
      <div>
        <div class="brand-name">CertiFlow</div>
        <div class="brand-tag">Safety Compliance</div>
      </div>
    </div>

    <a class="upload-cta" href="/upload">
      <Icon name="upload" size={16} />
      <span>Upload Report</span>
    </a>

    <nav class="nav-list">
      <a class:active={isActive('/')} href="/">
        <Icon name="dashboard" size={18} />
        <span>Dashboard</span>
      </a>
      <a class:active={isActive('/projects')} href="/projects">
        <Icon name="projects" size={18} />
        <span>Projects</span>
      </a>
      <a class:active={isActive('/reports')} href="/reports">
        <Icon name="reports" size={18} />
        <span>Reports</span>
      </a>
      <a class:active={isActive('/violations')} href="/violations">
        <Icon name="violations" size={18} />
        <span>Violations</span>
      </a>
      <a class:active={isActive('/settings')} href="/settings">
        <Icon name="settings" size={18} />
        <span>Settings</span>
      </a>
    </nav>

    {#if $authSession}
      <a class="session-card" href="/profile" style="text-decoration: none;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="profile-avatar" style="width: 2.25rem; height: 2.25rem; font-size: 0.9rem; flex-shrink: 0;">
            {$authSession.user.name.charAt(0).toUpperCase()}
          </div>
          <div style="overflow: hidden;">
            <strong style="font-size: 0.88rem; color: #fff; display: block;">{$authSession.user.name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {$authSession.user.email}
            </div>
          </div>
        </div>
      </a>
    {/if}
  </aside>

  <div class="workspace">
    <div class="top-nav-actions">
      <!-- Notification Bell -->
      <div class="notification-wrapper" on:click|stopPropagation>
        <button class="top-action-btn" aria-label="Notifications" on:click={toggleNotifications}>
          <Icon name="bell" size={20} />
          {#if $unreadCount > 0}
            <span class="notif-badge">{$unreadCount}</span>
          {/if}
        </button>

        {#if showNotifications}
          <div class="notification-dropdown">
            <div class="notif-header">
              <strong style="font-size: 0.95rem; color: #fff;">Notifications</strong>
              {#if $notifications.length > 0}
                <button class="notif-clear-btn" on:click={() => notifications.clear()}>Clear all</button>
              {/if}
            </div>
            <div class="notif-list">
              {#if $notifications.length === 0}
                <div class="notif-empty">
                  <Icon name="bell" size={24} />
                  <p>No notifications yet</p>
                  <p style="font-size: 0.78rem; color: var(--text-muted);">Activity updates will appear here</p>
                </div>
              {:else}
                {#each $notifications as n}
                  <div class="notif-item" class:unread={!n.read}>
                    <div class="notif-icon-wrap" class:success={n.type === 'success'} class:warning={n.type === 'warning'}>
                      <Icon name={n.type === 'success' ? 'check-circle' : n.type === 'warning' ? 'alert' : 'info'} size={16} />
                    </div>
                    <div style="flex: 1; min-width: 0;">
                      <p style="margin: 0; font-size: 0.88rem; color: #fff; line-height: 1.35;">{n.message}</p>
                      <span style="font-size: 0.75rem; color: var(--text-muted);">{formatTimeAgo(n.timestamp)}</span>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        {/if}
      </div>

      <!-- Profile Avatar -->
      <a href="/profile" class="profile-avatar" title={$authSession ? $authSession.user.name : 'Guest'}>
        {$authSession ? $authSession.user.name.charAt(0).toUpperCase() : 'G'}
      </a>
    </div>
    <slot />
  </div>
</div>

<style>
  .notification-wrapper {
    position: relative;
  }

  .brand-image-wrap {
    overflow: hidden;
    padding: 0.15rem;
    background: transparent !important;
    border: none !important;
  }

  .brand-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  .top-action-btn {
    position: relative;
  }

  .notif-badge {
    position: absolute;
    top: -2px;
    right: -4px;
    background: var(--danger);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    min-width: 1.1rem;
    height: 1.1rem;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    padding: 0 0.2rem;
  }

  .notification-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    width: 22rem;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    z-index: 100;
    overflow: hidden;
  }

  .notif-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--border);
  }

  .notif-clear-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0;
  }

  .notif-clear-btn:hover {
    text-decoration: underline;
  }

  .notif-list {
    max-height: 20rem;
    overflow-y: auto;
  }

  .notif-empty {
    padding: 2rem 1rem;
    text-align: center;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .notif-empty p {
    margin: 0;
  }

  .notif-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    transition: background-color 0.15s;
  }

  .notif-item:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }

  .notif-item:last-child {
    border-bottom: none;
  }

  .notif-item.unread {
    background-color: rgba(255, 159, 10, 0.03);
  }

  .notif-icon-wrap {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--info-soft);
    color: var(--info);
  }

  .notif-icon-wrap.success {
    background: rgba(48, 209, 88, 0.12);
    color: #30d158;
  }

  .notif-icon-wrap.warning {
    background: var(--ok-soft);
    color: var(--ok);
  }
</style>
