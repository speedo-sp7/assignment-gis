import * as ACTION_TYPES from '../actions/action-types';

export function mapRef(state = null, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_MAP_REF:
            return action.map;
        default:
            return state;
    }
}

export function onMapClick(state = null, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_ON_MAP_CLICK:
            return action.callback;
        default:
            return state;
    }
}

export function clusteringToggled(state = true, action) {
    switch (action.type) {
        case ACTION_TYPES.TOGGLE_CLUSTERING:
            return !state;
        default:
            return state;
    }
}

export function mapState(state = {_id: new Date(), lat: null, lng: null, zoom: null, bounds: null}, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_MAP_STATE:
            return {
                _id: new Date(),
                lat: action.lat,
                lng: action.lng,
                zoom: action.zoom,
                bounds: action.bounds
            };
        default:
            return state;
    }
}

const defaultTypes = [
    {
        name: "fuel",
        selected: true,
        label: "Fuel stations"
    },
    {
        name: "charging_station",
        selected: true,
        label: "Charging stations"
    }
];

export function filterStationTypes(state = defaultTypes, action) {
    switch (action.type) {
        case ACTION_TYPES.FILTER_STATIONS_BY_TYPES:
            return action.types;
        default:
            return state;
    }
}
