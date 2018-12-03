### Author: Stanislav Vnenčák

# General course assignment

Build a map-based application, which lets the user see geo-based data on a map and filter/search through it in a meaningfull way. Specify the details and build it in your language of choice. The application should have 3 components:

1. Custom-styled background map, ideally built with [mapbox](http://mapbox.com). Hard-core mode: you can also serve the map tiles yourself using [mapnik](http://mapnik.org/) or similar tool.
2. Local server with [PostGIS](http://postgis.net/) and an API layer that exposes data in a [geojson format](http://geojson.org/).
3. The user-facing application (web, android, ios, your choice..) which calls the API and lets the user see and navigate in the map and shows the geodata. You can (and should) use existing components, such as the Mapbox SDK, or [Leaflet](http://leafletjs.com/).

## Example projects

- Showing nearby landmarks as colored circles, each type of landmark has different circle color and the more interesting the landmark is, the bigger the circle. Landmarks are sorted in a sidebar by distance to the user. It is possible to filter only certain landmark types (e.g., castles).

- Showing bicykle roads on a map. The roads are color-coded based on the road difficulty. The user can see various lists which help her choose an appropriate road, e.g. roads that cross a river, roads that are nearby lakes, roads that pass through multiple countries, etc.

## Data sources

- [Open Street Maps](https://www.openstreetmap.org/)

## My project - STATIONITY

**Application description**: Implemented app is designed to simplify searching for fuel and electric 
stations in Slovak Republic. It allows user to search stations by searching the map or by using address. 
It is also possible to find stations near selected route. Stations also provide details about their 
neighborhood (parking lots, car services).

**Data source**: All used data were downloaded from [Open Street Maps Geofabrik server](https://download.geofabrik.de/europe/slovakia.html) - [Open Street Maps](https://www.openstreetmap.org/) data.

**Technologies used**:
- React, Redux, Bootstrap - FE part of application
- Node.js, Express - BE part of application
- Leaflet (react-leaflet) - maps API
- Leaflet Routing Machine (leaflet-routing-machine) - routing (route calculation and display)
- Squel - query builder
- Nominatim OpenStreetMap - reverse geocoding (search address)

## How to Build & Run (MacOS)
1. INSTALL POSTGRESQL, POSTGIS
    1. UNINSTALL OLDER POSTGRES: brew uninstall --force postgresql
    2. UNINSTALL OLDER POSTGIS: rm -rf /usr/local/var/postgres
    3. INSTALL POSTGRES: brew install postgres
    4. INSTALL POSTGIS: brew install postgis
    5. START PostgreSQL SERVER: pg_ctl -D /usr/local/var/postgres start (to stop: pg_ctl -D /usr/local/var/postgres stop)
    6. INIT DATABASE: initdb /usr/local/var/postgres (if error: rm -r /usr/local/var/postgres)
    7. START SERVER: pg_ctl -D /usr/local/var/postgres -l logfile start
    8. CREATE DATABASE: createdb fiit_pdt_project
    9. ENABLE POSTGIS: psql fiit_pdt_project (WILL SHOW PSQL COMMAND PROMPT)
    10. CREATE EXTENSION FOR POSTGIS: CREATE EXTENSION postgis;
    11. CHECK POSTGIS VERSION: SELECT PostGIS_Version();

2. IMPORT DATA FROM DOWNLOADED OSM FILE - [Open Street Maps Geofabrik server](https://download.geofabrik.de/europe/slovakia.html):
    - database: fiit_pdt_project
    - user: postgres
    - RUN COMMAND: “osm2pgsql -m -U stanislav -d fiit_pdt_project -H localhost ~/path_to_file/slovakia-latest.osm”

3. BUILD & RUN APP
    1. INSTALL DEPENDENCIES: npm install
    2. START DEVELOPMENT SERVER: npm run dev
    3. BUILD FOR PRODUCSTION: npm run build
    4. START PRODUCTION SERVER: npm start
