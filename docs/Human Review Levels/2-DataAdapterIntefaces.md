# FERNS Data Adapter Interfaces

Mirror of Data Provider to REST and MCP.
Data Adapter creates only the metatdata route and the response envelope.
Almost all data should liver in the data provider.

The rest-server code should be mostly logistics and nuts and bolts. 

REST
 - /artifacts/rest-server/src/routes/*.ts
   - GET /api/ann-arbor-npn/metadata
   - GET /api/ann-arbor-npn/species
   - GET /api/ann-arbor-npn/species/:key
   - GET /api/ann-arbor-npn/species/:key/source-url
   - GET /api/ann-arbor-npn/alias-index
   - GET /api/ann-arbor-npn/documentation
 - /artifacts/rest-server/src/services/*/metadata.ts
 - /artifacts/rest-server/src/services/*/seeds.ts
 - /artifacts/rest-server/src/services/*/*DOCUMENTATION*.md

MCP

 - /artifacts/mcp-server/src/server.ts
