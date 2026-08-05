# Business Domains

- Status: accepted
- Owner: Requirements
- Last reviewed: 2026-08-05

This model divides the Christopher Columbus Travel problem space into business domains with a coherent purpose and language. Core and Supporting Business Processes are categories used to arrange the domains; they are not additional domains or software layers. A domain is an initial candidate for a software module, not a predetermined implementation boundary. Architecture refinement may combine responsibilities, retain interaction modules without corresponding business domains, or extract reusable resource modules.

## Overview

![Business domain overview](domains.svg)

The diagram uses nested UML packages for the enterprise, domain categories, and domains. It describes the business problem space, not software layers, deployment units, interaction channels, or persistence ownership.

## Domain catalog

| Category | Domain | Purpose |
|---|---|---|
| Core Business Processes | Season Planning | Plan seasonal offerings and the capacity required to support them. |
| Core Business Processes | Procurement | Procure travel-service capacity in advance under agreed commercial terms. |
| Core Business Processes | Touristic Product Design | Design reusable package travel and compose customer-specific travel from touristic products. |
| Core Business Processes | Sales | Advise customers, create and validate commercial travel proposals, accept offers, and initiate orders. |
| Core Business Processes | Customer Care | Prepare ordered travel, deliver travel information and documents, and coordinate assistance during and after travel. |
| Supporting Business Processes | Accounting | Record and reconcile financial transactions and obligations through an external contract. |
| Supporting Business Processes | Reporting | Produce business information for oversight and decision support through an external contract. |
| Supporting Business Processes | Human Resources | Support workforce and organisational responsibilities through an external contract. |

Under [SE-001](../scope-exclusions.md), only the interfaces to Accounting, Reporting, and Human Resources are in implementation scope. Under [SE-002](../scope-exclusions.md), customer-time on-demand acquisition is excluded; Procurement covers capacity obtained before sale.

## From domains to modules

The accepted [modular software architecture](../../architecture/software-architecture/software-architecture.md) begins with these domains and then refines them. Season Planning, Procurement, Touristic Product Design, Sales, and Customer Care remain recognisable Core Business Process modules. Accounting, Reporting, and Human Resources remain external Supporting Business Process contracts.

Customer Interaction and Staff Interaction are solution-space modules that consolidate actor-facing web interactions across several business domains; they are not business domains. Person Management, Partner Management, Touristic Product Management, Inventory, and Order Management are extracted Resources modules because several domains need their information and lifecycle responsibilities.

This refinement is intentional: the domain diagram remains authoritative for problem-space decomposition, while the software architecture is authoritative for solution-space module boundaries.
