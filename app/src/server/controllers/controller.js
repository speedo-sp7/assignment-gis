'use strict';

const format = require('pg-format');
const async = require('async');
const pool = require('../database/databaseConnection.js');
const squel = require('squel').useFlavour('postgres');

/* (UC1) */
exports.get_all_stations_within_polygon = (req, res, next) => {
    console.log("RUNNING: get_all_stations_within_polygon");

    pool.connect((err, client, done) => {
        if (err) throw new Error(err);

        let typeCond = null;
        if (req.body.types) {
            typeCond = squel.expr().or(squel.str(`p.amenity = ?`, ''));

            if (req.body.types.indexOf("fuel") > -1)
                typeCond = typeCond.or(squel.str(`p.amenity = ?`, 'fuel'));
            if (req.body.types.indexOf("charging_station") > -1)
                typeCond = typeCond.or(squel.str(`p.amenity = ?`, 'charging_station'));
        }

        let queryStations = squel
            .select()
            .from(`planet_osm_point`, `p`)
            .field(`p.osm_id`)
            .field(`p.way`)
            .where(
                squel
                    .expr()
                    .and(
                        typeCond
                    )
                    .and(
                        squel.str(
                            format(`
                                ST_contains(
                                    ST_transform(
                                        ST_MakeEnvelope(
                                            ?, ?, ?, ?, 4326
                                        ), 3857
                                    ), p.way
                                )
                            `),
                            req.body.bounds._southWest.lng,
                            req.body.bounds._southWest.lat,
                            req.body.bounds._northEast.lng,
                            req.body.bounds._northEast.lat
                        )
                    )
            );

        let queryRoads = squel
            .select()
            .from(`planet_osm_line`, `l`)
            .field(`l.osm_id`)
            .field(`l.way`)
            .field(`l.highway`)
            .where(
                squel
                    .expr()
                    .and(
                        squel
                            .expr()
                            .or(`l.highway = 'primary'`)
                            .or(`l.highway = 'primary_link'`)
                            .or(`l.highway = 'motorway'`)
                    )
                    .and(
                        squel.str(
                            format(`
                                ST_intersects(
                                    ST_transform(
                                        ST_MakeEnvelope(
                                            ?, ?, ?, ?, 4326
                                        ), 3857
                                    ), l.way
                                )
                            `),
                            req.body.bounds._southWest.lng,
                            req.body.bounds._southWest.lat,
                            req.body.bounds._northEast.lng,
                            req.body.bounds._northEast.lat
                        )
                    )
            );

        let query = squel
            .select()
            .from(`planet_osm_point`, `s`)
            .field(`s.osm_id`)
            .field(`s.amenity`)
            .field(`s.operator`)
            .field(
                format(`
                    ST_asGeoJSON(
                        ST_transform(
                            s.way, 4326
                        )
                    )::json 
                `), `center_json`
            )
            .field(`t.importance`, `importance`)
            .join(
                squel
                    .select()
                    .with(
                        `stations`,
                        queryStations
                    )
                    .with(
                        `roads`,
                        queryRoads
                    )
                    .from(`stations`, `s`)
                    .field(`s.osm_id`, `osm_id`)
                    .field(
                        format(`
                            max(
                                CASE
                                    WHEN (st_distance(s.way, r.way) < 100 AND r.highway = 'motorway') THEN 3.5
                                    WHEN (st_distance(s.way, r.way) < 500) THEN 2.5
                                    WHEN (st_distance(s.way, r.way) < 1500) THEN 1.75
                                    WHEN (st_distance(s.way, r.way) < 5000) THEN 1.25
                                    ELSE 1
                                END
                            )
                        `), `importance`
                    )
                    .cross_join(`roads`, `r`)
                    .group(`s.osm_id`), `t`, `s.osm_id = t.osm_id`
            );
        query = query.toString();

        client.query(query, (err, result) => {
                client.release();
                if (err) throw new Error(err);
                res.json(result.rows);
            }
        )
    });
};

