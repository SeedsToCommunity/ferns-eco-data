# Justifying the Structure

The Ecological Commons has a specific architecture. The data sources are described and kept as themselves, not absorbed into a single rewritten store. Trust is a named, declared layer that filters the data below it rather than a logic baked silently into applications. Names from all traditions and places are treated as first class knowledge, not labels attached to one true form. This page describes the architectural choices made and the reasoning behind them.

## Aspect 1 - Ecology is about relationships and place.

Plants, animals, fungi, soil, water, fire, weather, people, and history — all of them interacting with each other in each specific place over time. The work of ecological stewardship is the work of understanding those relationships: what depends on what, what was present and is now absent, what does balance look like, what does diversity look like.

Key Phrase: *Relationships in places, not facts about species.*

## Aspect 2 - The decisions that shape most places are made by non-experts.

Most of the land in any region is held by people who are not ecologists. Homeowners, landowners, municipal maintenance staff, volunteer boards, weekend stewards, neighbors with a backyard and some curiosity. The trained experts — the restoration ecologists, the botanists, the land managers with years of field experience — are vastly outnumbered. That gap matters because what aggregates into the ecological condition of a region is not what the experts decide to do with the land they manage. It is the daily, unremarkable decisions made by the many: what gets planted, what gets removed, what gets mowed, what gets left, what is valued by society. 

Key Phrase: *Aggregate decision-makers are not the experts.*

## Aspect 3 - People make most decisions alone, regardless of how many experts exist.

Face-to-face, inspired connections are irreplaceable for society. To meet the people where they are, when experts are not on hand, we must provide the best data and translation possible. 

Most decisions, in most domains, happen alone — at a kitchen table, in front of a screen, walking a piece of land before the nursery opens, at a hardware store with a phone and a question. Even in domains crowded with experts and workshops and online forums, the actual moment of decision is often private. Ecology itself is crowded with geological, botanical, and chemical facts that no expert holds, no discussions can cover, or human minds can transmit. Any system that pretends the alone-channel does not exist has missed the place where most of the work happens. We would argue for both more in-person sharing and also systems that share hard-earned wisdom at scale with everyone, everywhere. 

Key Phrase: *Face-to-face is necessary and insufficient; most decisions happen alone.*

## Aspect 4 - The data landscape is broken in three specific ways.

First, we are awash in information, challenged to judge, often without training or clear insight. Overwhelming volume, scattered across websites, books, seed catalogs, agency PDFs, extension bulletins, forum threads, and every manner of species descriptions written more for marketing than accuracy. A person trying to answer a real question in a real place has to read across all of it with no systematic way to evaluate what is reliable and what is not.

Second, significant sources are walled off. Some because of institutional incentives, some because of the shape of delivery, and some because of missing social cohesion. The sources that would matter most — rigorous regional flora, conservation status data, peer-reviewed phenology, field observation records — are often the hardest to reach personally and programmatically.

Third, the technology of access keeps moving. Books, then websites, then spreadsheets, then REST APIs, and now MCP protocols. The method will keep changing. Each generation of access opens what the prior generation could not reach, and makes implications inherent in the previous one obsolete. Knowledge that wants to be genuinely reachable has to be structured so that it can move with the access methods. 

Key Phrase: *Too much, walled off, and the methods of access keep moving.*

## Aspect 5 - New tools change what is possible.

Against this backdrop, a new class of tools has arrived. Called AI loosely, the term is used with varying interpretations and perspectives about what it actually is. It is a new tool class. Like chainsaws, fire, vehicles, propane, or chemicals ... AI has real failure modes, many possible uses, and also genuinely changes what is possible. The failure modes are themselves strange in comparison to other tools: confabulation, training bias, confident wrongness. 

Specifically, a model that has absorbed the internet, Reddit, marketing copy and social media produces answers that mirror the quality level of what it was fed. Analysis that feeds on Michigan Flora, MNFI, BONAP, FQA analysis, peer-reviewed work, and field observations can produce amazing insight.

The current capabilities and the pace of advancement are specific and real. For our domain, it's not a replacement for experts. It could be a way to extend expert knowledge into all the alone-moments where most decisions actually happen. 

Key phrase: *New tool class, real failure modes, genuinely changes what is possible.*

## Aspect 6 - Make knowledge findable, well-described, reachable, and connected.

If the problem is that good data is hard to find, hard to use at scale, and the tools that could help are only as good as the data they are fed, then one concrete answer is to make existing data reachable and honored for what it is.

Every source is kept as itself. The Ecological Commons describes each source in depth — what it covers, how it was made, what its limits are, who maintains it — and provides uniform ways to reach it. Keeping sources as themselves means keeping their authority, their governance, and their perspectives intact. Aggregation through absorption and assimilation does not make a vibrant Commons.

Key phrase: *The tools are downstream of diverse data. Describe and reach; never absorb.*

## Aspect 7 - Trust is something to share

