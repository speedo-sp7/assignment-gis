import React, {Component} from 'react';
import './routeStartEnd.css';

import {Marker} from 'react-leaflet';
import L from 'leaflet';

import {connect} from "react-redux";
import {setRoute, toggleRouting} from "../../actions/index";

class RouteStartEnd extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._setChoosenStationVisible = this._setChoosenStationVisible.bind(this);
    }

    _setChoosenStationVisible(marker){

    }

    render() {
        if (this.props.routing.route && this.props.routing.route.positions && this.props.routing.route.positions.coordinates) {
            const iconStart = new L.Icon({
                iconUrl: require('../../assets/startRoute.svg'),
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [10, -10]
            });

            const iconEnd = new L.Icon({
                iconUrl: require('../../assets/endRoute.svg'),
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [10, -10]
            });

            return (
                [
                    <Marker
                        position={this.props.routing.route.positions.coordinates[0]}
                        icon={iconStart}
                    />,
                    <Marker
                        position={this.props.routing.route.positions.coordinates[this.props.routing.route.positions.coordinates.length - 1]}
                        icon={iconEnd}
                    />
                ].map(obj => obj)
            );
        } else return null;
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        routing: state.routing
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleRouting: () => dispatch(toggleRouting()),
        setRoute: (route) => dispatch(setRoute(route))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteStartEnd);