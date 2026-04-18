# What's Built

An ecological commons begins with the infrastructure that makes knowledge findable. This is what currently exists.

## The data layer

The data layer holds descriptions of ecological data sources and, for integrated sources, makes the underlying data reachable through a consistent interface. It lives at **[data.ecologicalcommons.org](https://data.ecologicalcommons.org/)**.

Each source in the data layer follows the same repeating pattern — a way of describing the source, storing what it holds, making it reachable through a consistent interface, and publishing an explorer where anyone can see what's inside. This pattern is called FERNS. It's the shape every source in the commons takes, so that people and tools working with the commons can find their footing regardless of which source they're reaching.

The full list of currently registered sources, with descriptions and metadata for each, lives at [data.ecologicalcommons.org](https://data.ecologicalcommons.org/). Each source has its own explorer. New sources are added as they are described and integrated.

## Proof of concept

An early proof-of-concept application demonstrates what can be built on the commons. It has its own documentation and is available to explore: [s2c-species.replit.app](https://s2c-species.replit.app)

A presentation describing the concept and the early work, through January 2026: [Investigation PPT](https://drive.google.com/file/d/1dXNbnFLc8L_n3dwnZKdCzpqNorT-irXi/view?usp=drivesdk)

## Southeast Michigan apps

Applications built on the commons will be developed for Southeast Michigan in the near term. None are live yet. A species reference application is expected soonest. Others will follow as the underlying data supports them.

## For developers

The commons data layer publishes a complete OpenAPI specification describing every endpoint and response shape:

- [OpenAPI (JSON)](https://data.ecologicalcommons.org/api/openapi.json)
- [OpenAPI (YAML)](https://data.ecologicalcommons.org/api/openapi.yaml)

The live source registry is at [data.ecologicalcommons.org/api/v1/sources](https://data.ecologicalcommons.org/api/v1/sources).

An MCP interface is coming soon.

## What's next

Integrating additional sources that have been identified. Developing the first Southeast Michigan applications. Convening the first community gathering of the people and organizations who want to shape how this grows.
