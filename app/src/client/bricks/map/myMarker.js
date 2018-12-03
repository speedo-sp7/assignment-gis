import React, {Component} from 'react';
import './myMarker.css';

import {Marker, Popup} from 'react-leaflet';
import L from 'leaflet';

import {connect} from "react-redux";
import {fetchChoosenStation, setChoosenStation} from "../../actions/index";

class MyMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._setChoosenStationVisible = this._setChoosenStationVisible.bind(this);
    }

    _setChoosenStationVisible(marker){
        this.props.setChoosenStation({osm_id: marker.osm_id, amenity: marker.amenity, center_json: marker.center_json, importance: marker.importance});
        this.props.fetchChoosenStation(marker.osm_id);

        this.props.mapRef.setView([marker.center_json.coordinates[1], marker.center_json.coordinates[0]], 17);
    }

    render() {
        let icon;
        const station = this.props.choosenStation.value;
        let selected = station && this.props.markerData.osm_id === station.osm_id;
        let scale = this.props.markerData.importance ? this.props.markerData.importance * 0.31 : 1;

        if (this.props.markerData.amenity === "fuel"){
            icon = new L.Icon({
                iconUrl: !selected ? require('../../assets/marker_fuel.svg') : require('../../assets/marker_fuel_selected.svg'),
                iconSize: !selected ? [scale * 40, scale * 40] : [50, 50],
                iconAnchor: !selected ? [scale * 20, scale * 20] : [25, 25],
                popupAnchor: !selected ? [scale * 20, scale * -20] : [25, -25]
            });
        } else if (this.props.markerData.amenity === "charging_station"){
            icon = new L.Icon({
                iconUrl: !selected ? require('../../assets/marker_charging_station.svg') : require('../../assets/marker_charging_station_selected.svg'),
                iconSize: !selected ? [scale * 40, scale * 40] : [50, 50],
                iconAnchor: !selected ? [scale * 20, scale * 20] : [25, 25],
                popupAnchor: !selected ? [scale * 20, scale * -20] : [25, -25]
            });
        } else {
            icon = new L.Icon({
                iconUrl: require('../../assets/marker_unknown.svg'),
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [10, -10]
            });
        }

        return (
            <Marker
                key={this.props.choosenStation._id}
                position={[this.props.markerData.center_json.coordinates[1], this.props.markerData.center_json.coordinates[0]]}
                icon={icon}
                onClick={() => this._setChoosenStationVisible(this.props.markerData)}
            >
                {station && this.props.markerData.osm_id === station.osm_id ? (
                    <Popup>
                        {station && !this.props.fetchChoosenStationIsLoading ? (
                            <div>
                                Amenity: {station.amenity}
                            </div>
                        ) : (
                            <div>
                                Loading...
                            </div>
                        )}
                    </Popup>
                ) : null}
            </Marker>
        );
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        choosenStation: state.choosenStation,
        fetchChoosenStationIsLoading: state.fetchChoosenStationIsLoading,
        fetchChoosenStationHasFailed: state.fetchChoosenStationHasFailed
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchChoosenStation: osmId => dispatch(fetchChoosenStation(osmId)),
        setChoosenStation: land => dispatch(setChoosenStation(land))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMarker);