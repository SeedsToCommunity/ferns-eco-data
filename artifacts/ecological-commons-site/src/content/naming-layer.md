# The Naming Layer

A piece of infrastructure that lets people reach ecological knowledge from the names they actually use.

---

Living things are known by many names. A plant in a Michigan field has a name in scientific Latin. It has names in English — sometimes several. It has names in other European languages, in indigenous languages of the people who lived alongside it before it was first written down by botanists, in regional vernaculars used by gardeners and naturalists, in the conventions of programs that grow it and share it. None of these names is wrong. None is more correct than another. Each is a real name, used by real people, in a real context.

Existing ecological data systems do not treat the names this way. They pick one form — almost always scientific Latin — as the canonical identifier, and treat all other names as labels attached to the canonical form. A community whose primary naming tradition is not Latin is required, structurally, to translate itself into Latin to participate in shared infrastructure. The translation is not neutral. It encodes a hierarchy that the underlying realities do not support.

The Naming Layer takes a different approach. It treats every name as a node in a graph. It treats every assertion of equivalence between names as an edge with provenance — who said two names refer to the same thing, on what basis, when. It treats a species concept as whatever connected component emerges from the graph, not as a pre-declared identifier owned by a particular naming tradition. No naming tradition is structurally privileged. A user from any tradition can ask the layer what is known about a name in their tradition, and the layer will return what was asserted, by whom, on what basis.

## How it works

The layer is a graph with two kinds of elements: names and equivalence claims.

A name is any string used to refer to a living thing, along with enough context to make it meaningful — what tradition it comes from, who uses it, what scope it covers. A name does not need to be globally unique. It does not need to be verified against an external authority. It needs to be real: someone, somewhere, uses it to refer to something.

An equivalence claim is an assertion that two names refer to the same thing. The claim carries provenance — the source making the assertion, the basis for the assertion, the date, the confidence. Claims can come from published synonymy databases, from taxonomic authorities, from community contributions, from the operational behavior of data sources. They are recorded as claims, not as facts. Two sources can make contradictory claims. The layer records both and does not adjudicate.

A species concept, in this model, is whatever set of names are connected by claims in the graph. It is not pre-declared. It emerges from the contributions. When a new claim is added, the graph may merge what were two separate concepts, or split one. The shape of the knowledge space is determined by what the community knows and has asserted, not by what any single authority has declared.

## The layer learns from use

Each time a name is sent to a data source, the layer records what happened. A name that was accepted by a source — that returned data — is operational knowledge of how that source behaves. A name that was rejected is also knowledge. Over time, the layer accumulates a precise map of which names work at which sources, which translations are needed, and which sources have no record of a given concept at all.

This operational knowledge is first-class data in the layer. It is not derived from the graph; it is observed from the world. When a source changes its naming conventions, the layer learns from the first failed lookup. When a new source is added, its naming behavior is discovered incrementally, query by query.

The effect is that subsequent queries are fast. The layer does not re-derive what it already knows. A name that has been resolved once is resolved for everyone who comes after. Communities bringing unfamiliar names to the layer pay a first-time cost in discovery. After that, their names are as fast to resolve as any other.

## Community contributions

Communities can contribute names and equivalence claims as first-class graph contributions. A community member adding a name from their tradition is making the same kind of contribution that a major synonymy publisher makes — recorded, attributed, available alongside every other assertion.

The data layer does not pick a winner among contributors. It records what was said, by whom, on what basis, and lets the application or the user choose what to honor. A researcher who trusts a specific taxonomic authority can configure their tool to weight those claims. A community that considers their traditional names primary can configure their tools accordingly. The layer carries the full record; what gets foregrounded is a choice made above it.

This is, structurally, a small piece of infrastructure. The architecture is straightforward to implement and uses standard technology. What is unusual about it is what it refuses to do: it refuses to designate any naming tradition as canonical, refuses to invent equivalences the system was not told about, refuses to merge belief and operational behavior into a single fact. The discipline is in keeping the system small and honest, so that every layer built on top inherits the symmetry the graph was designed to preserve.

## Where it sits

The Naming Layer is part of the Ecological Commons. It sits above the data layer of integrated sources and below the applications that people build to ask questions of the living world. The architecture has been designed in detail and is documented in a technical specification. Implementation, integration with a wide range of sources, partnership with communities whose naming traditions have been historically under-documented, and release of the architectural pattern for adoption by other commons are all work that lies ahead.

---

*The Naming Layer is documented in detail in a philosophy document and a technical specification. People interested in the architectural reasoning, the implementation, or potential collaboration can reach the Ecological Commons at the contact address on the main page.*
