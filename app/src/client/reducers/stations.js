import * as ACTION_TYPES from '../actions/action-types';

export function fetchAllStationsWithinPolygonIsLoading(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL_STATIONS_WITHIN_POLYGON_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

export function fetchAllStationsWithinPolygonHasFailed(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL_STATIONS_WITHIN_POLYGON_HAS_FAILED:
            return action.hasFailed;
        default:
            return state;
    }
}

export function stations(state = {_id: new Date(), value: [], buffer: null}, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL_STATIONS_WITHIN_POLYGON_SUCCESS:
            return {
                _id: new Date(),
                value: action.lands
            };
        case ACTION_TYPES.FETCH_STATIONS_NEAR_ROUTE_SUCCESS:
            return {
                _id: new Date(),
                value: action.lands.result,
                buffer: action.lands.buffer
            };
        case ACTION_TYPES.SET_USE_CASE:
            return {
                _id: new Date(),
                value: state.value,
                buffer: null
            };
        default:
            return state;
    }
}

export function distanceFromRoute(state = 100, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_DISTANCE_FROM_ROUTE:
            return action.distance;
        default:
            return state;
    }
}

export function fetchStationsNearRouteIsLoading(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_STATIONS_NEAR_ROUTE_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

export function fetchStationsNearRouteHasFailed(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_STATIONS_NEAR_ROUTE_HAS_FAILED:
            return action.hasFailed;
        default:
            return state;
    }
}

export function fetchChoosenStationIsLoading(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_CHOOSEN_LAND_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

export function fetchChoosenStationHasFailed(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_CHOOSEN_LAND_HAS_FAILED:
            return action.hasFailed;
        default:
            return state;
    }
}

export function choosenStation(state = {_id: new Date(), value: null, importance: 0, way: null}, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_CHOOSEN_STATION_SUCCESS:
            return {
                _id: new Date(),
                value: action.land,
                importance: state.importance,
                way: state.way
            };
        case ACTION_TYPES.FETCH_STATION_AREALS_SUCCESS:
            const arealWithin = action.areals.find(areal => {
                return (areal.amenity === "fuel" || areal.amenity === "charging_station")
            });
            return {
                _id: state._id,
                value: state.value,
                importance: state.importance,
                way: !!arealWithin ? arealWithin.way_json : null
            };
        case ACTION_TYPES.SET_CHOOSEN_STATION:
            return {
                _id: new Date(),
                value: action.land ? action.land : null,
                importance: (action.land && action.land.importance) ? action.land.importance : 0,
                way: null
            };
        default:
            return state;
    }
}

export function fetchAllParkingLotsNearStationIsLoading(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL_PARKING_LOTS_NEAR_STATION_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

export function fetchAllParkingLotsNearStationHasFailed(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL_PARKING_LOTS_NEAR_STATION_HAS_FAILED:
            return action.hasFailed;
        default:
            return state;
    }
}

export function specialPlacesNearStation(state = {points: [], areas: []}, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL_PARKING_LOTS_NEAR_STATION_SUCCESS:
            return action.places;
        case ACTION_TYPES.SET_ALL_PARKING_LOTS_NEAR_STATION:
            return action.places;
        default:
            return state;
    }
}

export function fetchStationArealsIsLoading(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_STATION_AREALS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

export function fetchStationArealsHasFailed(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_STATION_AREALS_HAS_FAILED:
            return action.hasFailed;
        default:
            return state;
    }
}

export function stationAreals(state = {_id: new Date(), value: []}, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_STATION_AREALS_SUCCESS:
            return {
                _id: new Date(),
                value: action.areals
            };
        default:
            return state;
    }
}






export function fetchLandsIsLoading(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_LANDS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

export function fetchLandsHasFailed(state = false, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_LANDS_HAS_FAILED:
            return action.hasFailed;
        default:
            return state;
    }
}

export function lands(state = {_id: new Date(), value: []}, action) {
    switch (action.type) {
        case ACTION_TYPES.FETCH_LANDS_SUCCESS:
            return {
                _id: new Date(),
                value: action.lands
            };
        default:
            return state;
    }
}