# Logical Data Model

- Status: proposed
- Owner: Architecture
- Last reviewed: 2026-08-03

This technology-neutral logical model defines generic entity structures owned by Resources modules in the accepted [software architecture](../software-architecture/software-architecture.md). It was produced by iteratively refining the accepted [business objects](../../requirements/business-objects.md): recurring party roles and item structures were generalized while concrete business meaning remains expressed through types, properties, and relationships.

It does not prescribe database tables, foreign keys, graph labels, collections, persistence annotations, or a database product.

## Overview

![Logical data model](data-model.svg)

Arrows show conceptual references across entity and module boundaries; they do not by themselves require object navigation or database foreign keys.

## Concrete object usage

The following synthetic object diagram illustrates how the generic logical data model is used for one comprehensive travel example. It is explanatory architecture evidence, not a physical database design or additional requirements source.

![Concrete object example](objects.svg)

John and Sarah are Persons playing customer/traveler roles. Supplier Organisations play airline and hotel roles. Recursive TouristicProductItems describe a flight with seats and a hotel room category with a room; corresponding StockItems make dated capacity sellable; OrderItems connect the customer and travelers to the allocated stock.

## Semantic property contracts

Keys and coded values in generic `properties` collections shall use established touristic vocabularies and standards where suitable, for example OpenTravel Alliance (OTA), International Air Transport Association (IATA), and International Civil Aviation Organization (ICAO) specifications. Each adopted vocabulary, version, and any project-specific extension shall be identified explicitly; similar local terms shall not silently replace an applicable standard term or code.

The module that owns an entity shall also own an executable property validator or equivalent declarative rule set. Its rules shall define, at minimum:

- the entity types to which each property applies;
- whether a property is mandatory, optional, conditionally required, or prohibited;
- its datatype, cardinality, format, unit, and permitted vocabulary or value set;
- cross-property and temporal constraints, such as `start < end`; and
- the applicable rule and vocabulary versions.

Owning modules shall validate properties at their boundaries before accepting state changes. Interaction and Core Business Process modules shall consume the owning module's validation result rather than duplicate its semantic rules. Validation failures shall identify the violated rule sufficiently for the calling module to present or handle the error without exposing the Resource module's internal model.

## Entities and module ownership

| Resource module | Entity | Meaning |
|---|---|---|
| Customer Management | `Person` | A natural person identified by person-specific properties such as name. |
| Customer Management | `PersonRole` | A contextual role played by a Person, such as customer or traveler, with role-specific properties. |
| Supplier Management | `Organisation` | An organization identified by organization-specific properties such as name. |
| Supplier Management | `OrgaRole` | A contextual role played by an Organisation, such as supplier, airline, or hotel, with role-specific properties. |
| Touristic Product Management | `TouristicProductItem` | A typed reusable touristic product element. Recursive relationships allow composite structures such as a flight type with seats or a room category with rooms. |
| Inventory | `StockItem` | A dated, priced, or otherwise qualified unit of pre-procured sellable stock. Recursive relationships allow stock groupings. |
| Order Management | `OrderItem` | A typed order or ordered component. Recursive relationships allow an order to contain its components. |

## Associations

- A `PersonRole` belongs to a `Person`.
- An `OrgaRole` belongs to an `Organisation`.
- A `TouristicProductItem` may contain or specialize other `TouristicProductItem` instances and refers to the supplying `OrgaRole` where relevant.
- A `StockItem` represents inventory for a `TouristicProductItem` and may participate in a recursive stock structure.
- An `OrderItem` may contain other `OrderItem` instances, refers to the allocated `StockItem`, and links relevant customer/traveler `PersonRole` instances.

Every entity has exactly one owning module. Cross-module associations remain visible because they explain the business graph, but implementation must preserve module encapsulation through identifiers, representations, or module interfaces.

## Modeling consequences

The generic model deliberately avoids a separate physical entity class for every product subtype or business role. `type` selects the semantic kind and `properties` holds kind-specific information at this logical level. The [semantic property contracts](#semantic-property-contracts) require established touristic vocabularies and owning-module validation. Before implementation, accepted rules must define supported types, property schemas, vocabulary versions, identifiers, multiplicities, and lifecycle constraints. A technology decision must evaluate how those varying structures can be represented without sacrificing validation or queryability.

## Limitations and open questions

- Exact association multiplicities and delete/lifecycle semantics remain to be specified.
- Concrete type catalogs, property schemas, and adopted vocabulary versions remain open; properties must not become uncontrolled free-form data in implementation.
- Prices, dates, addresses, payment methods, identifiers, and personal data require explicit value types, classification, and validation.
- Historical snapshots versus live references must be decided per cross-module relationship.
- Customer-time on-demand sourcing remains excluded by [SE-002](../../requirements/scope-exclusions.md); `StockItem` represents capacity procured before sale.
