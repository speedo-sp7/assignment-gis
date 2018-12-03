import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import './app.css';

import { Icon } from 'react-icons-kit';
import { search } from 'react-icons-kit/icomoon/search';
import { deviantart } from 'react-icons-kit/icomoon/deviantart';

import 'bootstrap/dist/css/bootstrap.css';

import Calls from './calls.js';

import {Map, Marker, Popup, TileLayer} from 'react-leaflet'
import AppMap from "./bricks/appMap";
import List from "./bricks/list";
import Header from "./bricks/header";
import Footer from "./bricks/footer";
import SearchContent from "./bricks/searchContent";
import {setChoosenStation, setUseCase} from "./actions/index";
import {connect} from "react-redux";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.setUseCase("map");
    }

    render() {
        return (
            <div className={"app"}>
                <Header />
                <div class={"content"}>
                    <div className={"navigation"}>
                        <button onClick={() => this.props.setUseCase("map")}>
                            <Icon icon={search} />
                        </button>
                        <button  onClick={() => {
                            this.props.setUseCase("route");
                            this.props.setChoosenStation(null);
                        }}>
                            <Icon icon={deviantart} />
                        </button>
                    </div>
                    <div className={"left"}>
                        <SearchContent />
                        <Footer />
                    </div>
                    <div className={"right"}>
                        <div className={"map-container"}>
                            <AppMap markers={[]}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        useCase: state.useCase
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUseCase: useCase => dispatch(setUseCase(useCase)),
        setChoosenStation: station => dispatch(setChoosenStation(station))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);