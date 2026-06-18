# Data Provider Interface Review

This file is partially defined by the developer and represents the data and source. The selection of this interface is the first and most significant 

/lib/internal-data-providers/src/*
 - data.ts
 - index.ts (examples interfaces follow, based on what the source contains)
   - get*Species(name)
   - get*SpeciesNameGroups()
   - get*SpeciesList()

Limited methods and elements exported. Only the public methods should be exported to the data adapter layer. 
