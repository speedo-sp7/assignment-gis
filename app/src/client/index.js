import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import './index.css';

//REDUX LIBS
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
const store = configureStore();

window.store = store;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
