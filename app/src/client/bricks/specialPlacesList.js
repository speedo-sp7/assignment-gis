import React, {Component} from 'react';
import './specialPlacesList.css';

import {connect} from 'react-redux';

import {Icon} from 'react-icons-kit';
import {zoomIn} from 'react-icons-kit/icomoon/zoomIn';

class ParkingLotsList extends Component {
    constructor(props) {
        super(props);

        // bind component methods
        this._getParkingLotsListHeader = this._getParkingLotsListHeader.bind(this);
        this._getParkingLotsListElements = this._getParkingLotsListElements.bind(this);
    }

    _getParkingLotsListHeader(places) {
        return (
            <div className={"list-header"}>
                Near: {places.length} places
            </div>
        );
    }

    _getParkingLotsListElements(places) {
        let parkingIcon = require('../assets/parking.svg');
        let serviceIcon = require('../assets/service.svg');

        return places.map((item, index) => {
            let type = item.amenity ? item.amenity : item.shop;
            type = (type === 'parking') ? "Parking" : "Car service";

            return (
                <div className={"list-element"} key={index} onClick={(e) => this.props.mapRef.panTo([item.center_json.coordinates[1], item.center_json.coordinates[0]])}>
                    <span className={"special-places-list-image"}>
                        <img src={item.amenity === 'parking' ? parkingIcon : serviceIcon}/>
                    </span>
                    <span>Distance: {item.distance.toFixed(0)}m</span>
                    <span><Icon icon={zoomIn} /></span>
                </div>
            );
        });
    }

    render() {
        const places = this.props.specialPlacesNearStation.points.concat(this.props.specialPlacesNearStation.areas).sort((a, b) => {return a.distance - b.distance});

        return (
            <div className={"special-places-list"}>
                {this._getParkingLotsListHeader(places)}
                <div className={"list-elements"}>
                    {this._getParkingLotsListElements(places)}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        mapState: state.mapState,
        mapRef: state.mapRef,
        specialPlacesNearStation: state.specialPlacesNearStation
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ParkingLotsList);