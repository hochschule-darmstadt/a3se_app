# Project Management

- Status: draft
- Owner: Management
- Last reviewed: 2026-08-05

This overview communicates the coarse logical structure of the project without calendar dates or delivery forecasts. [GitHub Issues](https://github.com/hochschule-darmstadt/a3se_app/issues) are authoritative for individual tasks, dependencies, scope, and completion evidence; the [GitHub Project board](https://github.com/orgs/hochschule-darmstadt/projects/2/views/2) is authoritative for the workflow states `Open`, `In progress`, and `Done`.

## Logical structure

![Logical project structure](project-structure.svg)

The Gantt chart expresses logical order and coarse grouping only. Its equal-sized `Step` units are neither calendar dates nor effort estimates. The basic concept establishes enough lifecycle discipline, requirements, architecture, and technical evidence to support iterative delivery. Iterations or sprints then deliver reviewable increments; their number and content are intentionally not predicted here. The end phase begins only after the required increments and their evidence are complete.

## Coarse tasks and issue mapping

| Phase | Coarse task | Existing GitHub Issues | Purpose |
|---|---|---|---|
| Basic concept | Coarse overall planning | [#2](https://github.com/hochschule-darmstadt/a3se_app/issues/2) | Establish the initial lifecycle harness and overall working structure. |
| Basic concept | Essential requirements | [#3](https://github.com/hochschule-darmstadt/a3se_app/issues/3) | Establish the initial requirements baseline needed for architecture and implementation decisions. |
| Basic concept | Supporting architecture | [#4](https://github.com/hochschule-darmstadt/a3se_app/issues/4), [#7](https://github.com/hochschule-darmstadt/a3se_app/issues/7), [#8](https://github.com/hochschule-darmstadt/a3se_app/issues/8), [#9](https://github.com/hochschule-darmstadt/a3se_app/issues/9) | Establish technology, modular software architecture, deployment architecture, and the entity-model basis. |
| Basic concept | Proof of concept | [#10](https://github.com/hochschule-darmstadt/a3se_app/issues/10), [#11](https://github.com/hochschule-darmstadt/a3se_app/issues/11), [#12](https://github.com/hochschule-darmstadt/a3se_app/issues/12), [#13](https://github.com/hochschule-darmstadt/a3se_app/issues/13) | Specify and generate test data, define the initial UX, and validate the selected stack through a vertical thin slice. |
| Iterative delivery | Iteration / Sprint 1 | Future delivery issues | Deliver the first accepted product increment with its requirements, implementation, tests, and operational evidence. |
| Iterative delivery | Iteration / Sprint 2 through n | Future delivery issues | Repeat incremental delivery until the intended product scope and quality evidence are complete. |
| End phase | Approval testing and approval | Future issue | Perform independent approval testing, resolve blocking findings, and record formal approval. |
| End phase | Roll-out and closing | Future issue | Roll out the approved system, hand over operational responsibility, close residual work explicitly, and conclude the project. |

Issue numbers identify current coarse-grained work; they do not duplicate issue content or imply that an issue's workflow state equals specification acceptance. Create future iteration and end-phase issues only when their scope and entry conditions are known.
