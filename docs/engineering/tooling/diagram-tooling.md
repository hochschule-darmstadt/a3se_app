# Diagram Tooling

- Status: accepted
- Owner: Engineering
- Last reviewed: 2026-07-21

The toolchain implements [ADR-0001](../../governance/decisions/0001-diagrams-as-code-toolchain.md). Sources are authoritative; SVGs are derived review artifacts.

## Prerequisites

- Node.js 22
- Java 17 or newer
- Docker for Structurizr
- PowerShell 7 on Windows, or a POSIX shell on Linux/macOS

No global npm packages are needed. Do not send private diagram sources to public rendering services.

## Install

Windows PowerShell:

```powershell
./tools/diagrams/install.ps1
```

Linux or macOS:

```sh
sh tools/diagrams/install.sh
```

The scripts run `npm ci`, download the checksum-verified PlantUML JAR into the ignored `.diagram-tools/` directory, pull the pinned Structurizr image, and run a toolchain health check. Run installation again after `package-lock.json` or `versions.json` changes.

## Check the installation and sources

```sh
npm run diagrams:doctor
npm run diagrams:validate
```

Validation discovers `.puml`, `.mmd`, and `.bpmn` sources throughout the repository. It checks PlantUML syntax, renders Mermaid into a temporary SVG, and applies the recommended BPMN correctness/style rules. Structurizr validation is activated when the first `workspace.dsl` is added.
Small sources under `tools/diagrams/fixtures/` ensure that all three default notation paths are exercised even before product diagrams exist.

Render a UML, Mermaid, or BPMN source to SVG:

```sh
npm run diagrams:render -- path/to/source.puml path/to/generated/source.svg
```

The second path is optional and defaults to an SVG beside the source. For C4, use the pinned Structurizr container so every view is derived from `workspace.dsl`; the concrete export command will be added with the first architecture workspace because its view and output policy are not yet defined.

## Authoritative formats

| Concern | Source | Tool |
|---|---|---|
| UML and STRIDE data-flow diagrams | `.puml` | PlantUML |
| Conceptual/logical data views | `.puml` | PlantUML UML or Information Engineering notation |
| C4 model and views | `workspace.dsl` | Structurizr |
| BPMN 2.0 processes | `.bpmn` | bpmnlint, bpmn-js-based SVG renderer, bpmn.io/Camunda-compatible editor |
| Lightweight explanatory diagrams | `.mmd` | Mermaid CLI |
| Strategic DDD context maps | `.cml` | Context Mapper 6.12.0, opt-in |

Low-fidelity wireframes may be stored as reviewable SVG/image artifacts during discovery; after UI technology selection, prefer accessible executable HTML/CSS prototypes. The current tools cover the project's formal business, architecture, data, process, interaction, deployment, and threat-model views. D2 is intentionally not part of the project toolchain because it would overlap these capabilities without adding a required notation.

Use the recommended VS Code extensions in `.vscode/extensions.json` for previews and interactive editing. Extensions are conveniences; repository validation is authoritative.

## Version upgrades

Upgrade one tool at a time. Update the exact version and checksum, regenerate the npm lockfile when applicable, render representative diagrams, run validation, review visual and semantic differences, and record material consequences in an ADR. Never replace a pinned version with `latest`.

## Agent rules

An agent must edit the notation source rather than SVG output, use stable project identifiers in labels or metadata, validate before reporting completion, and visually inspect meaningful renders. A successful parser does not prove that a diagram expresses the intended business meaning.
