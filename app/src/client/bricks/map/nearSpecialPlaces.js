import React, {Component} from 'react';
import './nearSpecialPlaces.css';

import {Marker, Polygon, Popup} from 'react-leaflet';

import {connect} from "react-redux";
import {fetchAllSpecialPlacesNearStation} from "../../actions/index";

class NearSpecialPlaces extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._getSpecialPoints= this._getSpecialPoints.bind(this);
        this._getSpecialAreas= this._getSpecialAreas.bind(this);
        this._getReverseCoordinates= this._getReverseCoordinates.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.choosenStation._id !== this.props.choosenStation._id){
           this.props.fetchAllParkingLotsNearStation(this.props.choosenStation.value.center_json, 500);
        }
    }

    _getSpecialPoints(points){
        let parkingIcon = new L.Icon({
            iconUrl: require('../../assets/parking.svg'),
            iconSize: [20, 20], // size of the icon
            iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
            popupAnchor: [10, -10]// point from which the popup should open relative to the iconAnchor
        });

        let serviceIcon = new L.Icon({
            iconUrl: require('../../assets/service.svg'),
            iconSize: [20, 20], // size of the icon
            iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
            popupAnchor: [10, -10]// point from which the popup should open relative to the iconAnchor
        });

        return points.map((point, index) => {
            let type = point.amenity ? point.amenity : point.shop;
            type = (type === 'parking') ? "Parking" : "Car service";

            if (point.amenity === 'parking' || point.shop === 'car_repair')
                return (
                    <Marker
                        key={"parkingPoint" + index}
                        position={[point.center_json.coordinates[1], point.center_json.coordinates[0]]}
                        icon={point.amenity === 'parking' ? parkingIcon : serviceIcon}
                    >
                        <Popup>
                            <div className={"special-popup"}>
                                <span>{type}</span>
                                <span>Distance: {point.distance.toFixed(0)}m</span>
                            </div>
                        </Popup>
                    </Marker>
                );
            else return null;
        });
    }

    _getReverseCoordinates(parts){
        return parts.map(coordinates => {
            return coordinates.map(coordinate => {
                return [coordinate[1], coordinate[0]];
            })});
    }

    _getSpecialAreas(areas){
        return areas.map((area, index) => {
            if (area.amenity === 'parking' || area.shop === 'car_repair')
                return (
                    <Polygon
                        key={"parkingArea" + index}
                        positions={this._getReverseCoordinates(area.way_json.coordinates)}
                        color={"white"}
                        fillColor={area.amenity === 'parking' ? "rgb(0, 85,128)" : "rgb(248, 151, 29)"}
                    />
                );
            else return null;
        });
    }

    render() {
        const specialSpots = [
            this._getSpecialPoints(this.props.specialPlacesNearStation.points),
            this._getSpecialPoints(this.props.specialPlacesNearStation.areas),
            this._getSpecialAreas(this.props.specialPlacesNearStation.areas)
        ];

        if (this.props.choosenStation) {
            return specialSpots.map(spots => spots);
        } else return null;
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        choosenStation: state.choosenStation,
        fetchAllParkingLotsNearStationIsLoading: state.fetchAllParkingLotsNearStationIsLoading,
        fetchAllParkingLotsNearStationHasFailed: state.fetchAllParkingLotsNearStationHasFailed,
        specialPlacesNearStation: state.specialPlacesNearStation,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllParkingLotsNearStation: (center, radius) => dispatch(fetchAllSpecialPlacesNearStation(center, radius))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NearSpecialPlaces);