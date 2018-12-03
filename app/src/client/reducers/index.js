import {combineReducers} from 'redux';

import * as APP from './app';
import * as MAP from './map';
import * as SEARCH from './search';
import * as LANDS from './stations';
import * as ROUTING from './routing';

export default combineReducers({
    useCase: APP.useCase,
    mapRef: MAP.mapRef,
    onMapClick: MAP.onMapClick,
    mapState: MAP.mapState,
    routeBlock: ROUTING.routeBlock,
    clusteringToggled: MAP.clusteringToggled,
    filterStationTypes: MAP.filterStationTypes,

    fetchAllStationsWithinPolygonIsLoading: LANDS.fetchAllStationsWithinPolygonIsLoading,
    fetchAllStationsWithinPolygonHasFailed: LANDS.fetchAllStationsWithinPolygonHasFailed,
    fetchStationsNearRouteIsLoading: LANDS.fetchStationsNearRouteIsLoading,
    fetchStationsNearRouteHasFailed: LANDS.fetchStationsNearRouteHasFailed,
    stations: LANDS.stations,
    distanceFromRoute: LANDS.distanceFromRoute,

    fetchChoosenStationHasFailed: LANDS.fetchChoosenStationHasFailed,
    fetchChoosenStationIsLoading: LANDS.fetchChoosenStationIsLoading,
    choosenStation: LANDS.choosenStation,

    fetchAllParkingLotsNearStationIsLoading: LANDS.fetchAllParkingLotsNearStationIsLoading,
    fetchAllParkingLotsNearStationHasFailed: LANDS.fetchAllParkingLotsNearStationHasFailed,
    specialPlacesNearStation: LANDS.specialPlacesNearStation,

    routing: ROUTING.routing,

    fetchStationArealsHasFailed: LANDS.fetchStationArealsHasFailed,
    fetchStationArealsIsLoading: LANDS.fetchStationArealsIsLoading,
    stationAreals: LANDS.stationAreals,

    searchAddress: SEARCH.searchAddress,
    searchBounds: SEARCH.searchBounds,
    searchRadius: SEARCH.searchRadius,

    fetchLandsIsLoading: LANDS.fetchLandsIsLoading,
    fetchLandsHasFailed: LANDS.fetchLandsHasFailed,
    lands: LANDS.lands
})