<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchReports, fetchViolations } from '$lib/api'
  import { severityTone } from '$lib/format'
  import { fetchProjects, resolveProjectName } from '$lib/project-registry'
  import type { Project, Violation } from '@certiflow/shared'
  import Icon from '$lib/components/Icon.svelte'

  type ViolationRow = Violation & {
    projectId: string
    reportStatus: string
  }

  let loading = true
  let error = ''
  let rows: ViolationRow[] = []
  let projects: Project[] = []
  let severityFilter: 'ALL' | 'CRITICAL' | 'MAJOR' | 'MINOR' = 'ALL'
  let resolutionFilter: 'ACTIVE' | 'RESOLVED' | 'ALL' = 'ACTIVE'
  let showFilters = false

  $: counts = {
    ALL: rows.length,
    ACTIVE: rows.filter((row) => !row.isResolved).length,
    RESOLVED: rows.filter((row) => row.isResolved).length,
    CRITICAL: rows.filter((row) => row.severity === 'CRITICAL').length,
    MAJOR: rows.filter((row) => row.severity === 'MAJOR').length,
    MINOR: rows.filter((row) => row.severity === 'MINOR').length,
  }

  $: filteredRows = rows.filter((row) => {
    if (severityFilter !== 'ALL' && row.severity !== severityFilter) return false
    if (resolutionFilter === 'ACTIVE' && row.isResolved) return false
    if (resolutionFilter === 'RESOLVED' && !row.isResolved) return false
    return true
  })

  onMount(async () => {
    try {
      projects = await fetchProjects()
      const reports = await fetchReports()
      const pairs = await Promise.all(
        reports.map(async (report) => {
          const violations = await fetchViolations(report.id).catch(() => [])
          return violations.map((violation) => ({
            ...violation,
            projectId: report.projectId,
            reportStatus: report.status,
          }))
        }),
      )

      rows = pairs.flat().sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load violations'
    } finally {
      loading = false
    }
  })
</script>

<section class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Violations</h1>
      <p class="page-subtitle">Filter findings fast by severity and resolution state.</p>
    </div>
    <div style="display: flex; gap: 0.75rem; align-items: center;">
      <a class="ghost-button" href="/violations/resolved">
        <Icon name="check-circle" size={15} />
        <span>Resolved Page</span>
      </a>
      <button
        class="ghost-button"
        class:filter-active={severityFilter !== 'ALL' || resolutionFilter !== 'ACTIVE'}
        on:click={() => (showFilters = !showFilters)}
      >
        <Icon name="filter" size={15} />
        <span>Filter</span>
      </button>
    </div>
  </header>

  <div class="content-stack">
    {#if showFilters}
      <div class="panel filter-panel">
        <div class="filter-group">
          <span class="filter-label">Status</span>
          <div class="pill-row">
            {#each ['ACTIVE', 'RESOLVED', 'ALL'] as status}
              <button
                class="status-pill"
                class:active={resolutionFilter === status}
                on:click={() => (resolutionFilter = status as typeof resolutionFilter)}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
                <span class="pill-count">{counts[status as keyof typeof counts]}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-label">Severity</span>
          <div class="pill-row">
            {#each ['ALL', 'CRITICAL', 'MAJOR', 'MINOR'] as severity}
              <button
                class="status-pill"
                class:active={severityFilter === severity}
                class:critical={severityFilter === severity && severity === 'CRITICAL'}
                class:major={severityFilter === severity && severity === 'MAJOR'}
                class:minor={severityFilter === severity && severity === 'MINOR'}
                on:click={() => (severityFilter = severity as typeof severityFilter)}
              >
                {severity === 'ALL' ? 'All' : severity.charAt(0) + severity.slice(1).toLowerCase()}
                <span class="pill-count">{counts[severity as keyof typeof counts]}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    {#if loading}
      <div class="panel empty-state">Loading violations...</div>
    {:else if error}
      <div class="alert error">{error}</div>
    {:else if filteredRows.length === 0}
      <div class="panel empty-state">No violations match the current filters.</div>
    {:else}
      <div class="summary-strip">
        <span>{filteredRows.length} item(s)</span>
        <span>{counts.ACTIVE} active</span>
        <span>{counts.RESOLVED} resolved</span>
      </div>

      <div class="violations-grid">
        {#each filteredRows as violation}
          <article class={`panel violation-card ${severityTone(violation.severity)}`}>
            <div class="violation-meta">
              <span class={`badge ${severityTone(violation.severity)}`}>{violation.severity}</span>
              <span class="badge minor monospace">{violation.ruleReference}</span>
              <span class="badge minor project-badge">{resolveProjectName(violation.projectId, projects)}</span>
              <span class={`badge ${violation.isResolved ? 'complete' : 'minor'}`}>
                {violation.isResolved ? 'Resolved' : 'Active'}
              </span>
            </div>

            <p class="violation-description">{violation.description}</p>

            <div class="suggestion-box">
              <div class="suggestion-label">
                <Icon name="wrench" size={14} style="color: var(--accent);" />
                <span class="eyebrow suggestion-eyebrow">Suggested Fix</span>
              </div>
              <p>{violation.suggestion}</p>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .filter-panel {
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .filter-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .pill-row {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
  }

  .status-pill.active {
    border-color: rgba(255, 255, 255, 0.16);
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  .status-pill.active.critical {
    color: var(--danger);
    background: var(--danger-soft);
    border-color: rgba(255, 69, 58, 0.3);
  }

  .status-pill.active.major {
    color: var(--accent);
    background: rgba(255, 159, 10, 0.14);
    border-color: rgba(255, 159, 10, 0.3);
  }

  .summary-strip {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    color: var(--text-muted);
    font-size: 0.82rem;
    font-weight: 600;
  }

  .violations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 1rem;
    align-items: start;
  }

  .monospace {
    font-family: monospace;
  }

  .project-badge {
    background-color: transparent;
    border-color: rgba(255, 255, 255, 0.08);
  }

  .suggestion-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
  }

  .suggestion-eyebrow {
    margin: 0;
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  .pill-count {
    font-size: 0.7rem;
    opacity: 0.72;
  }

  .filter-active {
    border-color: rgba(255, 159, 10, 0.3) !important;
    color: var(--accent) !important;
  }
</style>
