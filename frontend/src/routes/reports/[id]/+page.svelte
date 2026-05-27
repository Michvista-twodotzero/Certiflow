<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { fetchReport, fetchViolations, resolveViolation } from '$lib/api'
  import { formatShortDate, severityTone, statusTone } from '$lib/format'
  import { fetchProjects, resolveProjectName } from '$lib/project-registry'
  import { getReportSourceFileName } from '$lib/report-file'
  import { notifications } from '$lib/notifications'
  import type { Project, Report, Violation } from '@certiflow/shared'
  import Icon from '$lib/components/Icon.svelte'

  let report: Report | null = null
  let projects: Project[] = []
  let violations: Violation[] = []
  let loading = true
  let error = ''

  $: criticalCount = violations.filter((violation) => violation.severity === 'CRITICAL' && !violation.isResolved).length
  $: majorCount = violations.filter((violation) => violation.severity === 'MAJOR' && !violation.isResolved).length
  $: actionableCount = violations.filter((violation) => !violation.isResolved).length
  $: actionablePercent = violations.length ? Math.round((actionableCount / violations.length) * 100) : 0
  $: minorCount = violations.filter((violation) => violation.severity === 'MINOR' && !violation.isResolved).length
  $: resolvedCount = violations.filter((violation) => violation.isResolved).length
  $: reportFileName = report ? getReportSourceFileName(report) : ''
  $: fallbackSummary = actionableCount > 0
    ? `Automated analysis identified ${criticalCount} critical and ${majorCount} major open issue(s). Review the listed findings below for the exact affected areas and suggested actions.`
    : 'Automated analysis did not produce any open violations for this report.'
  $: displayedSummary = report?.summary?.trim() || fallbackSummary

  onMount(async () => {
    const reportId = $page.params.id

    try {
      projects = await fetchProjects()
      report = await fetchReport(reportId)
      violations = await fetchViolations(reportId)
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load report details'
    } finally {
      loading = false
    }
  })

  async function markResolved(violationId: string) {
    try {
      const updated = await resolveViolation(violationId)
      violations = violations.map((violation) => violation.id === updated.id ? updated : violation)
      notifications.add('Violation marked as resolved.', 'success')
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to resolve violation'
    }
  }

  let severityFilter = 'ALL'
  let resolutionFilter = 'ALL' // 'ALL' | 'ACTIVE' | 'RESOLVED'
  let showFilters = false

  $: filteredViolations = violations.filter((v) => {
    if (severityFilter !== 'ALL' && v.severity !== severityFilter) return false
    if (resolutionFilter === 'ACTIVE' && v.isResolved) return false
    if (resolutionFilter === 'RESOLVED' && !v.isResolved) return false
    return true
  })
</script>

