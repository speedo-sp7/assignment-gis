import React, {Component} from 'react';
import './stations.css';

import L from 'leaflet';

import {connect} from "react-redux";
import MarkerClusterGroup from 'react-leaflet-markercluster';

import MyMarker from './myMarker';

class Stations extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._createClusterCustomIcon = this._createClusterCustomIcon.bind(this);
        this._getAllStationsWithinPolygon = this._getAllStationsWithinPolygon.bind(this);
    }

    _createClusterCustomIcon(cluster) {
        return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'marker-cluster-custom',
            iconSize: L.point(40, 40, true)
        });
    };

    _getAllStationsWithinPolygon(){
        const types = this.props.filterStationTypes.map(type => type.selected ? type.name : null);

        return this.props.stations.map(marker => {
            if (types.indexOf(marker.amenity) > -1) {
                return (
                    <MyMarker key={marker.osm_id} markerData={marker}/>
                );
            } else return null;
        });
    }

    render() {
        console.log(">>>>> RENDER: Stations");

        if (this.props.clusteringToggled) {
            return (
                <MarkerClusterGroup showCoverageOnHover={true} iconCreateFunction={this._createClusterCustomIcon}>
                    {this._getAllStationsWithinPolygon()}
                </MarkerClusterGroup>
            );
        } else {
            return this._getAllStationsWithinPolygon();
        }
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        stations: state.stations.value,
        filterStationTypes: state.filterStationTypes,
        clusteringToggled: state.clusteringToggled
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stations);