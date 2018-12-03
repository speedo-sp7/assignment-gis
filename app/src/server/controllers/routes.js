'use strict';
module.exports = function(app) {
    let myController = require('./controller');

    /* (UC1) */
    app.route('/getAllStationsWithinPolygon')
        .post(myController.get_all_stations_within_polygon);

    /* (UC2) */
    app.route('/getStationsNearRoute')
        .post(myController.get_stations_near_route);

    /* (UC3) */
    app.route('/getAllSpecialPlacesNearStation')
        .post(myController.get_all_special_places_near_station);

    /* (UC3) */
    app.route('/getStation')
        .post(myController.get_station);

    /* (UC3) */
    app.route('/getStationAreals')
        .post(myController.get_station_areals);
};
