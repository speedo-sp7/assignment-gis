import * as ACTION_TYPES from '../actions/action-types';

export function searchAddress(state = {_id: new Date(), value: null}, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_SEARCH_ADDRESS:
            return {
                _id: new Date(),
                value: action.address
            };
        default:
            return state;
    }
}

export function searchBounds(state = {_id: new Date(), value: null}, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_SEARCH_BOUNDS:
            return {
                _id: new Date(),
                value: action.bounds
            };
        default:
            return state;
    }
}

export function searchRadius(state = {_id: new Date(), value: null}, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_SEARCH_RADIUS:
            return {
                _id: new Date(),
                value: action.radius
            };
        default:
            return state;
    }
}