import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './choosenStationPolygon.css';

import {Polygon} from 'react-leaflet';

import {connect} from "react-redux";

class ChoosenStationPolygon extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._getPositions = this._getPositions.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.choosenStation._id !== this.props.choosenStation._id && this.props.choosenStation.way && this.props.choosenStation.way !== prevProps.choosenStation.way){
            let bounds = new L.latLngBounds(this._getPositions(this.props.choosenStation.way.coordinates));
            this.props.mapRef.fitBounds(bounds);
        }
    }

    _getPositions(parts){
        return parts.map(coordinates => {
            return coordinates.map(coordinate => {
                return [coordinate[1], coordinate[0]];
        })})
    }

    render() {
        if (this.props.choosenStation.way) {
            return (
                <Polygon
                    positions={this._getPositions(this.props.choosenStation.way.coordinates)}
                    color={"rgb(253, 235, 1)"}
                    fillColor={"white"}
                    opacity={1}
                    fillOpacity={0}
                />
            );
        } else return null;
    }
}

ChoosenStationPolygon.propTypes = {
    mapRef: PropTypes.object.isRequired,
    choosenLand: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        choosenStation: state.choosenStation
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChoosenStationPolygon);