import * as ACTION_TYPES from './action-types';
import Calls from "../calls";

export function setMapRef(map) {
    return {
        type: ACTION_TYPES.SET_MAP_REF,
        map: map
    };
}

export function setMapState(lat, lng, zoom, bounds) {
    return {
        type: ACTION_TYPES.SET_MAP_STATE,
        lat, lng, zoom, bounds
    };
}

export function setDistanceFromRoute(distance) {
    return {
        type: ACTION_TYPES.SET_DISTANCE_FROM_ROUTE,
        distance: distance
    };
}

export function setRouteBlock(routeBlock) {
    return {
        type: ACTION_TYPES.SET_ROUTE_BLOCK,
        routeBlock: routeBlock
    };
}

export function setOnMapClick(callback) {
    return {
        type: ACTION_TYPES.SET_ON_MAP_CLICK,
        callback: callback
    };
}

export function setUseCase(useCase) {
    return {
        type: ACTION_TYPES.SET_USE_CASE,
        useCase: useCase
    };
}

export function toggleClustering() {
    return {
        type: ACTION_TYPES.TOGGLE_CLUSTERING
    };
}

export function setSearchAddress(address) {
    return {
        type: ACTION_TYPES.SET_SEARCH_ADDRESS,
        address: address
    };
}

export function setSearchBounds(bounds) {
    return {
        type: ACTION_TYPES.SET_SEARCH_BOUNDS,
        bounds: bounds
    };
}

export function setSearchRadius(radius) {
    return {
        type: ACTION_TYPES.SET_SEARCH_RADIUS,
        radius: radius
    };
}

export function fetchAllStationsWithinPolygonIsLoading(bool) {
    return {
        type: ACTION_TYPES.FETCH_ALL_STATIONS_WITHIN_POLYGON_IS_LOADING,
        isLoading: bool
    };
}

export function fetchAllStationsWithinPolygonHasFailed(bool) {
    return {
        type: ACTION_TYPES.FETCH_ALL_STATIONS_WITHIN_POLYGON_HAS_FAILED,
        hasFailed: bool
    };
}

export function fetchAllStationsWithinPolygonSuccess(lands) {
    return {
        type: ACTION_TYPES.FETCH_ALL_STATIONS_WITHIN_POLYGON_SUCCESS,
        lands: lands
    };
}

export function fetchStationsWithinPolygon(bounds, types) {
    return dispatch => {
        dispatch(fetchAllStationsWithinPolygonIsLoading(true));
        dispatch(fetchAllStationsWithinPolygonHasFailed(false));

        Calls.getAllStationsWithinPolygon({
            data: {
                bounds: bounds,
                types: types.map(type => type.selected ? type.name : null)
            },
            done: dtoOut => {
                dispatch(fetchAllStationsWithinPolygonIsLoading(false));
                dispatch(fetchAllStationsWithinPolygonHasFailed(false));
                dispatch(fetchAllStationsWithinPolygonSuccess(dtoOut));
            },
            fail: dtoOut => {
                dispatch(fetchAllStationsWithinPolygonIsLoading(false));
                dispatch(fetchAllStationsWithinPolygonHasFailed(true));
                console.error(dtoOut);
            }
        });
    };
}

export function filterStationsByTypes(types) {
    return {
        type: ACTION_TYPES.FILTER_STATIONS_BY_TYPES,
        types: types
    };
}

export function fetchChoosenStationIsLoading(bool) {
    return {
        type: ACTION_TYPES.FETCH_CHOOSEN_LAND_IS_LOADING,
        isLoading: bool
    };
}

export function fetchChoosenStationHasFailed(bool) {
    return {
        type: ACTION_TYPES.FETCH_CHOOSEN_LAND_HAS_FAILED,
        hasFailed: bool
    };
}

export function fetchChoosenStationSuccess(land) {
    return {
        type: ACTION_TYPES.FETCH_CHOOSEN_STATION_SUCCESS,
        land: land
    };
}

export function fetchChoosenStation(osmId) {
    return dispatch => {
        dispatch(fetchChoosenStationIsLoading(true));
        dispatch(fetchChoosenStationHasFailed(false));

        Calls.getStation({
            data: {
                osmId: osmId
            },
            done: dtoOut => {
                dispatch(fetchChoosenStationIsLoading(false));
                dispatch(fetchChoosenStationHasFailed(false));
                dispatch(fetchChoosenStationSuccess(dtoOut[0]));
            },
            fail: dtoOut => {
                dispatch(fetchChoosenStationIsLoading(false));
                dispatch(fetchChoosenStationHasFailed(true));
                console.error(dtoOut);
            }
        });
    };
}

export function setChoosenStation(land) {
    return {
        type: ACTION_TYPES.SET_CHOOSEN_STATION,
        land: land
    };
}

export function fetchAllParkingLotsNearStationIsLoading(bool) {
    return {
        type: ACTION_TYPES.FETCH_ALL_PARKING_LOTS_NEAR_STATION_IS_LOADING,
        isLoading: bool
    };
}

export function fetchAllParkingLotsNearStationHasFailed(bool) {
    return {
        type: ACTION_TYPES.FETCH_ALL_PARKING_LOTS_NEAR_STATION_HAS_FAILED,
        hasFailed: bool
    };
}

export function fetchAllParkingLotsNearStationSuccess(places) {
    return {
        type: ACTION_TYPES.FETCH_ALL_PARKING_LOTS_NEAR_STATION_SUCCESS,
        places: places
    };
}

export function fetchAllSpecialPlacesNearStation(center, distance) {
    return dispatch => {
        dispatch(fetchAllParkingLotsNearStationIsLoading(true));
        dispatch(fetchAllParkingLotsNearStationHasFailed(false));

        Calls.getAllSpecialPlacesNearStation({
            data: {
                coordinates: center.coordinates,
                distance: distance
            },
            done: dtoOut => {
                dispatch(fetchAllParkingLotsNearStationIsLoading(false));
                dispatch(fetchAllParkingLotsNearStationHasFailed(false));
                dispatch(fetchAllParkingLotsNearStationSuccess(dtoOut));
            },
            fail: dtoOut => {
                dispatch(fetchAllParkingLotsNearStationIsLoading(false));
                dispatch(fetchAllParkingLotsNearStationHasFailed(true));
                console.error(dtoOut);
            }
        });
    };
}

export function setAllParkingLotsNearStation(parkingLots) {
    return {
        type: ACTION_TYPES.SET_ALL_PARKING_LOTS_NEAR_STATION,
        parkingLots: parkingLots
    };
}

export function fetchStationsNearRouteIsLoading(bool) {
    return {
        type: ACTION_TYPES.FETCH_STATIONS_NEAR_ROUTE_IS_LOADING,
        isLoading: bool
    };
}

export function fetchStationsNearRouteHasFailed(bool) {
    return {
        type: ACTION_TYPES.FETCH_STATIONS_NEAR_ROUTE_HAS_FAILED,
        hasFailed: bool
    };
}

export function fetchStationsNearRouteSuccess(lands) {
    return {
        type: ACTION_TYPES.FETCH_STATIONS_NEAR_ROUTE_SUCCESS,
        lands: lands
    };
}

export function fetchStationsNearRoute(route, distance, types) {
    return dispatch => {
        dispatch(fetchStationsNearRouteIsLoading(true));
        dispatch(fetchStationsNearRouteHasFailed(false));

        Calls.getStationsNearRoute({
            data: {
                coordinates: route.coordinates,
                distance: distance,
                types: types.map(type => type.selected ? type.name : null)
            },
            done: dtoOut => {
                dispatch(fetchStationsNearRouteIsLoading(false));
                dispatch(fetchStationsNearRouteHasFailed(false));
                dispatch(fetchStationsNearRouteSuccess(dtoOut));
            },
            fail: dtoOut => {
                dispatch(fetchStationsNearRouteIsLoading(false));
                dispatch(fetchStationsNearRouteHasFailed(true));
                console.error(dtoOut);
            }
        });
    };
}

export function setStationsNearRoute(parkingLots) {
    return {
        type: ACTION_TYPES.SET_STATIONS_NEAR_ROUTE,
        parkingLots: parkingLots
    };
}

export function toggleRouting() {
    return {
        type: ACTION_TYPES.TOGGLE_ROUTING
    };
}

export function setRoute(route) {
    return {
        type: ACTION_TYPES.SET_ROUTE,
        route: route
    };
}


export function fetchStationArealsIsLoading(bool) {
    return {
        type: ACTION_TYPES.FETCH_STATION_AREALS_IS_LOADING,
        isLoading: bool
    };
}

export function fetchStationArealsHasFailed(bool) {
    return {
        type: ACTION_TYPES.FETCH_STATION_AREALS_HAS_FAILED,
        hasFailed: bool
    };
}

export function fetchStationArealsSuccess(areals) {
    return {
        type: ACTION_TYPES.FETCH_STATION_AREALS_SUCCESS,
        areals: areals
    };
}

export function fetchStationAreals(osmId) {
    return dispatch => {
        dispatch(fetchStationArealsHasFailed(true));
        dispatch(fetchChoosenStationHasFailed(false));

        Calls.getStationAreals({
            data: {
                osmId: osmId
            },
            done: dtoOut => {
                dispatch(fetchStationArealsIsLoading(false));
                dispatch(fetchStationArealsHasFailed(false));
                dispatch(fetchStationArealsSuccess(dtoOut));
            },
            fail: dtoOut => {
                dispatch(fetchStationArealsIsLoading(false));
                dispatch(fetchStationArealsHasFailed(true));
                console.error(dtoOut);
            }
        });
    };
}

export function fetchLandsIsLoading(bool) {
    return {
        type: ACTION_TYPES.FETCH_LANDS_IS_LOADING,
        isLoading: bool
    };
}

export function fetchLandsHasFailed(bool) {
    return {
        type: ACTION_TYPES.FETCH_LANDS_HAS_FAILED,
        hasFailed: bool
    };
}

export function fetchLandsSuccess(lands) {
    return {
        type: ACTION_TYPES.FETCH_LANDS_SUCCESS,
        lands: lands
    };
}

export function fetchLands(limit) {
    return dispatch => {
        dispatch(fetchLandsIsLoading(true));
        dispatch(fetchLandsHasFailed(false));

        Calls.getList({
            data: {
                limit: limit
            },
            done: dtoOut => {
                dispatch(fetchLandsIsLoading(false));
                dispatch(fetchLandsHasFailed(false));
                dispatch(fetchLandsSuccess(dtoOut));
            },
            fail: dtoOut => {
                dispatch(fetchLandsIsLoading(false));
                dispatch(fetchLandsHasFailed(true));
                console.error(dtoOut);
            }
        });
    };
}