# On Names and Translation

A piece of infrastructure that lets people reach from the names they know to any ecological knowledge tradition.

---

Living things are known by many names. A plant is named by indigenous people who use it. It has names given by scientists as Latin binomials. It has names in regional vernaculars used by gardeners and farmers. Each is anchored in a particular relationship between a human community and the world.

Current practice in the prevailing ecological data systems picks one name form as the identifier and treat all other names as subservient labels. A community whose primary naming tradition is not Latin is required, structurally, to translate itself to participate in that shared infrastructure. That translation is not neutral. It encodes an unnecessary hierarchy among those human communities.

This commons takes a different approach to names. It treats every name as a node in a large relationship graph. It treats every assertion of equivalence between names as an edge with provenance (who said two names refer to the same thing, on what basis, when). It treats a species concept as whatever connected components emerge from the graph, not as a pre-declared identifier owned by a particular naming tradition. Since no naming tradition is structurally privileged, a user from any tradition can ask the layer for an answer from any source, and the layer translates between traditions at query time.

This is infrastructure that allows any dataset to be used by others, no matter when that dataset was created, how it was encoded, or how recently it was refined.

The name layer learns from use. Each time a name is sent to a source, the layer records what happened. Names that are accepted by a source accumulate as operational knowledge of how the source behaves. Subsequent queries are fast because the layer remembers. Queries from naming traditions that are new to the layer pay a small first-time cost, and then are fast for everyone who comes after.

Communities can contribute names and equivalences as first-class graph contributions. A community member adding a name from their tradition is making the same kind of contribution that a major synonymy publisher makes — recorded, attributed, available alongside every other assertion. The data layer does not pick a winner among contributors. It records what was said, by whom, on what basis, and lets the application or the user choose what to honor.

This is, structurally, a small piece of infrastructure. The architecture is straightforward to implement and uses standard techniques. What is unusual about it is what it refuses to do: it refuses to designate any naming tradition as canonical, refuses to invent equivalences the system was not told about, refuses to merge belief and operational behavior into a single fact. The discipline is in keeping the system small and honest, so that every layer built on top inherits the symmetry rather than inheriting arbitrary hidden privileges.

A name translation function must be part of any ecological commons. It sits above the data sources and below the applications that people build. The architecture has been designed and is documented in a technical specification. Implementation, integration with a wide range of sources, and partnership with communities are the work that follows.

---

*This commons' naming layer is documented in detail in a philosophy document and a technical specification. People interested in the architectural reasoning, the implementation, or potential collaboration can reach the Ecological Commons at the contact address on the main page.*
