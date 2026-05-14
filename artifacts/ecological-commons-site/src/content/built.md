# What's Built

An ecological commons begins with the infrastructure that makes knowledge findable. This is what currently exists.

## The data layer

The data layer holds descriptions of ecological data sources and, for integrated sources, makes the underlying data reachable through a consistent interface. Each source in the data layer follows the same repeating pattern — a way of describing the source, storing what it holds, making it reachable through a consistent interface, and publishing an explorer where anyone can sample what's inside. New sources are added as they are described and integrated.

The data layer browser lives at: **[data.ecologicalcommons.org](https://data.ecologicalcommons.org/)**.

Above the data layer, both trust and application domains will reside. Trust domains will capture human or expert judgement about which data sources are applicable for different objectives (regions, knowledge areas, or activity).

- [OpenAPI JSON](https://data.ecologicalcommons.org/api/openapi.json)
- [OpenAPI YAML](https://data.ecologicalcommons.org/api/openapi.yaml)
- [Source registry](https://data.ecologicalcommons.org/api/v1/sources)
- [MCP endpoint](https://data.ecologicalcommons.org/mcp)

## Demo Apps

Two applications currently demonstrate what can be built on the commons.

**[Ecological Augur](https://ecologicalaugur.replit.app)**
> An ecological question-answering tool that consults the commons for real occurrence records, taxonomy, and conservation data before answering. Every response shows four sections: the answer, what came from the commons, what came from the AI's training knowledge, and where gaps remain. You can inspect the sourcing — you don't have to take the AI's word for it.

**[Connecting Concepts](https://connectingconcepts.replit.app)**
> A demonstration of how large language models work. Submit three concepts; the model finds connections across what it learned during training. The prompt — the instructions shaping which patterns it emphasizes — is shown, not hidden. Same concepts, different context, different connections.

## What's Coming

- Integrating additional sources that have been identified.
- Developing the first real Southeast Michigan applications.
- Inviting community members to understand and collaborate.
- Requesting data owners to discuss and share their valuable products.
- Discussing our shared approach to technical and governance topics.

## Old, but still interesting

> An early proof-of-concept application demonstrated what can be built on a static version of the commons and one way of dealing with the challenge of trusting agentic systems. It has its own documentation and is available to explore:
>
> - [s2c-species.replit.app](https://s2c-species.replit.app)
>
> A field report describing the proof of concept journey and the early work, through January 2026:
>
> - [Field Notes (PPT)](https://drive.google.com/file/d/1dXNbnFLc8L_n3dwnZKdCzpqNorT-irXi/view?usp=drivesdk)
