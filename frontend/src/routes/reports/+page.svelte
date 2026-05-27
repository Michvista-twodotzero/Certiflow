<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchReports, fetchViolations } from '$lib/api'
  import { formatDate, statusTone } from '$lib/format'
  import { fetchProjects, resolveProjectName } from '$lib/project-registry'
  import type { Project, Report, Violation } from '@certiflow/shared'
  import Icon from '$lib/components/Icon.svelte'

  let allReports: Report[] = []
  let projects: Project[] = []
  let violationsByReport: Record<string, Violation[]> = {}
  let loading = true
  let error = ''

  // Filter state
  let statusFilter: string = 'ALL'
  let searchQuery: string = ''
  let showFilters = false

  $: filteredReports = allReports.filter((report) => {
    if (statusFilter !== 'ALL' && report.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const projectName = resolveProjectName(report.projectId, projects).toLowerCase()
      const reportType = report.reportType.replaceAll('_', ' ').toLowerCase()
      if (!projectName.includes(q) && !reportType.includes(q)) return false
    }
    return true
  })

  $: statusCounts = {
    ALL: allReports.length,
    PENDING: allReports.filter((r) => r.status === 'PENDING').length,
    ANALYZING: allReports.filter((r) => r.status === 'ANALYZING').length,
    COMPLETE: allReports.filter((r) => r.status === 'COMPLETE').length,
    FAILED: allReports.filter((r) => r.status === 'FAILED').length,
  }

  onMount(async () => {
    try {
      projects = await fetchProjects()
      allReports = await fetchReports()
      const violationPairs = await Promise.all(
        allReports.map(async (report) => [report.id, await fetchViolations(report.id).catch(() => [])] as const)
      )

      violationsByReport = Object.fromEntries(violationPairs)
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load reports'
    } finally {
      loading = false
    }
  })
</script>

