import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import './searchWithinPolygonControl.css';

import { Icon } from 'react-icons-kit';
import { search } from 'react-icons-kit/icomoon/search';
import {spinner2} from 'react-icons-kit/icomoon/spinner2'
import {connect} from 'react-redux';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import { MapControl } from 'react-leaflet';
import { Portal } from "react-leaflet-portal";
import {
    Button, ButtonGroup, ButtonToolbar, Checkbox, ControlLabel, Form, FormControl, FormGroup, Radio, ToggleButton,
    ToggleButtonGroup
} from "react-bootstrap";

import Control from 'react-leaflet-control';
import {fetchStationsWithinPolygon, setUseCase} from "../../actions/index";
import UseCases from "../../useCases";

class SearchNear extends Component  {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._searchNear = this._searchNear.bind(this);
    }

    _searchNear(event) {
        this.props.fetchStationsWithinPolygon(this.props.mapRef.getBounds(), this.props.filterStationTypes);
    }

    render(){
        return (
            <div className={"search-near"}>
                <Button
                    className={this.props.fetchAllStationsWithinPolygonIsLoading ? "loading" : ""}
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        event.nativeEvent.stopImmediatePropagation();
                        this._searchNear(event);
                    }}
                >
                    <Icon icon={!this.props.fetchAllStationsWithinPolygonIsLoading ? search : spinner2} size={32}/>
                </Button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        stations: state.stations,
        fetchAllStationsWithinPolygonIsLoading: state.fetchAllStationsWithinPolygonIsLoading,
        fetchAllStationsWithinPolygonHasFailed: state.fetchAllStationsWithinPolygonHasFailed,
        filterStationTypes: state.filterStationTypes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchStationsWithinPolygon: (bounds, types) => dispatch(fetchStationsWithinPolygon(bounds, types))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchNear);