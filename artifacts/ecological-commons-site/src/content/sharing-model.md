# The Sharing Model

A commons requires clear rules about who can draw from it and under what conditions. Elinor Ostrom identified this as one of the fundamental design requirements for any commons that intends to persist: the rules must match the conditions, and participants must understand what they owe each other. For a commons of ecological data, licensing is how those rules are expressed. It makes the commons legible — to applications, to organizations, to automated systems, and to participants who need to know what they can build and what they must give back.

Ecological Commons does not hold all data under one arrangement. Different organizations come with different needs and different degrees of trust they are ready to extend. Some want to contribute data with no restrictions so it becomes as reusable as possible. Some want their work credited in whatever gets built from it. Some want to ensure that anything built on their data stays open — that the commons is not enclosed by whatever comes next. All of these are legitimate. The commons is designed to hold them honestly.

## Why licensing is first-class metadata

Applications, agents, and organizations building on ecological data do not all operate under the same conditions. A volunteer organization might need data that is freely usable for any purpose. A commercial application might be able to work with attribution-required data but not data that requires derivatives to remain open. A community project might specifically seek data that commits to reciprocal sharing.

If licensing is not tracked, exposed, and queryable, then every builder has to reason about it independently — or ignore it, which creates legal risk and provenance confusion. Ecological Commons treats licensing as part of the description of each source from the start. This allows applications and agents to filter sources by licensing compatibility before they ever make a query.

## Supported sharing levels

Ecological Commons currently recognizes three Creative Commons licensing levels. They represent a range of sharing arrangements, from complete release to the public domain to reciprocal commons commitment.

| License | Meaning | Commercial Use | Modification | Redistribution | Attribution Required | Share-Alike Required |
|---|---|---|---|---|---|---|
| CC0 | Public domain dedication | Yes | Yes | Yes | No | No |
| CC-BY | Attribution required | Yes | Yes | Yes | Yes | No |
| CC-BY-SA | Attribution + share-alike | Yes | Yes | Yes | Yes | Yes |

**CC0** is a full release to the public domain. No attribution is required and no conditions are attached. Datasets released as CC0 are designed for maximum reuse — by applications, agents, and other systems — with no legal friction. This level is appropriate for foundational ecological infrastructure: reference species lists, interoperability schemas, and raw observation data whose value lies in its widest possible circulation.

**CC-BY** requires attribution. The source organization's name travels with the data and with whatever is built from it. This is likely the most common level for ecological datasets from programs and institutions that want their work credited while still enabling broad use. The attribution requirement is real, not ceremonial — it preserves visible provenance, which matters in ecological work where the origin of a recommendation affects how much it should be trusted.

**CC-BY-SA** requires both attribution and reciprocal sharing. If a system builds on CC-BY-SA data and produces derivative data, that derivative must remain open under the same license. This level is designed to protect the commons from enclosure. It ensures that what grows from shared knowledge stays shared. It aligns well with community-curated datasets and collaborative stewardship programs whose purpose is explicitly non-proprietary.

## Provenance and federation

Ecological Commons does not erase source identity. Every dataset is described with its original organization, source location, relevant timestamps, and licensing terms. Different ecological organizations often disagree — they may classify the same species differently, use different community typologies, or weight different restoration goals. Those differences are real and they are informative. The commons does not resolve them by synthesis. It preserves them by federation.

A commons built around honest provenance can be used carefully by whatever draws from it, whether that is a person, an application, or a system assembling an answer from multiple sources at once. The commons does not solve the question of which source to trust for which purpose — that is what the trust layer is for — but it gives every participant what they need to reason about it themselves.

## From accessible to reachable

A publicly available PDF is not ecological infrastructure. A downloadable spreadsheet is not ecological infrastructure. Data becomes infrastructure when it is machine-readable, queryable, attributable, and reusable by systems that do not require a human intermediary for each use. What the commons offers is not visibility — many systems make data visible. The commons makes data reachable, under known licensing terms, with preserved provenance, so that the knowledge it holds can be put to work by anyone with the capacity to build against it.