<section class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Reports</h1>
      <p class="page-subtitle">Track every upload moving through the audit pipeline.</p>
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <button class="ghost-button" on:click={() => (showFilters = !showFilters)} class:filter-active={statusFilter !== 'ALL' || searchQuery.trim()}>
        <Icon name="filter" size={15} />
        <span>Filter</span>
        {#if statusFilter !== 'ALL' || searchQuery.trim()}
          <span class="filter-dot"></span>
        {/if}
      </button>
      <a class="primary-button" href="/upload">
        <Icon name="upload" size={16} />
        <span>Upload Report</span>
      </a>
    </div>
  </header>

  <div class="content-stack">
    <!-- Filter Bar -->
    {#if showFilters}
      <div class="filter-bar panel" style="padding: 1rem 1.25rem;">
        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <!-- Search -->
          <div class="field" style="flex: 1; min-width: 14rem; gap: 0;">
            <div class="input-icon-wrapper">
              <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search by project or type..."
                style="padding: 0.65rem 1rem 0.65rem 2.5rem; font-size: 0.88rem;"
              />
              <span class="input-icon" style="left: 0.75rem;"><Icon name="filter" size={14} /></span>
            </div>
          </div>

          <!-- Status Pills -->
          <div class="status-pill-group">
            {#each ['ALL', 'PENDING', 'ANALYZING', 'COMPLETE', 'FAILED'] as status}
              <button
                class="status-pill"
                class:active={statusFilter === status}
                class:status-pending={status === 'PENDING'}
                class:status-analyzing={status === 'ANALYZING'}
                class:status-complete={status === 'COMPLETE'}
                class:status-failed={status === 'FAILED'}
                on:click={() => (statusFilter = status)}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                <span class="pill-count">{statusCounts[status as keyof typeof statusCounts]}</span>
              </button>
            {/each}
          </div>

          {#if statusFilter !== 'ALL' || searchQuery.trim()}
            <button
              class="ghost-button"
              style="font-size: 0.82rem; padding: 0.45rem 0.85rem;"
              on:click={() => { statusFilter = 'ALL'; searchQuery = '' }}
            >
              <Icon name="x" size={14} />
              <span>Clear</span>
            </button>
          {/if}
        </div>
      </div>
    {/if}

    {#if loading}
      <div class="panel empty-state">Loading reports...</div>
    {:else if error}
      <div class="alert error">{error}</div>
    {:else if filteredReports.length === 0}
      <div class="panel empty-state">
        <Icon name="file" size={28} />
        <p style="margin: 0; font-size: 1rem;">
          {allReports.length === 0 ? 'No reports have been submitted yet.' : 'No reports match your current filters.'}
        </p>
        {#if statusFilter !== 'ALL' || searchQuery.trim()}
          <button class="ghost-button" style="margin-top: 0.5rem;" on:click={() => { statusFilter = 'ALL'; searchQuery = '' }}>
            Clear filters
          </button>
        {/if}
      </div>
    {:else}
      <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">
        Showing {filteredReports.length} of {allReports.length} report{allReports.length !== 1 ? 's' : ''}
      </div>
      <div class="scroll-container" style="max-height: calc(100vh - 15rem); overflow-y: auto; padding-right: 0.25rem;">
        <div class="grid-2 report-grid">
          {#each filteredReports as report}
            <article class="report-card panel" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <div class="report-meta" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                  <span class={`badge ${statusTone(report.status)}`}>{report.status}</span>
                  <span class="muted" style="font-size: 0.82rem;">{formatDate(report.uploadedAt)}</span>
                </div>
                <h2 style="margin: 0 0 0.25rem 0; font-family: 'Outfit', sans-serif; font-size: 1.4rem; color: #fff;">
                  {resolveProjectName(report.projectId, projects)}
                </h2>
                <div class="muted" style="font-size: 0.85rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent);">
                  {report.reportType.replaceAll('_', ' ')}
                </div>
                
                {#if report.extractionStrategy === 'OCR'}
                  <p class="muted" style="margin: 0.75rem 0 0 0; font-size: 0.88rem; line-height: 1.4;">
                    OCR processed{report.ocrProvider ? ` via ${report.ocrProvider}` : ''}{report.ocrConfidence ? ` (${Math.round(report.ocrConfidence * 100)}% confidence)` : ''}.
                  </p>
                {:else if report.extractionStrategy === 'GEMINI_FILE'}
                  <p class="muted" style="margin: 0.75rem 0 0 0; font-size: 0.88rem; line-height: 1.4;">
                    Analyzed with Gemini Files{report.ocrProvider ? ` via ${report.ocrProvider}` : ''}.
                  </p>
                {/if}
                
                <p class="muted" style="margin: 0.75rem 0 0 0; font-size: 0.88rem; font-weight: 500; color: #fff;">
                  {violationsByReport[report.id]?.length || 0} violation(s) linked to this report.
                </p>
              </div>
              
              <div class="detail-actions" style="display: flex; gap: 0.5rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                <a class="ghost-button" style="flex: 1;" href={`/reports/${report.id}`}>
                  <span>Open details</span>
                </a>
                {#if report.fileUrl}
                  <a class="ghost-button" style="flex: 1;" href={report.fileUrl} target="_blank" rel="noreferrer">
                    <span>View Source</span>
                  </a>
                {/if}
              </div>
            </article>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .report-grid {
    align-items: start;
  }

  .status-pill-group {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .status-pill:hover {
    border-color: var(--border-hover);
    color: var(--text);
  }

  .status-pill.active {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  .status-pill.active.status-pending {
    background: var(--pending-soft);
    border-color: rgba(142, 142, 147, 0.3);
    color: var(--pending);
  }

  .status-pill.active.status-analyzing {
    background: var(--info-soft);
    border-color: rgba(100, 210, 255, 0.3);
    color: var(--info);
  }

  .status-pill.active.status-complete {
    background: var(--ok-soft);
    border-color: rgba(255, 159, 10, 0.3);
    color: var(--accent);
  }

  .status-pill.active.status-failed {
    background: var(--danger-soft);
    border-color: rgba(255, 69, 58, 0.3);
    color: var(--danger);
  }

  .pill-count {
    font-size: 0.7rem;
    opacity: 0.7;
  }

  .filter-dot {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }

  .filter-active {
    border-color: rgba(255, 159, 10, 0.3) !important;
    color: var(--accent) !important;
  }
</style>
