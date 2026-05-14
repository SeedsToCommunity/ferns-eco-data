# The Trust Layer

A piece of infrastructure that lets people work from the sources their context calls for.

---

The data layer of an ecological commons can hold hundreds of thousands of sources. Citizen science projects, research datasets, nursery records, park inventories, regional floras, herbarium databases, observation programs, seed collection logs, government surveys, community projects. Each one is real ecological knowledge produced by people who care about something specific — a region, a taxon, a method, a question. The substrate has room for all of them, and over time it will fill.

This is good. It is also overwhelming.

Some sources are more rigorous than others. Some have decades of curation behind them; some are weekend projects by enthusiasts; many sit somewhere in between. Most focus on a particular domain — a geographic region, a kind of organism, a category of observation, a stage of research. None of them is the right answer for every question. Each is the right answer for some questions.

For a subject matter expert, this proliferation is navigable. They know which regional flora to consult for their region. They know which observation network is rigorous enough for their work. They know which nursery's data they trust because they have visited the operation. The judgments are real and they are useful, but they live in the expert's head, learned through years of practice.

For a homeowner, a student, a person curious about the plants in their yard, the same proliferation is crushing. There is no way to know what to trust. The wall of sources looks the same from the outside, and choosing among them seems to require already knowing the answer.

The trust layer addresses this asymmetry. It lets the expert's judgment become a named, shareable object — a trust group. A trust group is an ordered set of tiers, each tier holding the sources that the group's author considers most appropriate for a particular context of work. Someone in Southeast Michigan working on native plants might define a trust group whose top tier is Michigan Flora, MNFI, Wild Type, and a regional seed program — sources that are local, careful, and trusted by the community of practice in that region. A second tier might hold broader regional sources whose information overlaps usefully but is less locally specific. A third tier might hold global aggregators that fill gaps when the first two are silent.

The point is not that this is the correct ranking. The point is that this is somebody's ranking, made deliberately, in the open, for a particular kind of work. Other people doing different work in different places will have different rankings, and those will also be correct for their contexts. The trust layer treats every group as equally legitimate at the data layer. It does not endorse. It records and exposes.

Applications consume trust groups. An application given a trust group can answer a question without dragging the user through the wall of sources. It reaches for the top tier first, falls through to lower tiers if needed, and stops when it has an answer. The user sees an answer grounded in sources their community trusts. The application did not have to invent its own judgment; it inherited the practitioner's. The judgment is legible — anyone can ask which sources were consulted, in which order, and why.

This is a small social action with infrastructural consequences. A practitioner who publishes a trust group is sharing what they trust, for what kinds of work, in their context. The act of defining the group is the act of making implicit knowledge explicit. Other practitioners can adopt the group as-is, fork it, argue with it, learn from it. Communities of practice acquire a shared artifact that previously lived only in conversations and apprenticeships.

The architecture is straightforward. A trust group is a record in a database. Its tiers are ordered. Its members are FERNS sources. An API exposes the group's contents as a tier-organized list. The data layer is not modified. The source response payloads are not modified. The trust group is a view onto the existing registry, nothing more. The discipline is in keeping it that small — refusing to let the trust layer accrete features that would make it a second source of ecological judgment rather than a record of practitioner judgment.

In time, the artifact accumulates. A university department working on Great Lakes restoration ecology can publish the trust group its members rely on, and the applications built on top of FERNS can translate that group into answers a homeowner can use. A native plant nursery can publish the group it uses for plant identification queries from customers. An indigenous-led restoration project can publish the group it uses for its work, with the sources it considers appropriate for that work, in the order that work calls for. Each group is a small contribution. Each one helps someone who would otherwise have been crushed by the wall.

The trust layer is the second of several perspective layers in the Ecological Commons. The naming layer makes a claim about whose names count at the data layer — none privileged, all addressable, every equivalence attributed. The trust layer makes a parallel claim about whose judgment counts at the application layer — no global ranking, every context's preferences first-class, every grouping legible. Both layers refuse to embed authority in the substrate. Both leave room for communities to be themselves.

A proof-of-concept implementation is being built. The first applications to consume trust groups will be local to Southeast Michigan, because that is where the operator is. Other practitioners, in other places, with other priorities, are exactly the people the layer is built for. Operational integration with applications, partnership with communities whose practitioners want to publish trust groups, and release of the architectural pattern for adoption by other projects are the work that follows.

---

*The Trust Layer is documented in detail in a technical specification. People interested in the architectural reasoning, the implementation, or potential collaboration can reach the Ecological Commons at the contact address on the main page.*
