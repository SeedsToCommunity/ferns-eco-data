# Justifying the Structure

The Ecological Commons has a specific architecture. The data sources are described and kept as themselves, not absorbed into a single rewritten store. Trust is a named, declared layer that filters the data below it rather than a logic baked silently into applications. Names from all traditions and places are treated as first class knowledge, not labels attached to one true form. This page attempts to describe the architectural choices made and the reasonig behind them.

## Aspect 1 - Ecology is about relationships and place.

Plants, animals, fungi, soil, water, fire, weather, people, and history — all of them interacting with each other in each specific place over time. The work of ecological stewardship is the work of understanding those relationships: what depends on what, what was present and is now absent, what does balance look like, what does diversity look like.

Key Phrase: *Relationships in places, not facts about species.*

## Aspect 2 - The decisions that shape most places are made by non-experts.

Most of the land in any region is held by people who are not ecologists. Homeowners, landowners, municipal maintenance staff, volunteer boards, weekend stewards, neighbors with a backyard and some curiosity. The trained experts — the restoration ecologists, the botanists, the land managers with years of field experience — are vastly outnumbered. That gap matters because what aggregates into the ecological condition of a region is not what the experts decide to do with the land they manage. It is the daily, unremarkable decisions made by the many: what gets planted, what gets removed, what gets mowed, what gets left, what is valued by society. 

Key Phrase: *Aggregate decision-makers are not the experts.*

## Aspect 3 - People make most decisions alone, regardless of how many experts exist.

Face-to-face, inspired connections is irreplaceable for society. It is also demonstrably insufficient. Most decisions, in most domain, happen alone — at a kitchen table, in front of a screen, walking a piece of land before the nursery opens, at a hardware store with a phone and a question. Even in domains crowded with experts and workshops and online forums, the actual moment of decision is often private. Any system that pretends the alone-channel does not exist has missed the place where most of the work happens. We would argue for more in person sharing and systems that share hard earned wisdom at scale with everyone, everywhere. 

Key Phrase: *Face-to-face is necessary and insufficient; most decisions happen alone.*

## Aspect 4 - The data landscape is broken in three specific ways.

First, we are awash in information, challenged to judge, often without training or clear insight. Overwhelming volume, scattered across websites, books, seed catalogs, agency PDFs, extension bulletins, forum threads, and every manner of species descriptions written more for marketing than accuracy. A person trying to answer a real question in a real place has to read across all of it with no systematic way to evaluate what is reliable and what is not.

Second, significant sources are walled off. Some because of institutional incentives, some because of the shape of delivery, and some because of missing social cohesion. The sources that would matter most — rigorous regional flora, conservation status data, peer-reviewed phenology, field observation records — are often the hardest to reach personally and programmatically.

Third, the technology of access keeps moving. Books, then websites, then spreadsheets, then REST APIs, and now MCP protocols. The method will keep changing. Each generation of access opens what the prior generation could not reach, and makes implications inherent in the previous one obsolete. Knowledge that wants to be genuinely reachable has to be structured so that it can move with the access methods. 

Key Phrase: *Too much, walled off, and the methods of access keep moving.*

## Aspect 5 - New tools change what is possible.

Against this backdrop, a new class of tools has arrived. Called AI loosely, used with varying interpretations and perspectives of about what it actually is. It is definately a new tool class. Like chainsaws, fire, vehicles, propane, or chemicals ... AI has real failure modes and genuinely changes what is possible. The failure modes are themselves strage in comparison to other tools: confabulation, training bias, confident wrongness. 

A model that has absorbed the internet, Reddit, marketing copy and social media produces answers that mirror the quality level of what it was fed. Analysis that feeds on Michigan Flora, MNFI, BONAP, FQA analysis, peer-reviewed work, and field observations can produce amazing insight.

The current capabilities and the pace of advancement is also specific and real. For our domain, its not a replacement for experts. It could be a way to extend expert knowledge into all the alone-moments where most decisions actually happen. 

Key phrase: *New tool class, real failure modes, genuinely changes what is possible.*

## Aspect 6 - Make knowledge findable, well-described, reachable, and connected.

If the problem is that good data is hard to find, hard to use at scale, and the tools that could help are only as good as the data they are fed, then one concrete answer is to make existing data reachable and honored for what it is.

Every source is kept as itself. The commons describes each source in depth — what it covers, how it was made, what its limits are, who maintains it — and provides uniform ways to reach it. Keeping sources as themselves means keeping their authority, their governance, and their perspectives intact. Aggregation through absorption and assimilation does not a vibrant commons make.

Key phrase: *The tools are downstream of diverse data.*

Key phrase: *Describe and reach; never absorb.*

## Aspect 7 - Trust is a pillar of shared discipline

The data layer carries everything that each source and contributor has asserted, with provenance on every claim and every equivalence. 

