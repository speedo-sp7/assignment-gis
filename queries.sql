-- 1. API: Get all stations within visible bounds (polygon) and according to requested station types
-- `POST /getAllStationsWithinPolygon`
SELECT s.osm_id, s.amenity, s.operator, 
	ST_asGeoJSON(
		ST_transform(
			s.way, 4326
		)
	)::json 
AS center_json, t.importance AS importance FROM planet_osm_point AS s INNER JOIN (WITH stations AS (SELECT p.osm_id, p.way FROM planet_osm_point AS p WHERE (((p.amenity = '') OR (p.amenity = 'fuel') OR (p.amenity = 'charging_station')) AND (
	ST_contains(
		ST_transform(
			ST_MakeEnvelope(
				17.028250694274906, 48.18789181411507, 17.075972557067875, 48.210375307610235, 4326
			), 3857
		), p.way
	)
	))), roads AS (SELECT l.osm_id, l.way, l.highway FROM planet_osm_line AS l WHERE ((l.highway = 'primary' OR l.highway = 'primary_link' OR l.highway = 'motorway') AND (
		ST_intersects(
			ST_transform(
				ST_MakeEnvelope(
					17.028250694274906, 48.18789181411507, 17.075972557067875, 48.210375307610235, 4326
				), 3857
			), l.way
		)
	))) SELECT s.osm_id AS osm_id, 
	max(
		CASE
			WHEN (st_distance(s.way, r.way) < 100 AND r.highway = 'motorway') THEN 3.5
			WHEN (st_distance(s.way, r.way) < 500) THEN 2.5
			WHEN (st_distance(s.way, r.way) < 1500) THEN 1.75
			WHEN (st_distance(s.way, r.way) < 5000) THEN 1.25
			ELSE 1
		END
	)
AS importance FROM stations AS s CROSS JOIN roads AS r GROUP BY s.osm_id) AS t ON (s.osm_id = t.osm_id)

-- 2. API: Get all stations near route (within distance - in meters) according to requested station types
-- `POST /getStationsNearRoute`
-- get stations
SELECT p.osm_id, p.amenity, p.operator, 
	ST_asGeoJSON(
		ST_transform(
			p.way, 4326
		)
	)::json
AS center_json FROM planet_osm_point AS p WHERE (((p.amenity = '') OR (p.amenity = 'fuel') OR (p.amenity = 'charging_station')) AND (
	ST_Intersects(
		p.way, 
		ST_Transform(
			ST_Buffer(
				ST_GeomFromText('LINESTRING(17.04392 48.19929,17.04361 48.19953,17.0438 48.1997,17.04394 48.19977,17.04407 48.19981,17.04407 48.19981,17.04421 48.19979,17.04429 48.19978,17.04437 48.19975,17.04448 48.19971,17.04448 48.19971,17.04473 48.19924,17.0449 48.19889,17.045 48.19869,17.04507 48.19854,17.04531 48.19801,17.04555 48.19744,17.04582 48.19678,17.04623 48.19579,17.04636 48.19548,17.04647 48.19516,17.04649 48.19509,17.04652 48.19502,17.04655 48.19487,17.04658 48.19472,17.04661 48.19457,17.04664 48.19441,17.04665 48.1943,17.04666 48.1942,17.04666 48.19405,17.04665 48.19388,17.04665 48.1938,17.04663 48.19354,17.04662 48.19303,17.04662 48.1929,17.04662 48.19277,17.04662 48.19264,17.04663 48.19251,17.04664 48.19239,17.04666 48.19227,17.04668 48.19215,17.04671 48.19203,17.04683 48.1916,17.04697 48.19112,17.04714 48.19054,17.04725 48.19018,17.04736 48.18984,17.0474 48.18973,17.04741 48.18967,17.04742 48.18961,17.04742 48.18952,17.04741 48.18948,17.04741 48.18948)')::geography, 
				100
			)::geometry, 
			3857
		)
	)
))
-- get buffer
SELECT (
	ST_AsGeoJSON(
		ST_Buffer(
			ST_GeomFromText('LINESTRING(17.04392 48.19929,17.04361 48.19953,17.0438 48.1997,17.04394 48.19977,17.04407 48.19981,17.04407 48.19981,17.04421 48.19979,17.04429 48.19978,17.04437 48.19975,17.04448 48.19971,17.04448 48.19971,17.04473 48.19924,17.0449 48.19889,17.045 48.19869,17.04507 48.19854,17.04531 48.19801,17.04555 48.19744,17.04582 48.19678,17.04623 48.19579,17.04636 48.19548,17.04647 48.19516,17.04649 48.19509,17.04652 48.19502,17.04655 48.19487,17.04658 48.19472,17.04661 48.19457,17.04664 48.19441,17.04665 48.1943,17.04666 48.1942,17.04666 48.19405,17.04665 48.19388,17.04665 48.1938,17.04663 48.19354,17.04662 48.19303,17.04662 48.1929,17.04662 48.19277,17.04662 48.19264,17.04663 48.19251,17.04664 48.19239,17.04666 48.19227,17.04668 48.19215,17.04671 48.19203,17.04683 48.1916,17.04697 48.19112,17.04714 48.19054,17.04725 48.19018,17.04736 48.18984,17.0474 48.18973,17.04741 48.18967,17.04742 48.18961,17.04742 48.18952,17.04741 48.18948,17.04741 48.18948)')::geography, 
			100
		)::geometry
	)::json 
) AS buffer

