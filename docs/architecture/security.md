# Security Architecture

- Status: draft
- Owner: Architecture
- Last reviewed: 2026-08-17

No security architecture has been accepted. Security and privacy architecture must trace to relevant requirements, information sensitivity, trust boundaries, threats, operational responsibilities, and verification scenarios when those concerns are specified.

The proposed [localhost deployment architecture](../operations/deployment-architecture/deployment-architecture.md) identifies browser-to-loopback, Docker-network, application, and persistence boundaries. Loopback and container isolation are development controls only; they do not establish production authentication, encryption, secret distribution, segmentation, hostile-host isolation, or operational access. Production data and credentials are prohibited.