Below this layer sits the full data layer: everything

Is is data rich, but still so operationally vast as to not be directly usable for most purposes. A homeowner asking what to plant in their backyard cannot reason about a maximalist provenance stream. A regional planting calculator does not need to present the full range of what every source has ever said about a species' cold hardiness. Most applications need to narrow the field before they present anything, and the question is where that narrowing happens and who structures it.

The trust layer is where it happens snd is the second constructive decision. Named trust scopes are declared here. Any kind or style of group can be shaped: peer-reviewed botanical sources only, Michigan-focused regional authorities, named community contributors plus major synonymy publishers. When using an application or creating your own, select any group that is appropriate. Each trust group is a filter on the full list of dats sources. An application running under a given scope sees only the claims and equivalences whose provenance the scope honors. 

The data layer below remains untouched and complete. The application layer above does not invent its own trust logic, quietly, in ways no one can examine. 

Key phrase: *Trust is a layer of named, declared scopes — applied above the data, exposed to the user, not silently defined.*

## Aspect 8 — No canonical name; every equivalence is an attributed claim

Living things are known by many names. Scientific Latin. Common local names. Regional vernaculars. The languages of communities who lived alongside these species for thousands of years. Each tradition is anchored in a particular relationship between a community and the world.

Indigenous botanical knowledge was, in many places and times, not just unrecorded but actively suppressed. Plants were renamed. Knowledge holders were displaced. The naming conventions that emerged through that period reflect that history — and the silence around what was lost was itself manufactured, not natural. The medicinal, food, ceremonial, and ecological knowledge carried by those traditions was detailed practice, often more developed than what replaced it.

We made two architectural decisions associated with this topic.

The first is that no naming tradition is structurally privileged within the name layer. Every name is a node in a graph. No node type sits above another. Scientific Latin, an indigenous community name, an English vernacular, and a name from a community seed program are all, structurally, the same kind of thing. They are distinguished only by what asserters have said about them.

The second is that every claim of equivalence between names is recorded structurally — who said two names refer to the same living being, when, and on what basis.

Whatever name a user knows is the center of a small search. The system walks outward from that input, finds what works against the data source, and shows the trail it took.

Key phrase: *No structurally privileged name; every equivalence is an attributed claim; the user's input is the center of the search.*

## Aspect 9 - The data commons is neutral; applications are opinionated

The fourth construction decision closes the argument. The commons data layer is not what anyone uses directly. What people use are applications and tools built on top — explorers, guides, decision tools, research interfaces, planning tools. An application for a homeowner in Southeast Michigan carries opinions about what sources to trust, what audience to serve, what trust scope to apply, how to present uncertainty, how to integrate whatever current generation of AI tools is useful. The commons carries none of those opinions. It stays neutral and source-faithful, with its provenance intact and its sources unchanged.

The separation is what makes the commons sustainable. If the commons were opinionated, every change in the technology landscape — every new access method, every new generation of AI tooling — would require the commons to change. Instead, applications adapt. The commons stays honest about its own job. New tools, new audiences, and new access methods produce new applications; the commons underneath them remains the same trustworthy substrate. *The commons is neutral; the applications are opinionated.*

## Aspect 10 - Three reciprocities

The aspects above are technical architecture, but they rest on something that is not technical. The commons holds three things in relationship, and the architecture is only sound if all three are held together.

The ecological is the content. A million years of evolution, specialization, and mutual adaptation — organisms in relationship with other organisms in specific places over deep time. The commons treats this as substance, not subject. It is the reason the architecture exists at all, not material the architecture freely conforms. Every decision described above — keeping sources as themselves, refusing a canonical naming tradition, making trust visible and attributable, keeping the commons neutral — is accountable, finally, to the ecological reality it exists to serve.

The technical is the shape and structure. Not the tools, not the code — the structural agreements that determine whether the system can be trusted. Sources kept as themselves. Names without a canonical tradition. Trust as a named, declared layer. Applications as where opinions live. These are the architectural disciplines that let the commons stay honest about its own job. The technical here is what keeps each layer accountable to the layers around it, rather than accumulating quiet assumptions that compound into hidden bias.

The social is the human relationships: the cross-cultural trust, the decision-making, the regional vision. The machinery of how humans across cultures, regions, institutions, and generations decide what counts, who is heard, what is honored, and what direction the whole thing moves. The commons treats these relationships as load-bearing, not decorative. They are built into the substrate as named, attributed, accountable contributions rather than assumed at the edges where no one examines them.

None of the three is sufficient alone. The ecological without the technical is unreachable at scale. The technical without the ecological is empty scaffolding. Either without the social is a structure no one is responsible to and no one is responsible for. 

Key phrase *The commons architects the ecological, the technical, and the social in reciprocity.*
