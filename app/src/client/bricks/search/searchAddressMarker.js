import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import './searchAddressMarker.css';

import Calls from '../../calls.js';

import {Marker} from 'react-leaflet';
import {connect} from "react-redux";
import {setSearchAddress} from "../../actions/index";

class SearchAddressMarker extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this._updatePosition = this._updatePosition.bind(this);
        this._reverseGeolocate = this._reverseGeolocate.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.searchAddress._id !== this.props.searchAddress._id){
            this.setState({
                position: [this.props.searchAddress.value.y, this.props.searchAddress.value.x]
            });
        }
    }

    _updatePosition(e) {
        this._reverseGeolocate(e.target.getLatLng())
    }

    _reverseGeolocate(position) {
        this.setState({currentPositionIsLoading: false, dropdownVisible: false});

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`)
            .then(result => result.json())
            .then(res => {
                    this.props.setSearchAddress({
                        bounds: [
                            [res.boundingbox[0], res.boundingbox[2]],
                            [res.boundingbox[1], res.boundingbox[3]]
                        ],
                        label: res.display_name,
                        x: res.lon,
                        y: res.lat
                    });
                    this.setState({position: [res.lat, res.lon]});
                }
            );
    }

    render() {
        let icon = new L.Icon({
            iconUrl: require('../../assets/marker-icon.png'),
            shadowUrl: require('../../assets/marker-shadow.png'),
            iconSize: [25, 41], // size of the icon
            shadowSize: [41, 41], // size of the shadow
            iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 35],  // the same for the shadow
            popupAnchor: [-3, -76]// point from which the popup should open relative to the iconAnchor
        });

        if (this.state.position) {
            return (
                <Marker
                    className={"search-address-marker"}
                    position={this.state.position}
                    icon={icon}
                    draggable={true}
                    onDragend={this._updatePosition}
                />
            );
        } else return null;

    }
}

SearchAddressMarker.propTypes = {
    searchAddress: PropTypes.object.isRequired,
    setSearchAddress: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        searchAddress: state.searchAddress
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setSearchAddress: address => dispatch(setSearchAddress(address))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchAddressMarker);