# The Naming Layer

A piece of infrastructure that lets people reach ecological knowledge from the names they actually use.

---

Living things are known by many names. A plant in a Michigan field has a name in scientific Latin. It has names in English — sometimes several. It has names in other European languages, in indigenous languages of the people who lived alongside it before it was first written down by botanists, in regional vernaculars used by gardeners and naturalists, in the conventions of programs that grow it and share it. None of these names is wrong. None is more correct than another. Each is anchored in a particular relationship between a community and the world.

Existing ecological data systems do not treat the names this way. They pick one form — almost always scientific Latin — as the canonical identifier, and treat all other names as labels attached to the canonical form. A community whose primary naming tradition is not Latin is required, structurally, to translate itself into Latin to participate in shared infrastructure. The translation is not neutral. It encodes a hierarchy that the underlying realities do not support.

The Naming Layer takes a different approach. It treats every name as a node in a graph. It treats every assertion of equivalence between names as an edge with provenance — who said two names refer to the same thing, on what basis, when. It treats a species concept as whatever connected component emerges from the graph, not as a pre-declared identifier owned by a particular naming tradition. No naming tradition is structurally privileged. A user from any tradition can ask the layer for an answer from any source, and the layer translates between traditions at query time.

The layer learns from use. Each time a name is sent to a source, the layer records what happened. Names that are accepted by a source accumulate as operational knowledge of how the source behaves. Subsequent queries are fast because the layer remembers. Queries from naming traditions that are new to the layer pay a small first-time cost, and then are fast for everyone who comes after.

Communities can contribute names and equivalences as first-class graph contributions. A community member adding a name from their tradition is making the same kind of contribution that a major synonymy publisher makes — recorded, attributed, available alongside every other assertion. The data layer does not pick a winner among contributors. It records what was said, by whom, on what basis, and lets the application or the user choose what to honor.

This is, structurally, a small piece of infrastructure. The architecture is straightforward to implement and uses standard technology. What is unusual about it is what it refuses to do: it refuses to designate any naming tradition as canonical, refuses to invent equivalences the system was not told about, refuses to merge belief and operational behavior into a single fact. The discipline is in keeping the system small and honest, so that every layer built on top inherits the symmetry rather than inheriting a hidden privilege.

The Naming Layer is part of the Ecological Commons. It sits above the data layer of integrated sources and below the applications that people build to ask questions of the living world. The architecture has been designed in detail and is documented in a technical specification. Implementation, integration with a wide range of sources, partnership with communities whose naming traditions have been historically under-documented, and release of the architectural pattern for adoption by other projects are the work that follows.

---

*The Naming Layer is documented in detail in a philosophy document and a technical specification. People interested in the architectural reasoning, the implementation, or potential collaboration can reach the Ecological Commons at the contact address on the main page.*
