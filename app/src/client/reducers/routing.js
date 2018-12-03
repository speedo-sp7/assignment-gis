import * as ACTION_TYPES from '../actions/action-types';

export function routing(state = {active: false, route: {start: null, end: null}}, action) {
    switch (action.type) {
        case ACTION_TYPES.TOGGLE_ROUTING:
            return {active: !state.active, route: state.route};
        case ACTION_TYPES.SET_ROUTE:
            return {active: state.active, route: action.route};
        default:
            return state;
    }
}

export function routeBlock(state = null, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_ROUTE_BLOCK:
            return action.routeBlock;
        default:
            return state;
    }
}