-- 3. API: Get all station data
-- `POST /getStation`
SELECT osm_id, amenity, operator, 
	ST_asGeoJSON(
		ST_transform(
			p.way, 4326
		)
	)::json
AS center_json FROM planet_osm_point AS p WHERE (
	p.osm_id = '34149497'
) LIMIT 1
	
-- 4. API: Get all station areals (polygon data if station is within any polygon with station amenity)
-- `POST /getStationAreals`
WITH station AS (
	SELECT * FROM planet_osm_point AS p WHERE (
		p.osm_id = '34149497'
	) LIMIT 1) SELECT p.osm_id, p.admin_level, p.boundary, p.name, p.amenity, p.shop, ST_AsGeoJSON(ST_Transform(p.way, 4326))::json AS way_json, 
	ST_asGeoJSON(
		ST_transform(
			p.way, 4326
		)
	)::json
AS center_json FROM planet_osm_polygon AS p, station AS station WHERE (st_within(station.way, p.way))

-- 5. API: Get all special places near selected station (parking places and car services, within distance - in meters)																			 
-- `POST /getAllSpecialPlacesNearStation`																				 
-- get points
SELECT osm_id, shop, amenity, way, name, 
	ST_asGeoJSON(
		ST_centroid(
			ST_transform(
				p.way, 4326
			)
		)
	)::json
 AS center_json, (
	ST_Distance(
		ST_transform(
			p.way, 4326
		), 
		ST_MakePoint(17.0138963,48.6136392997881)::geography
	)
) AS distance FROM planet_osm_point AS p WHERE (p.amenity = 'parking' OR p.shop = 'car_repair') AND (
	ST_Intersects(
		p.way, ST_Transform(
			ST_Buffer(
				ST_Point(
					17.0138963, 
					48.6136392997881
				)::geography, 500
			)::geometry, 3857
		)
	)
) ORDER BY distance ASC

-- get polygons
SELECT osm_id, shop, amenity, way, 
	ST_asGeoJSON(
		ST_centroid(
			ST_transform(
				p.way, 4326
			)
		)
	)::json 
	as center_json, 
	ST_asGeoJSON(
		ST_transform(
			p.way, 4326
		)
	)::json 
	as way_json, (
ST_Distance(
	ST_transform(
		p.way, 4326
	), 
	ST_MakePoint(17.0138963,48.6136392997881)::geography
)) AS distance FROM planet_osm_polygon AS p WHERE (p.amenity = 'parking' OR p.shop = 'car_repair') AND (
	ST_Intersects(
		p.way, ST_Transform(
			ST_Buffer(
				ST_Point(
					17.0138963, 
					48.6136392997881
				)::geography, 500
			)::geometry, 3857
		)
	)
) ORDER BY distance ASC

-- get joint (to delete polygons from points if point is within any polygon)
WITH points AS (
	SELECT osm_id, shop, amenity, way, name, 
		ST_asGeoJSON(
			ST_centroid(
				ST_transform(
					p.way, 4326
				)
			)
		)::json
		AS center_json, (
			ST_Distance(
				ST_transform(
					p.way, 4326
				), 
				ST_MakePoint(17.0138963,48.6136392997881)::geography
			)
		) AS distance FROM planet_osm_point AS p WHERE (p.amenity = 'parking' OR p.shop = 'car_repair') AND (
			ST_Intersects(
				p.way, ST_Transform(
					ST_Buffer(
						ST_Point(
							17.0138963, 
							48.6136392997881
						)::geography, 500
					)::geometry, 3857
				)
			)
		) ORDER BY distance ASC
	), areas AS (SELECT osm_id, shop, amenity, way, 
		ST_asGeoJSON(
			ST_centroid(
				ST_transform(
					p.way, 4326
				)
			)
		)::json 
		as center_json, 
		ST_asGeoJSON(
			ST_transform(
				p.way, 4326
			)
		)::json 
		as way_json, (
	ST_Distance(
		ST_transform(
			p.way, 4326
		), 
		ST_MakePoint(17.0138963,48.6136392997881)::geography
	)
) AS distance FROM planet_osm_polygon AS p WHERE (p.amenity = 'parking' OR p.shop = 'car_repair') AND (
	ST_Intersects(
		p.way, ST_Transform(
			ST_Buffer(
				ST_Point(
					17.0138963, 
					48.6136392997881
				)::geography, 500
			)::geometry, 3857
		)
	)
) ORDER BY distance ASC) SELECT p.osm_id AS point_osm_id FROM points AS p INNER JOIN areas AS a ON (st_within(p.way, a.way))

