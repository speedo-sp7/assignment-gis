import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './appMap.css';

import {Map, TileLayer, ZoomControl} from 'react-leaflet';
import L from 'leaflet';
import SearchAddressMarker from './search/searchAddressMarker';
import AppMapOverlay from './appMapOverlay';
import {connect} from "react-redux";
import {onMapClick, setMapRef, setMapState} from "../actions/index";
import UseCases from "../useCases";
import Stations from './map/stations';
import StationsBuffer from './map/stationsBuffer';
import ChoosenLandPolygon from './map/choosenStationPolygon'
import NearSpecialPlaces from './map/nearSpecialPlaces';
import RouteStartEnd from './map/routeStartEnd';
import Routing from './map/routing';

const TOKEN = 'pk.eyJ1Ijoic3BlZWRvLXNwNyIsImEiOiJjamZ0bjZxaGYzc3ZzMzBwb3h0djlhM244In0.JJDM4N-31AlH1eF7vJDpCQ';

class AppMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //defaultCenter: [48.6670447, 18.5786457],
            //defaultZoom: 8
            defaultCenter: [48.6162749997875, 17.0118212],
            defaultZoom: 14
        };

        // bind component methods
        this._getGeoJson = this._getGeoJson.bind(this);
        this._viewChanged = this._viewChanged.bind(this);
        this._getUseCaseElements = this._getUseCaseElements.bind(this);

        //save map ref for easy use in application
        this._setMapRef = map => {
            this.props.setMapRef(map.leafletElement);
            this._viewChanged(map.leafletElement);
        };
    }

    _getUseCaseElements(){
        let elems = [];
        switch(this.props.useCase) {
            case UseCases.searchNear: {
                console.log("USE CASE: ", UseCases.searchNear);
                elems = [
                    <ZoomControl position="bottomright" />
                ];
                break;
            }
            case UseCases.customSearch:{
                console.log("USE CASE: ", UseCases.customSearch);
                elems = [];
                break;
            }
            default: {
                console.log("USE CASE UNKNOWN!");
                elems = [];
                break;
            }
        }

        return elems.map(elem => elem);
    }

    _getGeoJson() {
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "properties": {},
                        "coordinates": [
                            18.5796457, 48.6690447
                        ]
                    }
                },
                this.props.lands.value.map(land => {
                    return {
                        "type": "Point",
                        "properties": {},
                        "geometry": land.center
                    }
                })
            ]
        };
    }

    _viewChanged(map){
        const { lat, lng } = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();

        this.props.setMapState(lat, lng, zoom, bounds);
    }

    render() {
        console.log(">>>>> RENDER: AppMap");

        let icon = new L.Icon({
            iconUrl: require('../assets/marker-icon.png'),
            shadowUrl: require('../assets/marker-shadow.png'),
            iconSize: [25, 41], // size of the icon
            shadowSize: [41, 41], // size of the shadow
            iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 35],  // the same for the shadow
            popupAnchor: [-3, -76]// point from which the popup should open relative to the iconAnchor
        });

        const bounds = new L.LatLngBounds(new L.LatLng(47.7584288601, 16.8799829444), new L.LatLng(49.5715740017, 22.5581376482));

        return (
            <Map
                animate
                ref={this._setMapRef}
                center={this.state.defaultCenter}
                zoom={this.state.defaultZoom}
                className={"app-map"}
                zoomControl={false}
                maxZoom={20}
                minZoom={7}
                onZoomEnd={event => this._viewChanged(event.target)}
                onMoveend={event => this._viewChanged(event.target)}
                maxBounds={bounds}
                maxBoundsViscosity={0.5}
                onClick={e => this.props.onMapClick && this.props.onMapClick(e)}
            >
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/speedo-sp7/cjozxl4oa07872smnue9hta5c/tiles/256/{z}/{x}/{y}@2x?access_token=${TOKEN}`}
                />
                <AppMapOverlay />

                <SearchAddressMarker />

                {/*{this._getUseCaseElements()}*/}


                <Stations />
                <StationsBuffer />

                <ChoosenLandPolygon />

                {this.props.choosenStation.value && <NearSpecialPlaces />}

                {(this.props.mapRef && this.props.useCase === "route") && <Routing map={this.props.mapRef} />}
                {this.props.useCase === "route" && <RouteStartEnd />}
            </Map>
        );
    }
}

AppMap.propTypes = {
    mapRef: PropTypes.object.isRequired,
    useCase: PropTypes.string.isRequired,
    lands: PropTypes.array.isRequired,
    allStationsWithinPolygon: PropTypes.array.isRequired,
    setMapRef: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    searchAddress: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        useCase: state.useCase,
        lands: state.lands,
        stations: state.stations,
        searchAddress: state.searchAddress,
        choosenStation: state.choosenStation,
        onMapClick: state.onMapClick
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setMapRef: map => dispatch(setMapRef(map)),
        setMapState: (lat, lng, zoom, bounds) => dispatch(setMapState(lat, lng, zoom, bounds))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppMap);