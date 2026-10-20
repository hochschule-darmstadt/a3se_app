---
name: export-empty-harness
description: Export the repository's reusable software-lifecycle harness into a clean new-project directory, preserving generic rules, skills, templates, governance, workflows, structure, and supporting tooling while excluding product-specific artifacts, implementation, runtime state, secrets, and repository history. Use when preparing the current harness as a starter for a new independent project; do not use it to clone a product, back up the repository, initialize Git, or migrate project content.
---

# Export Empty Harness

Create a clean, movable starter directory from the reusable parts of the current repository. The result must preserve the working lifecycle harness without carrying facts, decisions, evidence, plans, architecture, technology, code, or operational state belonging to the source product.

The user's instructions take precedence over this skill. Treat an invocation as authorization to create the export inside the current repository, not to delete or overwrite an existing destination, initialize another repository, install tools, move the result elsewhere, or publish it.

## Output contract

Unless the user chooses another location, write the completed export to `<repository-root>/new-project`.

The result must:

- be a self-contained starting point for a new, independent product;
- contain the complete generic harness, including repository rules, local skills, canonical templates, governance, lifecycle guidance, standards, generic workflows, agent-workflow documents and their diagrams, and supporting harness tooling;
- retain the generic documentation structure and enough neutral routing content for an agent to find the correct starting point;
- contain no source-product requirements, evidence, models, plans, risks, decisions, implementation, configuration, credentials, generated runtime state, or repository history;
- permit the first product-definition activity to begin with a skill such as `create-product-vision` without relying on the source repository or prior chat history;
- not contain `frontend/` or `backend/` directories;
- not be a Git repository until the user separately chooses to initialize it.

An empty harness may contain neutral scaffolds derived from canonical templates. A scaffold is not product content: it contains no source-product name, identifiers, statements, dates presented as project history, decisions, evidence, or filled-in domain data.

## Preserve authority boundaries

Exporting is a packaging operation. It does not approve the source repository's product decisions for a new product and does not turn project-specific material into generic guidance.

- Rules and governance define how work is performed.
- Skills define reusable agent behavior.
- Templates define reusable artifact structures.
- Product artifacts contain the facts, assumptions, proposals, decisions, evidence, and models of one product.
- Decision records are reusable only when their subject is the harness itself. A decision about the source product's architecture, technology, repository topology, issue tracker, deployment, or operating environment remains project-specific even if its wording could be generalized.
- Tooling is reusable only when it supports the generic harness or its governed notations. Product build, test, delivery, database, and runtime tooling is not harness tooling.

Do not copy a project artifact merely because it sits in a generic-looking directory. Classify by semantic ownership and content, not by extension or location alone.

## Load the source context

Before constructing the export:

1. Resolve the repository root without assuming the current working directory is the root.
2. Read every applicable `AGENTS.md` and the repository documentation entrypoint.
3. Read the governance, lifecycle, workflow, standards, templates, tooling, decisions, and skills indexes.
4. Inspect the top-level tree, hidden configuration, repository-local tools, and all nested `README.md` routing files.
5. Inspect version-control status so existing user changes are understood and preserved. The working tree is the source of the export unless the user explicitly requests a committed revision.
6. Identify the source-product name, known product identifiers, source-specific package names or namespaces, personal or organization-specific URLs, absolute paths, and configuration markers that must not leak into the export.

Load product artifacts only far enough to classify and exclude them. Do not reinterpret, improve, or modify them as part of the export.

## Classify the inventory

Build an explicit inventory before copying. Assign every candidate to one of these classes:

### Copy verbatim

Use this class for content that is already generic and internally consistent, including when present:

- repository-wide agent rules and neutral agent-extension routing;
- all reusable local skills, including this skill, and the skills index;
- canonical artifact and work-item templates;
- generic SDLC responsibility and collaboration guidance;
- generic artifact-lifecycle, requirements, alignment, commit, architecture, definition-of-done, and agent workflows;
- the Basic Concept and iteration or sprint workflow documents and their source or rendered diagrams;
- notation and requirements-language standards;
- generic documentation-structure and topic-growth rules;
- generic harness-validation and governed diagram-rendering tools, fixtures, version manifests, and configuration;
- neutral editor, ignore, lint, and issue-form configuration that is part of the generic harness rather than a selected product technology;
- harness decision records whose subject and consequences remain valid for every exported project.

Preserve executable permissions and relative paths for copied tooling.

### Recreate or sanitize

Use this class when a structural file is needed but its current contents mix generic routing with source-product information. Typical examples are the root `README.md`, lifecycle-area `README.md` files, artifact-routing pages, a decision index after project decisions are removed, and tool manifests containing a source-project package name.

Recreate the file from the generic portions only. Keep its function and valid relative links, but remove source-product names, examples, selected technologies, populated artifact descriptions, and claims about work already performed. Do not silently rewrite a substantive governance rule merely to make it appear generic.

For expected artifact paths, choose one consistent approach:

- create a neutral `draft` scaffold from the canonical template; or
- retain only a neutral directory or routing page and leave the artifact absent until its owning skill creates it.

Whichever approach is used, all links in the exported harness must resolve and the result must not imply that product discovery or design has already occurred. For grown topics, preserve the repository's topic-growth contract: a routing `README.md` and its declared same-named topic document must either both exist or both be omitted.

### Exclude

Always exclude:

- `.git/`, Git worktrees, repository history, remotes, hooks, and local Git metadata;
- the export destination itself and any staging directory used to build it;
- `frontend/`, `backend/`, application source, product tests, database migrations, and product build files;
- requirements, source evidence, glossary content, actors, domains, use cases, business objects, UX artifacts, and product diagrams from the source product;
- source-product software architecture, entity models, security architecture, technology selections, prototypes, implementation guidance, test scenarios, deployment architecture, local runtime instructions, project management, release backlog, scope, stakeholder, and risk content;
- project-specific decision records and their index entries;
- product-specific issue data, project-board data, CI/CD configuration, deployment configuration, and environment configuration;
- secrets and local configuration such as `.env`, credentials, tokens, keys, certificates, account identifiers, machine-specific paths, and editor-local state;
- dependency installations and caches such as `node_modules/`, `.cache/`, Maven or Gradle caches, virtual environments, and downloaded tool binaries;
- generated application outputs such as `target/`, `dist/`, coverage, reports, test results, logs, PID files, databases, uploads, and temporary files;
- operating-system metadata such as `.DS_Store`;
- product-specific root files such as application compose files, selected runtime-version files, product package manifests, and implementation-specific examples;
- symlinks whose target is outside the exported tree or whose safety and portability are not established.

Do not copy `.env.example` automatically. Include a replacement only when it documents a genuinely generic harness tool, contains no sensitive or product-specific value, and is required for that tool to work.

### Resolve ambiguity

If a file combines inseparable generic and product-specific policy, or if licensing, authorship, external-service configuration, or a decision record's applicability is materially ambiguous, present the user with the path, proposed treatment, and consequence before including it. Do not block on routine cases whose classification follows directly from these rules.

## Construct safely

1. Require the final destination not to exist. If `new-project` already exists as a file, directory, or symlink, stop and report it. Never merge, clean, replace, or recursively delete it.
2. Build in a newly created staging directory under the repository root or another safe writable location. Record that exact path and exclude it from source discovery.
3. Copy only inventory entries classified for inclusion; do not begin with an unrestricted recursive copy followed by deletion.
4. Preserve directory layout, file contents, and executable modes for verbatim generic material.
5. Recreate neutral routing and scaffold files only where the inventory requires them. Repository artifacts are written in English unless the exported rules specify otherwise.
6. Rebuild indexes so they list exactly the exported skills, templates, decisions, and governed resources. Preserve stable identifiers of copied generic decision records; do not renumber them to hide excluded records.
7. Ensure every directory under `docs/` contains the `README.md` required by the repository rules. Immediate directories under `.agents/skills/` contain `SKILL.md` and no redundant `README.md`; the skills collection retains its index.
8. Give the exported root a neutral entrypoint that directs readers to `AGENTS.md`, `docs/README.md`, and the initial product-definition workflow without naming or describing the source product.
9. Do not run package installation, network access, Git initialization, commits, pushes, or external issue-tracker synchronization as part of this skill.
10. Only after validation succeeds, move the completed staging directory to the final destination. If validation fails, leave the source untouched, do not publish a partial final destination, and report the staging location and failures.

The export must not modify any source file. Compare source version-control status before and after construction and investigate any unexpected source change before reporting success.

## Validate the empty harness

Validate both preservation of the harness and absence of source-product content.

At minimum:

1. Inventory the final tree and confirm that `frontend/`, `backend/`, `.git/`, dependency directories, build output, caches, secrets, and runtime data are absent.
2. Confirm that all expected rules, skills, templates, generic governance, SDLC material, standards, agent workflows, workflow diagrams, and generic supporting tools are present.
3. Compare copied-verbatim files with their sources using hashes or byte comparison.
4. Search text and filenames for the source-product name, product identifiers, package namespaces, personal paths, repository URLs, selected product technologies, and known artifact-specific terms. Review every hit; do not rely only on one project-name search.
5. Check Markdown links, routing pages, indexes, template references, skill-relative paths, and topic-growth invariants.
6. Validate every exported `SKILL.md` with the available skill validator when practical.
7. Run the exported harness's own documentation validation without installing dependencies when the required runtime is already available. If a check cannot run without installation or network access, perform the feasible static checks and report the limitation.
8. Confirm that the Product Vision workflow can locate its rules, template, documentation entrypoint, and intended artifact location entirely within the exported tree.
9. Confirm that the source working tree has no export-induced changes.

Do not weaken a validator or delete a generic rule merely to make the export pass. Correct the classification, sanitized routing, scaffold, index, or link that caused the failure.

## Report

Report:

- the absolute final export path;
- the generic areas copied verbatim;
- structural files recreated or sanitized;
- project-specific areas excluded;
- any ambiguous file resolved with the user;
- validation commands and results;
- skipped checks and residual limitations;
- confirmation that no Git repository was initialized and no source files were modified.

Do not claim that the directory is ready until the final tree, links, skill entrypoints, exclusions, and source-tree integrity have been checked.
