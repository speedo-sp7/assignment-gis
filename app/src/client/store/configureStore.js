import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import {createLogger} from 'redux-logger';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    //applyMiddleware(thunk)
    applyMiddleware(thunk, createLogger())
  );
}
