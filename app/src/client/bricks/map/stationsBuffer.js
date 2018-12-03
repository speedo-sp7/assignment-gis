import React, {Component} from 'react';
import './stationsBuffer.css';

import {connect} from "react-redux";
import {Polygon} from "react-leaflet";

class Stations extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._getPositions = this._getPositions.bind(this);
    }

    _getPositions(parts){
        return parts.map(coordinates => {
            return coordinates.map(coordinate => {
                return [coordinate[1], coordinate[0]];
            })
        });
    }

    render() {
        if (this.props.stations.buffer && this.props.stations.buffer.coordinates) {
            return (
                <Polygon
                    positions={this._getPositions(this.props.stations.buffer.coordinates)}
                    color={"#0371ff"}
                    fillColor={"#0371ff"}
                    opacity={0.3}
                    fillOpacity={0.1}
                />
            );
        } else return null;
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        stations: state.stations,
        filterStationTypes: state.filterStationTypes,
        clusteringToggled: state.clusteringToggled
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stations);