/* (UC2) */
exports.get_stations_near_route = (req, res, next) => {
    console.log("RUNNING: get_stations_near_route");

    const routeStr =
        'LINESTRING(' +
        req.body.coordinates.map(coordinate => {
            return coordinate.lng + ' ' + coordinate.lat;
        }).join(',') +
        ')';

    pool.connect((err, client, done) => {
        if (err) throw new Error(err);

        let typeCond = null;
        if (req.body.types) {
            typeCond = squel.expr().or(squel.str(`p.amenity = ?`, ''));

            if (req.body.types.indexOf("fuel") > -1)
                typeCond = typeCond.or(squel.str(`p.amenity = ?`, 'fuel'));
            if (req.body.types.indexOf("charging_station") > -1)
                typeCond = typeCond.or(squel.str(`p.amenity = ?`, 'charging_station'));
        }

        let queryBuffer = squel
            .select()
            .field(
                squel.str(
                    format(`
                        ST_AsGeoJSON(
                            ST_Buffer(
                                ST_GeomFromText(?)::geography, 
                                ?
                            )::geometry
                        )::json 
                    `),
                    routeStr,
                    req.body.distance
                ), `buffer`
            );

        let query = squel
            .select()
            .from(`planet_osm_point`, `p`)
            .field(`p.osm_id`)
            .field(`p.amenity`)
            .field(`p.operator`)
            .field(
                format(`
                    ST_asGeoJSON(
                        ST_transform(
                            p.way, 4326
                        )
                    )::json
                `), `center_json`
            )
            .where(
                squel
                    .expr()
                    .and(
                        typeCond
                    )
                    .and(
                        squel.str(
                            format(`
                                ST_Intersects(
                                    p.way, 
                                    ST_Transform(
                                        ST_Buffer(
                                            ST_GeomFromText(?)::geography, 
                                            ?
                                        )::geometry, 
                                        3857
                                    )
                                )
                            `),
                            routeStr,
                            req.body.distance
                        )
                    )
            );

        query = query.toString();
        queryBuffer = queryBuffer.toString();

        let returnData = {};
        async.parallel([
            (parallel_done) => {
                client.query(query, (err, result) => {
                    if (err) return parallel_done(err);
                    returnData.result = result.rows;
                    parallel_done();
                });
            },
            (parallel_done) => {
                client.query(queryBuffer, {}, function (err, result) {
                    if (err) return parallel_done(err);
                    returnData.buffer = result.rows[0].buffer;
                    parallel_done();
                });
            }
        ], (err) => {
            client.release();
            if (err) throw new Error(err);

            res.json(returnData);
        });
    });
};

/* (UC3) */
exports.get_station = (req, res, next) => {
    console.log("RUNNING: get_station");

    pool.connect((err, client, done) => {
        if (err) throw new Error(err);

        let query = squel
            .select()
            .from(`planet_osm_point`, `p`)
            .field(`osm_id`)
            .field(`amenity`)
            .field(`operator`)
            .field(
                format(`
                    ST_asGeoJSON(
                        ST_transform(
                            p.way, 4326
                        )
                    )::json
                `), `center_json`
            )
            .where(
                squel.str(
                    format(`
                        p.osm_id = ?
                    `),
                    req.body.osmId
                )
            )
            .limit(1)
        ;

        query = query.toString();

        client.query(query, (err, result) => {
            client.release();
            if (err) throw new Error(err);
            res.json(result.rows);
        })
    });
};

/* (UC3) */
exports.get_station_areals = (req, res, next) => {
    console.log("RUNNING: get_station_areals");

    pool.connect((err, client, done) => {
        if (err) throw new Error(err);

        let query = squel
            .select()
            .with(
                `station`,
                squel
                    .select(`way`)
                    .from(`planet_osm_point`, `p`)
                    .where(
                        squel
                            .str(
                                format(`
                                p.osm_id = ?
                            `),
                            req.body.osmId
                        )
                    )
                    .limit(1)
            )
            .from(`planet_osm_polygon`, `p`)
            .from(`station`, `station`)
            .field(`p.osm_id`)
            .field(`p.admin_level`)
            .field(`p.boundary`)
            .field(`p.name`)
            .field(`p.amenity`)
            .field(`p.shop`)
            .field(`ST_AsGeoJSON(ST_Transform(p.way, 4326))::json`, `way_json`)
            .field(
                format(`
                    ST_asGeoJSON(
                        ST_transform(
                            p.way, 4326
                        )
                    )::json
                `), `center_json`
            )
            .where(`st_within(station.way, p.way)`)
        ;

        query = query.toString();

        client.query(query, (err, result) => {
            client.release();
            if (err) throw new Error(err);

            res.json(result.rows);
        })
    });
};

/* (UC3) */
exports.get_all_special_places_near_station = (req, res, next) => {
    console.log("RUNNING: get_all_special_places_near_station");

    pool.connect((err, client, done) => {
        if (err) throw new Error(err);

        let queryPoints = squel
            .select()
            .from(`planet_osm_point`, `p`)
            .field(`osm_id`)
            .field(`shop`)
            .field(`amenity`)
            .field(`way`)
            .field(`name`)
            .field(
                format(`
                    ST_asGeoJSON(
                        ST_centroid(
                            ST_transform(
                                p.way, 4326
                            )
                        )
                    )::json
                `), `center_json`
            )
            .field(
                squel.str(
                    format(`
                        ST_Distance(
                            ST_transform(
                                p.way, 4326
                            ), 
                            ST_MakePoint(?,?)::geography
                        )
                    `),
                    req.body.coordinates[0],
                    req.body.coordinates[1],
                ), `distance`
            )
            .where(
                squel
                    .expr()
                    .or(`p.amenity = 'parking'`)
                    .or(`p.shop = 'car_repair'`)
            )
            .where(
                squel.str(
                    format(`
                        ST_Intersects(
                            p.way, ST_Transform(
                                ST_Buffer(
                                    ST_Point(
                                        ?, 
                                        ?
                                    )::geography, ?
                                )::geometry, 3857
                            )
                        )
                    `),
                    req.body.coordinates[0],
                    req.body.coordinates[1],
                    req.body.distance
                )
            )
            .order(`distance`, `ASC`)
        ;

        let queryPolygons = squel
            .select()
            .from(`planet_osm_polygon`, `p`)
            .field(`osm_id`)
            .field(`shop`)
            .field(`amenity`)
            .field(`way`)
            .field(
                format(`
                            ST_asGeoJSON(
                                ST_centroid(
                                    ST_transform(
                                        p.way, 4326
                                    )
                                )
                            )::json 
                            as center_json
                        `)
            )
            .field(
                format(`
                            ST_asGeoJSON(
                                ST_transform(
                                    p.way, 4326
                                )
                            )::json 
                            as way_json
                        `)
            )
            .field(
                squel.str(
                    format(`
                        ST_Distance(
                            ST_transform(
                                p.way, 4326
                            ), 
                            ST_MakePoint(?,?)::geography
                        )
                    `),
                    req.body.coordinates[0],
                    req.body.coordinates[1],
                ), `distance`
            )
            .where(
                squel
                    .expr()
                    .or(`p.amenity = 'parking'`)
                    .or(`p.shop = 'car_repair'`)
            )
            .where(
                squel.str(
                    format(`
                                ST_Intersects(
                                    p.way, ST_Transform(
                                        ST_Buffer(
                                            ST_Point(
                                                ?, 
                                                ?
                                            )::geography, ?
                                        )::geometry, 3857
                                    )
                                )
                            `),
                    req.body.coordinates[0],
                    req.body.coordinates[1],
                    req.body.distance
                )
            )
            .order(`distance`, `ASC`)
        ;

        let queryWithin = squel
            .select()
            .with(
                `points`,
                queryPoints
            )
            .with(
                `areas`,
                queryPolygons
            )
            .from(`points`, `p`)
            .field(`p.osm_id`, `point_osm_id`)
            .join(`areas`, `a`, `st_within(p.way, a.way)`)
        ;

        queryPoints = queryPoints.toString();
        queryPolygons = queryPolygons.toString();
        queryWithin = queryWithin.toString();

        let returnData = {};
        let pointsAreas = {};
        async.parallel([
            (parallel_done) => {
                client.query(queryPoints, (err, result) => {
                    if (err) return parallel_done(err);
                    returnData.points = result.rows;
                    parallel_done();
                });
            },
            (parallel_done) => {
                client.query(queryPolygons, (err, result) => {
                    if (err) return parallel_done(err);
                    returnData.areas = result.rows;
                    parallel_done();
                });
            },
            (parallel_done) => {
                client.query(queryWithin, {}, function (err, result) {
                    if (err) return parallel_done(err);
                    pointsAreas = result.rows;
                    parallel_done();
                });
            }
        ], (err) => {
            client.release();
            if (err) throw new Error(err);

            // remove points that are covered by pointAreas
            pointsAreas.forEach(pointArea => {
                returnData.parkingPoints = returnData.parkingPoints.filter(el => {
                    return el.osm_id !== pointArea.point_osm_id;
                });
            });

            res.json(returnData);
        });
    });
};
