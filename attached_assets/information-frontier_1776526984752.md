# An information frontier

*Why shared data infrastructure requires more than engineering*

Suppose you build a system that makes ecological data from dozens of public sources findable, reachable, and usable through a consistent interface. The technology is proven. The companion pages on this site describe the technical components. Now suppose you want the system to serve practitioners beyond your own region, to get heritage programs and universities to contribute their data, and to persist for decades. This is where the technical problem ends and a different class of problem begins. Decades of research in information science and commons governance have identified these problems, why they are hard, and what makes solutions work. The following concepts are operational requirements for any shared data infrastructure that intends to scale.

## Knowledge infrastructures are social systems, not just technical ones

A knowledge infrastructure is the full network of people, institutions, standards, practices, and technologies that together produce, share, and maintain knowledge. The term was formalized by Edwards, Borgman, Bowker, and colleagues at a 2012 workshop at the University of Michigan. Their central finding: the technical systems are only one layer. The infrastructure also includes institutional agreements about who contributes data, professional norms about how data is described, funding models that keep systems running, and social relationships that make collaboration possible. When shared data systems fail, the cause is almost never a software bug. It is a breakdown in the social or institutional layer the software depends on.

## Data friction and institutional trust

Organizations that hold valuable data routinely decline to share it, even when sharing would benefit everyone. Contributors worry about losing credit, about others misinterpreting data collected under specific conditions, about revealing gaps in their records, and about losing control over how their data is represented. Researchers call this data friction — the social and institutional resistance that prevents data from moving between organizations. The friction is not technical. The data could be shared with a file transfer. The barriers are trust, credit, control, and incentive structures that reward data collection but not data sharing. Any system depending on multiple organizations contributing data must design for these barriers explicitly, or it will have excellent architecture and empty tables.

## Commons governance

In 1990, Elinor Ostrom demonstrated — and later received the Nobel Prize for showing — that communities worldwide have managed shared resources for centuries without privatizing them or handing control to a central authority. She identified design principles shared by long-enduring commons: clear boundaries, rules matching local conditions, collective decision-making, community-accountable monitoring, graduated consequences, accessible conflict resolution, and nested governance connecting local management to larger systems. Recent work has applied these principles to digital data commons, finding that the same logic holds: shared data infrastructure needs clear rules about who contributes, who benefits, how decisions are made, and how the system sustains itself. Without these structures, shared systems collapse through neglect or get captured by the most powerful participant.

## Boundary objects and coordination without consensus

Different communities can collaborate around shared artifacts even when they understand those artifacts differently. Star and Griesemer identified this pattern in 1989, studying how amateur collectors, professional scientists, and administrators all contributed to a natural history museum despite having different goals. The shared artifacts — specimens, field notes, standardized forms — were flexible enough to serve each group while stable enough to hold the collaboration together. In shared ecological data infrastructure, species names, community classifications, and site data function the same way: a restoration practitioner, a network ecologist, and a nursery owner all use them differently, but they need the same underlying data. Designing shared reference points that serve multiple communities without forcing consensus is an active design challenge, not a technical default.

## FAIR principles and data stewardship

The FAIR principles — Findable, Accessible, Interoperable, Reusable — published in 2016, are the international standard for scientific data management. They require rich metadata, searchable repositories, machine-readable formats, and clear licensing. The CARE principles for Indigenous Data Governance extend this to address collective benefit, authority, responsibility, and ethics — recognizing that technical accessibility does not resolve who should control data and who should benefit. GBIF, the largest biodiversity data aggregator with over two billion records, has adopted both frameworks. Any new ecological data infrastructure operates within this established landscape of principles, standards, and expectations.

## Bridging expert data and public use

Most shared data infrastructure is designed by researchers for researchers. The interfaces assume users who understand domain vocabulary and conventions. But the people making daily decisions about landscapes — homeowners, volunteer crews, municipal land managers, school garden coordinators — need the same underlying knowledge delivered in forms they can act on without a graduate degree. A homeowner deciding what to plant deserves to know whether a recommendation comes from a state botanist or an algorithm, but the interface and framing must differ fundamentally from a research dashboard. Serving both audiences from the same data layer — without dumbing down the data or overwhelming the practitioner — is a design problem at the intersection of information science, ecology, and community engagement that most data infrastructure simply ignores.

## Infrastructure sustainability

Building shared data infrastructure is easier than sustaining it. Systems depending on a single grant, a single maintainer, or a single institution routinely fail when that support disappears. The systems that persist — GBIF (2001), ICPSR (1962), the Catalogue of Life (2001) — share common characteristics: distributed governance so no single withdrawal is fatal, sustained value to enough stakeholders that defunding becomes politically costly, and communities of practice that maintain institutional knowledge across personnel changes. Sustainability is not an afterthought. It is a design requirement that shapes architecture, governance, and partnership strategy from the beginning.

## Designing for careful use

A commons of this kind will be used in ways its designers cannot fully anticipate. People will reach into it directly. Software built on top of it will reach into it on behalf of people. New kinds of tools, including ones that leverage powerful capabilities that did not exist a few years ago, will be built against it. Some of that software will be written by hand. Increasingly, much of it will be assembled by automated systems working from specifications.

None of this is categorically new. Any system built on powerful capabilities — a library, a database, a service, a model — has to be designed with care for failure cases and the assumptions built into it. Systems that ignore this tend to fail in ways that are structural rather than intentional: the component did what it was designed to do, but something outside the system changed, or an assumption the designer made turned out to be wrong.

For a commons of ecological knowledge, the implication is simple. A source described honestly — what it is, who made it, how it was derived, what it does and does not cover — is a source that can be used carefully by whatever is consuming it, whether that is a person, a piece of software, or a system assembling an answer from many sources at once. The commons does not have to solve every question of trust and safety in how its data gets used. It has to be honest about what it holds, so that the systems built on top of it have something real to reason about.

## Why this matters for scaling

Everything above has the same implication: a technically successful system for one region does not automatically become infrastructure that works across regions. Scaling requires solving institutional trust, commons governance, boundary object design, FAIR-compliant stewardship, practitioner-facing interfaces, and long-term sustainability — none of which are engineering problems.

If the goal is a restoration tool for one community in Southeast Michigan, the technical components alone are sufficient. If the goal is a commons that enables any community, anywhere, to reach the ecological knowledge they need to steward their landscape, then every concept on this page is a prerequisite — and each one represents a body of research and practice that already exists and is ready to be applied.
