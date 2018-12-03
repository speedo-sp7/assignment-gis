import * as ACTION_TYPES from '../actions/action-types';

export function useCase(state = null, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_USE_CASE:
            return action.useCase;
        default:
            return state;
    }
}
