CREATE INDEX point_way_index ON planet_osm_point USING GIST (way);
CREATE INDEX line_way_index ON planet_osm_line USING GIST (way);
CREATE INDEX polygon_way_index ON planet_osm_polygon USING GIST (way);

CREATE INDEX point_osm_id_index ON planet_osm_point (osm_id);
CREATE INDEX point_amenity_index ON planet_osm_point (amenity);
CREATE INDEX polygon_amenity_index ON planet_osm_polygon (amenity);
CREATE INDEX point_shop_index ON planet_osm_point (shop);
CREATE INDEX polygon_shop_index ON planet_osm_polygon (shop);
CREATE INDEX line_highway_index ON planet_osm_line (highway);