The data layer is rich with information, but also so operationally vast as to not be directly usable for most purposes. Most uses need a narrower field before they can begin. The Trust Layer is one possible implementation of how to execute such a filter. Any kind or style of group can be shaped: peer-reviewed botanical sources only, Michigan-focused regional authorities only, named community contributors plus major synonymy publishers, species focused, whatever is useful. The sources of these groups will emerge with the data sources. We are just at the beginning of that necessary Commons governance work. We would expect many passionate users to share their best judgement of the layers as we all experiment with new tools. 

When using an application or creating your own, select (or create) any group that is appropriate to the purpose. The data layer itself remains untouched and complete. The application layer above does not have to invent its own trust logic. It can rely upon a declared list from a trusted creator.

Key phrase: *Trust is a layer of named, declared scopes — applied above the data, exposed to the user, and explicit.*

## Aspect 8 — No canonical names; every equivalence is an attributed claim

Living things are known by many names: Scientific Latin, common local names, regional vernaculars, the languages of indigenous communities who lived alongside these species for thousands of years. Each tradition is anchored in a particular relationship between a community and the world.

Indigenous botanical knowledge was, in many places and times, not just unrecorded but actively suppressed. Plants were renamed. Knowledge holders were displaced. The naming conventions that emerged through that period reflect that history — and the silence around what was lost was itself manufactured, not natural. The medicinal, food, ceremonial, and ecological knowledge carried by those traditions was detailed practice, often more developed than what replaced it.

We made two architectural decisions associated with this topic, which sit within the Name Translation Layer.

The first is that no naming tradition is structurally privileged. Every name is a node in a graph. No node type sits above another. They only appear in the Name Translation Layer if their community gives permission.

The second is that every claim of equivalence between names is recorded structurally — who said two names refer to the same living being, when, and on what basis. Both ends of such an assertion of equivalence must be represented in the Name Translation Layer before such equivalences are allowed. 

When interacting with a data source, the user can choose to use the Name Translation Layer to bridge the gap between the name they know and the names accepted by the data source. Whatever name a user knows is the center of a small search. The system walks outward from that input, finds what works against the data source, and shows the trail it took.

Key phrase: *No structurally privileged name; every equivalence is an attributed claim; the user’s input is the center of the search.*

## Aspect 9 - Three types of reciprocity as architecture

The Ecological Commons holds three things in relationship, and the architecture is only sound if all three support each other.

The ecological work and posture is the content. A million years of evolution, specialization, and mutual adaptation — organisms in relationship with other organisms in specific places over deep time. The Commons treats this as substance, not subject. It is the reason the architecture exists at all, not to force source conformance, not to impose the "right" perspective. Every decision described above — keeping sources as themselves, refusing a canonical naming tradition, making trust visible and attributable, keeping the Commons neutral — is accountable, finally, to the ecological reality it exists to serve.

The technical work and posture is the shape and structure of the system. The structural design and architectural decisions determine whether the system can be trusted. Sources kept as themselves. Names without a canonical tradition. Trust as a named, declared layer. Applications as where opinions live. These are the architectural disciplines that let the Commons stay honest about its own job. The technical here is what keeps each layer accountable to the layers around it, rather than accumulating quiet assumptions that compound into hidden bias.

The social work and posture is the human relationships: the cross-cultural trust, the decision-making, the regional vision. The machinery of how humans across cultures, regions, institutions, and generations decide what counts, who is heard, what is honored, and what direction the whole thing moves. The Commons treats these relationships as load-bearing, not decorative. They are built into the substrate as named, attributed, accountable contributions rather than assumed at the edges where no one examines them.

None of the three is sufficient alone. The ecological without the technical is unsharable at scale. The technical without the ecological is empty scaffolding. Either without the social is a Commons structure no one is responsible to and no one is responsible for. 

Key phrase: *The Ecological Commons architects the ecological, the technical, and the social in reciprocity.*

## Aspect 10 - The data sources are neutral; applications are flexible

End users don't generally interact with the data layer, the Trust Layer or the Name Translation Layer directly. People use applications (explorers, guides, tools, interfaces) built on top of those layers. Those applications will use the source access methods best suited to their design. Application objectives can adapt as new sources are linked, application goals expand, or human needs shift. 

As functionality advances, agents and agentic systems (that can take natural language direction as inputs, explore among selected sources, and return answers) will emerge. These new tools are themselves applications, though with strange and sometimes disconcerting failure modes. They need clear context and thoughtful guidance to avoid failure cases, which take time to learn and flexibility to apply. Technology advancement holds the potential to minimize these failure modes and to also allow anyone to request a new application tool of their own imagining, without the need for more technical human support. As these tools advance and trustworthy data remains essential, the Ecological Commons can offer a grounding in trusted truth. 

Through all these uses, the Commons remains neutral and source-faithful, with its provenance intact and its sources stable and reachable. The Commons remains neutral and source-faithful. The applications carry the opinions and the audience. We bring the imagination.

Key phrase: *The Commons is neutral; applications are flexible.*
