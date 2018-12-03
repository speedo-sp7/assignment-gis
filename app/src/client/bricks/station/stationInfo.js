import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import './stationInfo.css';

import { Icon } from 'react-icons-kit';
import {arrowLeft2} from 'react-icons-kit/icomoon/arrowLeft2';

import {connect} from "react-redux";
import {fetchChoosenStation, fetchStationAreals, setChoosenStation} from "../../actions/index";

class StationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._getImportance = this._getImportance.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.choosenStation._id !== this.props.choosenStation._id){
            this.props.fetchStationAreals(this.props.choosenStation.value.osm_id);
        }
    }

    _getImportance(level){
        switch(parseFloat(level)){
            case 3.5: {
                return "VERY HIGH TRAFFIC";
            }
            case 2.5: {
                return "HIGH TRAFFIC";
            }
            case 1.75: {
                return "MEDIUM TRAFFIC";
            }
            case 1.25: {
                return "NORMAL TRAFFIC";
            }
            case 1: {
                return "LOW TRAFFIC";
            }
            case 0: {
                return "UNKNOWN";
            }
        }
    }

    render() {
        const station = this.props.choosenStation.value;
        let administrativeArea = this.props.stationAreals.value.filter(areal => {
            return areal.boundary === "administrative" && areal.admin_level && areal.name;
        }).sort((a, b) => { return b.admin_level - a.admin_level});

        let type = station.amenity;
        type = (type === 'fuel') ? "Fuel station" : "Charging station";

        let chargingIcon = require('../../assets/marker_charging_station.svg');
        let fuelIcon = require('../../assets/marker_fuel.svg');

        return (
            <div className={"station-info"}>
                <div className={"station-info-close"}>
                    <button onClick={() => this.props.setChoosenStation(null)}><Icon icon={arrowLeft2} /> GO BACK</button>
                </div>
                <div className={"station-info-details"}>
                    <span>
                        {type}
                        <span className={"station-type-logo"}>
                            <img src={station.amenity === 'fuel' ? fuelIcon : chargingIcon}/>
                        </span>
                    </span>
                    <span>Position: {station.center_json.coordinates[1].toFixed(4)}, {station.center_json.coordinates[0].toFixed(4)}</span>
                    <span>Operator: {station.operator ? station.operator : "Unknown"}</span>
                </div>
                {this.props.choosenStation.importance !== 0 ? (
                    <div className={"station-importance"}>
                        <span>{this._getImportance(this.props.choosenStation.importance)}</span>
                    </div>
                ): null}
                <div className={"administration-area"}>
                    <span>Administration area</span>
                    <span>
                        {administrativeArea.map((area, index) => {
                          return (index === 0 ? "" : ", ") + area.name
                        })}
                    </span>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        choosenStation: state.choosenStation,
        stationAreals: state.stationAreals,
        fetchChoosenStationIsLoading: state.fetchChoosenStationIsLoading,
        fetchChoosenStationHasFailed: state.fetchChoosenStationHasFailed,
        fetchStationArealsIsLoading: state.fetchStationArealsIsLoading,
        fetchStationArealsHasFailed: state.fetchStationArealsHasFailed
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchChoosenStation: osmId => dispatch(fetchChoosenStation(osmId)),
        fetchStationAreals: osmId => dispatch(fetchStationAreals(osmId)),
        setChoosenStation: land => dispatch(setChoosenStation(land))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StationInfo);