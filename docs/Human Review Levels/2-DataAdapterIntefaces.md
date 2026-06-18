# FERNS Data Adapter Interfaces

Mirror of Data Provider to REST and MCP.
Data Adapter creates only the metatdata route and the response envelope.
Almost all data should liver in the data provider.

The api-server code should be mostly logistics and nuts and bolts. 

REST
 - /artifacts/api-server/src/routes/*.ts
   - GET /api/ann-arbor-npn/metadata
   - GET /api/ann-arbor-npn/species
   - GET /api/ann-arbor-npn/species/:key
   - GET /api/ann-arbor-npn/species/:key/source-url
   - GET /api/ann-arbor-npn/alias-index
   - GET /api/ann-arbor-npn/documentation
 - /artifacts/api-server/src/services/*/metadata.ts
 - /artifacts/api-server/src/services/*/seeds.ts
 - /artifacts/api-server/src/services/*/*DOCUMENTATION*.md

MCP

 - /artifacts/mcp-server/src/server.ts
