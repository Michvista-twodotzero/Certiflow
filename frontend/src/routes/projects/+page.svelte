<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchReports, fetchViolations } from '$lib/api'
  import { createProject, deleteProject, fetchProjects, updateProject } from '$lib/project-registry'
  import { notifications } from '$lib/notifications'
  import type { Project, Report, Violation } from '@certiflow/shared'
  import Icon from '$lib/components/Icon.svelte'

  type ProjectCard = {
    projectId: string
    name: string
    location: string
    reportCount: number
    openFindings: number
    latestStatus: Report['status'] | 'NONE'
  }

  let loading = true
  let creating = false
  let savingProjectId = ''
  let deletingProjectId = ''
  let editingProjectId = ''
  let error = ''
  let successMessage = ''
  let projects: ProjectCard[] = []
  let projectName = ''
  let projectLocation = ''
  let editName = ''
  let editLocation = ''

  onMount(loadData)

  async function loadData() {
    loading = true
    try {
      const projectRecords = await fetchProjects()
      const reports = await fetchReports()
      const allViolations = await Promise.all(
        reports.map(async (report) => [report.id, await fetchViolations(report.id).catch(() => [])] as const)
      )
      const violationsByReport = Object.fromEntries(allViolations) as Record<string, Violation[]>

      const grouped = new Map<string, ProjectCard>(
        projectRecords.map((project: Project) => [project.id, {
          projectId: project.id,
          name: project.name,
          location: project.location,
          reportCount: 0,
          openFindings: 0,
          latestStatus: 'NONE' as const,
        }])
      )

      for (const report of reports) {
        const project = grouped.get(report.projectId)
        if (!project) {
          continue
        }

        project.reportCount += 1
        project.openFindings += (violationsByReport[report.id] || []).filter((violation) => !violation.isResolved).length
        project.latestStatus = report.status
      }

      projects = [...grouped.values()]
      error = ''
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load projects'
    } finally {
      loading = false
    }
  }

  async function handleCreateProject() {
    creating = true
    error = ''
    successMessage = ''

    try {
      await createProject({
        name: projectName,
        location: projectLocation,
      })

      const nameToNotify = projectName
      projectName = ''
      projectLocation = ''
      successMessage = 'Project created successfully.'
      notifications.add(`Project "${nameToNotify}" created successfully.`, 'success')
      await loadData()
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to create project'
    } finally {
      creating = false
    }
  }

  function startEdit(project: ProjectCard) {
    editingProjectId = project.projectId
    editName = project.name
    editLocation = project.location
    error = ''
    successMessage = ''
  }

  function cancelEdit() {
    editingProjectId = ''
    editName = ''
    editLocation = ''
  }

  async function handleUpdateProject(projectId: string) {
    savingProjectId = projectId
    error = ''
    successMessage = ''

    try {
      await updateProject(projectId, {
        name: editName,
        location: editLocation,
      })

      successMessage = 'Project updated successfully.'
      cancelEdit()
      await loadData()
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to update project'
    } finally {
      savingProjectId = ''
    }
  }

  async function handleDeleteProject(project: ProjectCard) {
    if (project.reportCount > 0) {
      error = 'Please delete the project reports before removing this project.'
      successMessage = ''
      return
    }

    deletingProjectId = project.projectId
    error = ''
    successMessage = ''

    try {
      await deleteProject(project.projectId)
      successMessage = 'Project deleted successfully.'
      notifications.add(`Project "${project.name}" has been deleted.`, 'info')
      await loadData()
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to delete project'
    } finally {
      deletingProjectId = ''
    }
  }
</script>

<section class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Projects</h1>
      <p class="page-subtitle">Create, maintain, and retire the projects your reports belong to.</p>
    </div>
  </header>

  <div class="content-stack">
    <article class="panel">
      <h2 style="margin-top: 0; font-family: 'Outfit', sans-serif; font-size: 1.4rem; color: #fff;">Create Project</h2>
      <div class="field-grid">
        <div class="field">
          <label for="project-name">Project Name</label>
          <input id="project-name" bind:value={projectName} placeholder="Hudson Yards Tower B" />
        </div>
        <div class="field">
          <label for="project-location">Location</label>
          <input id="project-location" bind:value={projectLocation} placeholder="Manhattan, New York" />
        </div>
      </div>
      <div style="margin-top: 1.25rem;">
        <button class="primary-button" on:click={handleCreateProject} disabled={creating}>
          <span>{creating ? 'Creating...' : 'Create Project'}</span>
        </button>
      </div>
    </article>

    {#if successMessage}
      <div class="alert success">{successMessage}</div>
    {/if}

    {#if error}
      <div class="alert error">{error}</div>
    {/if}

    {#if loading}
      <div class="panel empty-state">Loading projects...</div>
    {:else if projects.length === 0}
      <div class="panel empty-state">No projects yet. Create one above to start using uploads.</div>
    {:else}
      <div class="projects-grid">
          {#each projects as project}
            <article class="panel project-card">
              {#if editingProjectId === project.projectId}
                <div class="stack">
                  <div class="field">
                    <label for={`edit-name-${project.projectId}`}>Project Name</label>
                    <input id={`edit-name-${project.projectId}`} bind:value={editName} />
                  </div>
                  <div class="field">
                    <label for={`edit-location-${project.projectId}`}>Location</label>
                    <input id={`edit-location-${project.projectId}`} bind:value={editLocation} />
                  </div>
                  <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="primary-button" on:click={() => handleUpdateProject(project.projectId)} disabled={savingProjectId === project.projectId}>
                      <span>{savingProjectId === project.projectId ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button class="ghost-button" on:click={cancelEdit}>Cancel</button>
                  </div>
                </div>
              {:else}
                <div>
                  <div class="eyebrow" style="margin-bottom: 0.5rem;">Project</div>
                  <h2 style="margin: 0 0 0.25rem 0; font-family: 'Outfit', sans-serif; font-size: 1.35rem; color: #fff;">{project.name}</h2>
                  <p class="muted" style="font-size: 0.9rem; margin: 0 0 1.25rem 0;">{project.location}</p>
                  
                  <div class="grid-2" style="margin-bottom: 1.25rem;">
                    <div class="metric-card" style="background-color: var(--bg); border: 1px solid var(--border); padding: 0.85rem 1rem; border-radius: 0.25rem;">
                      <div class="eyebrow" style="font-size: 0.65rem;">Reports</div>
                      <div style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 0.25rem;">{project.reportCount}</div>
                    </div>
                    <div class="metric-card" style="background-color: var(--bg); border: 1px solid var(--border); padding: 0.85rem 1rem; border-radius: 0.25rem;">
                      <div class="eyebrow" style="font-size: 0.65rem;">Findings</div>
                      <div style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 0.25rem;">{project.openFindings}</div>
                    </div>
                  </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                  <button class="ghost-button" style="flex: 1;" on:click={() => startEdit(project)}>
                    <Icon name="edit" size={14} />
                    <span>Edit</span>
                  </button>
                  <button class="ghost-button" style="flex: 1; border-color: rgba(255, 69, 58, 0.15); color: #ff6b6b;" on:click={() => handleDeleteProject(project)} disabled={deletingProjectId === project.projectId}>
                    <Icon name="trash" size={14} />
                    <span>{deletingProjectId === project.projectId ? '...' : 'Delete'}</span>
                  </button>
                </div>
              {/if}
            </article>
          {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18.5rem, 1fr));
    gap: 1rem;
    align-items: stretch;
  }

  .project-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 16rem;
  }
</style>
