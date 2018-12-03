import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './list.css';

import {connect} from 'react-redux';

import {Icon} from 'react-icons-kit';
import {minus} from 'react-icons-kit/icomoon/minus';
import {plus} from 'react-icons-kit/icomoon/plus';

import {Button} from 'reactstrap';
import {
    fetchChoosenStation,
    fetchStationsWithinPolygon,
    setChoosenStation,
    setDistanceFromRoute
} from "../actions/index";

class List extends Component {
    constructor(props) {
        super(props);

        // bind component methods
        this._getListHeader = this._getListHeader.bind(this);
        this._getListElements = this._getListElements.bind(this);
        this._setChoosenStationVisible = this._setChoosenStationVisible.bind(this);
        this._getImportance = this._getImportance.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        //if(prevProps.mapState._id !== this.props.mapState._id || prevProps.filterStationTypes._id !== this.props.filterStationTypes._id){
        //    this.props.fetchStationsWithinPolygon(this.props.mapState.bounds, this.props.filterStationTypes);
        //}
    }

    _getListHeader(stations) {
        return (
            <div className={"list-header"}>
                <div>
                    <div>
                        Total stations: {stations.length}
                    </div>
                    {(this.props.useCase === "route") ? (
                        <div className={"route-search-distance"}>
                            <Button onClick={() => this.props.setDistanceFromRoute(this.props.distanceFromRoute > 100 ? this.props.distanceFromRoute - 100 : this.props.distanceFromRoute)}>
                                <Icon icon={minus} />
                            </Button>
                            {this.props.distanceFromRoute}m
                            <Button onClick={() => this.props.setDistanceFromRoute(this.props.distanceFromRoute + 100)}>
                                <Icon icon={plus} />
                            </Button>
                        </div>
                    ) : null}
                </div>
                <div>
                    <div>
                        Fuel: {this.props.stations.value.filter(station => station.amenity === 'fuel').length}
                    </div>
                    <div>
                        Electric: {this.props.stations.value.filter(station => station.amenity === 'charging_station').length}
                    </div>
                </div>
            </div>
        );
    }

    _setChoosenStationVisible(marker){
        this.props.setChoosenStation({osm_id: marker.osm_id, amenity: marker.amenity, center_json: marker.center_json, importance: marker.importance});
        this.props.fetchChoosenStation(marker.osm_id);
        this.props.mapRef.setView([marker.center_json.coordinates[1], marker.center_json.coordinates[0]], 17);
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

    _getListElements(stations) {
        let chargingIcon = require('../assets/marker_charging_station.svg');
        let fuelIcon = require('../assets/marker_fuel.svg');

        return stations.map((item, index) => {
            let type = item.amenity;
            type = (type === 'fuel') ? "Fuel station" : "Charging station";

            return (
                <div className={"list-element"} key={index} onClick={() => this._setChoosenStationVisible(item)}>
                    <span>
                        <img src={item.amenity === 'fuel' ? fuelIcon : chargingIcon}/>
                    </span>
                    <span className={"label"}>{type}</span>
                    <div className={"station-operator"}>
                        <span>Operator: {item.operator ? item.operator : "Unknown"}</span>
                    </div>
                    {this.props.useCase !== "route" ? (
                        <div className={"station-importance"}>
                            <span>{this._getImportance(item.importance)}</span>
                        </div>
                    ): null}
                </div>
            );
        });
    }

    render() {
        const stations = this.props.stations.value.filter(item => {
            return !!this.props.filterStationTypes.find(type => type.selected && type.name === item.amenity);
        });

        return (
            <div className={"list"}>
                {this._getListHeader(stations)}
                <div className={"list-elements"}>
                    {this._getListElements(stations)}
                </div>
            </div>
        );
    }
}

List.propTypes = {
    allStationsWithinPolygon: PropTypes.array.isRequired,
    fetchAllStationsWithinPolygonIsLoading: PropTypes.bool.isRequired,
    fetchAllStationsWithinPolygonHasFailed: PropTypes.bool.isRequired,
    setChoosenStation: PropTypes.func.isRequired,
    fetchChoosenStation: PropTypes.func.isRequired,
    mapState: PropTypes.object.isRequired,
    fetchAllStationsWithinPolygon: PropTypes.func.isRequired,
    filterTypes: PropTypes.array.isRequired,
    mapRef: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        stations: state.stations,
        fetchAllStationsWithinPolygonIsLoading: state.fetchAllStationsWithinPolygonIsLoading,
        fetchAllStationsWithinPolygonHasFailed: state.fetchAllStationsWithinPolygonHasFailed,
        mapState: state.mapState,
        filterStationTypes: state.filterStationTypes,
        mapRef: state.mapRef,
        distanceFromRoute: state.distanceFromRoute,
        useCase: state.useCase
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchStationsWithinPolygon: (bounds, types) => dispatch(fetchStationsWithinPolygon(bounds, types)),
        setChoosenStation: land => dispatch(setChoosenStation(land)),
        fetchChoosenStation: osmId => dispatch(fetchChoosenStation(osmId)),
        setDistanceFromRoute: distance => dispatch(setDistanceFromRoute(distance))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);