<section class="page">
  {#if loading}
    <div class="panel empty-state">Loading report details...</div>
  {:else if error}
    <div class="alert error">{error}</div>
  {:else if report}
    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500; margin-bottom: 0.25rem;">
      {formatShortDate(report.uploadedAt)} &nbsp;/&nbsp; {resolveProjectName(report.projectId, projects)}
    </div>

    <header class="page-header" style="border-bottom: 1px solid var(--border); padding-bottom: 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="color: var(--accent); display: flex; align-items: center; justify-content: center;">
          <Icon name="file" size={28} />
        </div>
        <h1 class="page-title" style="font-size: 2rem;">{reportFileName}</h1>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class={`badge ${statusTone(report.status)}`} style="padding: 0.35rem 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem;">
          {#if report.status === 'COMPLETE'}
            <Icon name="check" size={12} />
          {/if}
          {report.status}
        </span>
      </div>
    </header>

    <div class="content-stack">
      <div class="two-column">
        <!-- Left Column: Summary Card -->
        <aside class="summary-card" style="position: sticky; top: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
            <Icon name="robot" size={18} style="color: var(--accent);" />
            <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: #fff;">AI Audit Summary</h2>
          </div>
          
          <p class="muted" style="line-height: 1.5; font-size: 0.92rem; margin-bottom: 0.85rem;">
            Automated analysis of <strong>{reportFileName}</strong> identified
            <strong style="color: var(--danger);"> {criticalCount} Critical</strong> and
            <strong style="color: var(--accent);"> {majorCount} Major</strong> issue(s).
          </p>
          
          <p class="muted" style="line-height: 1.5; font-size: 0.92rem; margin-bottom: 0.85rem;">
            Extraction strategy: <strong style="color: #fff;">{report.extractionStrategy || 'NONE'}</strong>
            {#if report.ocrProvider}
              via <strong style="color: #fff;">{report.ocrProvider}</strong>
            {/if}
            {#if report.ocrConfidence}
               (<strong style="color: #fff;">{Math.round(report.ocrConfidence * 100)}%</strong> confidence)
            {/if}
          </p>
          
          <p class="muted" style="line-height: 1.5; font-size: 0.92rem; margin-bottom: 1rem;">
            {displayedSummary}
          </p>
          
          <div class="progress-track">
            <div class="progress-fill" style={`width: ${100 - actionablePercent}%`}></div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
            <span class="eyebrow" style="font-size: 0.7rem; font-weight: 700;">{100 - actionablePercent}% Resolved</span>
            <span class="eyebrow" style="font-size: 0.7rem; font-weight: 700; color: var(--accent);">{actionablePercent}% Actionable</span>
          </div>
        </aside>

        <!-- Right Column: Violations List -->
        <section class="violations-list">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h3 class="eyebrow" style="margin: 0; font-size: 0.8rem; letter-spacing: 0.08em; color: var(--text-muted);">
              IDENTIFIED VIOLATIONS ({filteredViolations.length})
            </h3>
            <button
              class="ghost-button"
              style="padding: 0.35rem 0.75rem; font-size: 0.8rem;"
              class:filter-active={severityFilter !== 'ALL' || resolutionFilter !== 'ALL'}
              on:click={() => (showFilters = !showFilters)}
            >
              <Icon name="filter" size={14} />
              <span>Filter</span>
              {#if severityFilter !== 'ALL' || resolutionFilter !== 'ALL'}
                <span class="filter-dot" style="width: 0.35rem; height: 0.35rem; background: var(--accent); border-radius: 50%; display: inline-block; margin-left: 0.25rem;"></span>
              {/if}
            </button>
          </div>

          {#if showFilters}
            <div class="panel" style="padding: 0.75rem 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.75rem; border-color: var(--border); background-color: rgba(6, 9, 19, 0.4);">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
                <!-- Severity Filter -->
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="eyebrow" style="font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.05em;">Severity:</span>
                  <div style="display: flex; gap: 0.25rem;">
                    {#each ['ALL', 'CRITICAL', 'MAJOR', 'MINOR'] as sev}
                      <button
                        class="ghost-button"
                        style="font-size: 0.72rem; padding: 0.2rem 0.5rem;"
                        style:border-color={severityFilter === sev ? 'var(--accent)' : 'var(--border)'}
                        style:color={severityFilter === sev ? 'var(--accent)' : 'var(--text-muted)'}
                        on:click={() => (severityFilter = sev)}
                      >
                        {sev === 'ALL' ? 'All' : sev.charAt(0) + sev.slice(1).toLowerCase()}
                      </button>
                    {/each}
                  </div>
                </div>

                <!-- Status Filter -->
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="eyebrow" style="font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.05em;">Status:</span>
                  <div style="display: flex; gap: 0.25rem;">
                    {#each ['ALL', 'ACTIVE', 'RESOLVED'] as res}
                      <button
                        class="ghost-button"
                        style="font-size: 0.72rem; padding: 0.2rem 0.5rem;"
                        style:border-color={resolutionFilter === res ? 'var(--accent)' : 'var(--border)'}
                        style:color={resolutionFilter === res ? 'var(--accent)' : 'var(--text-muted)'}
                        on:click={() => (resolutionFilter = res)}
                      >
                        {res === 'ALL' ? 'All' : res.charAt(0) + res.slice(1).toLowerCase()}
                      </button>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}

          <div class="quick-filter-row">
            <button class="ghost-button compact-filter" class:active-filter={severityFilter === 'CRITICAL'} on:click={() => (severityFilter = severityFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}>
              Critical <span>{criticalCount}</span>
            </button>
            <button class="ghost-button compact-filter" class:active-filter={severityFilter === 'MAJOR'} on:click={() => (severityFilter = severityFilter === 'MAJOR' ? 'ALL' : 'MAJOR')}>
              Major <span>{majorCount}</span>
            </button>
            <button class="ghost-button compact-filter" class:active-filter={severityFilter === 'MINOR'} on:click={() => (severityFilter = severityFilter === 'MINOR' ? 'ALL' : 'MINOR')}>
              Minor <span>{minorCount}</span>
            </button>
            <button class="ghost-button compact-filter" class:active-filter={resolutionFilter === 'RESOLVED'} on:click={() => (resolutionFilter = resolutionFilter === 'RESOLVED' ? 'ALL' : 'RESOLVED')}>
              Resolved <span>{resolvedCount}</span>
            </button>
          </div>

          <div class="scroll-container violation-stack" style="max-height: calc(100vh - 16rem); overflow-y: auto; padding-right: 0.25rem;">
            {#if filteredViolations.length === 0}
              <div class="panel empty-state">No violations match the current filters.</div>
            {/if}

            {#each filteredViolations as violation}
              <article class={`panel violation-card ${severityTone(violation.severity)}`}>
                <div class="violation-meta">
                  <span class={`badge ${severityTone(violation.severity)}`}>{violation.severity}</span>
                  <span class="badge minor" style="font-family: monospace;">{violation.ruleReference}</span>
                  {#if violation.sector}
                    <span class="sector-tag">Sector {violation.sector.replace(/sector\s+/gi, '')}</span>
                  {/if}
                </div>

                <p class="violation-description">{violation.description}</p>

                <div class="suggestion-box">
                  <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                    <Icon name="wrench" size={14} style="color: var(--accent);" />
                    <span class="eyebrow" style="margin: 0; font-size: 0.7rem; color: var(--text-muted);">Suggested Fix</span>
                  </div>
                  <p>{violation.suggestion}</p>
                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
                  {#if !violation.isResolved}
                    <button class="ghost-button" style="border-color: rgba(255,255,255,0.15);" on:click={() => markResolved(violation.id)}>
                      <Icon name="check" size={14} />
                      <span>Mark as Resolved</span>
                    </button>
                  {:else}
                    <span class="badge complete" style="padding: 0.4rem 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <Icon name="check" size={12} />
                      <span>Resolved</span>
                    </span>
                  {/if}
                </div>
              </article>
            {/each}
          </div>
        </section>
      </div>
    </div>
  {/if}
</section>

<style>
  .violation-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .quick-filter-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.9rem;
  }

  .compact-filter {
    font-size: 0.76rem;
    padding: 0.35rem 0.7rem;
  }

  .compact-filter span {
    display: inline-flex;
    min-width: 1.2rem;
    justify-content: center;
    color: var(--text-muted);
  }

  .active-filter {
    border-color: rgba(255, 159, 10, 0.3) !important;
    color: var(--accent) !important;
    background: rgba(255, 159, 10, 0.08) !important;
  }
</style>
