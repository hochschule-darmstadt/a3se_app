# Bounded Contexts

- Status: accepted
- Owner: Requirements
- Last reviewed: 2026-07-31

Bounded contexts divide the tour operator enterprise into explicit business boundaries with distinct responsibilities, language, and owned information.

## Overview

![Tour operator bounded-context overview](overview.svg)

The diagram uses nested UML packages for the enterprise, layers, and bounded contexts.

## Bounded contexts

| Context | Purpose | Layer | Owned information |
|---|---|---|---|
| Customer Interaction | Provide customers with seamless interaction with the tour operator and its travel advisor across supported channels and devices | Interaction | Customer-facing interaction |
| Travel Product Design | Design package travel and compose individual travel from travel services | Core Business | Travel compositions and itineraries |
| Procurement | Obtain stock services and establish access to on-demand sourced services | Core Business | Procurement terms and purchased capacity |
| Sales | Guide customers toward an orderable composition and sale price | Core Business | Sales interaction and commercial offer |
| Travel Execution | Coordinate the activities needed to carry out ordered travel | Core Business | Execution state and coordination |
| Customer Management | Maintain customer information needed across the tour operator cycle | Resources | Customer records |
| Travel Product Management | Maintain travel products and travel services independently of their use in specific travel | Resources | Travel products, travel services, and availability inputs |
| Order Management | Maintain the central record for ordered travel | Resources | Travel orders and their lifecycle |
