import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import './searchAddress.css';

import {connect} from 'react-redux';

import { Icon } from 'react-icons-kit';
import { search } from 'react-icons-kit/icomoon/search';
import { safari } from 'react-icons-kit/icomoon/safari';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import {
    Button, ButtonGroup, ButtonToolbar, Checkbox, ControlLabel, Form, FormControl, FormGroup, Radio, ToggleButton,
    ToggleButtonGroup
} from "react-bootstrap";
import {
    fetchStationsWithinPolygon, setChoosenStation, setSearchAddress, setSearchBounds,
    setSearchRadius
} from "../../actions/index";

class SearchAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            items: [],
            loading: false,
            resultEmpty: false,
            dropdownVisible: false,
            selectedItem: null,
            geolocationNotSupported: false,
            currentPositionIsLoading: false
        };

        // bind component methods
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._selectItem = this._selectItem.bind(this);
        this._useCurrentPosition = this._useCurrentPosition.bind(this);
        this._reverseGeolocate = this._reverseGeolocate.bind(this);
        this._setInRadiusSearch = this._setInRadiusSearch.bind(this);
        this._setVisibleAreaSearch = this._setVisibleAreaSearch.bind(this);

        this.provider = new OpenStreetMapProvider();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.searchAddress._id !== this.props.searchAddress._id){
            this.setState({
                value: this.props.searchAddress.value.label
            });
        }
    }

    _handleChange(event) {
        this.setState({value: event.target.value});
    }

    _handleSubmit(event) {
        event.preventDefault();

        const parent = this;
        parent.setState({loading: true, dropdownVisible: true, resultEmpty: false});
        this.provider
            .search({ query: this.state.value })
            .then(function(result) {
                parent.setState({items: result, loading: false, resultEmpty: result.length === 0});
            });
    }

    _selectItem(item) {
        this.props.setChoosenStation(null);
        this.setState({selectedItem: item, value: item.label, dropdownVisible: false});
        this.props.mapRef.fitBounds(item.bounds);

        this.props.setSearchAddress(item);

        this.props.fetchStationsWithinPolygon({
            _northEast: {
                lat: item.bounds[0][0],
                lng: item.bounds[0][1]
            },
            _southWest: {
                lat: item.bounds[1][0],
                lng: item.bounds[1][1]
            }
        }, this.props.filterStationTypes);
    }

    _useCurrentPosition(e){
        e.preventDefault();
        e.stopPropagation();

        this.setState({currentPositionIsLoading: false, dropdownVisible: false});

        if (navigator.geolocation) {
            this.setState({currentPositionIsLoading: true, dropdownVisible: true});
            navigator.geolocation.getCurrentPosition(this._reverseGeolocate);
        } else {
            this.setState({geolocationNotSupported: true});
            alert("Geolocation not supported!");
        }
    }

    _reverseGeolocate(position) {
        this.setState({currentPositionIsLoading: false, dropdownVisible: false});

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&country=Slovakia`)
            .then(result => result.json())
            .then(res => {
                    this._selectItem({
                        bounds: [
                            [res.boundingbox[0], res.boundingbox[2]],
                            [res.boundingbox[1], res.boundingbox[3]]
                        ],
                        label: res.display_name,
                        x: res.lon,
                        y: res.lat
                    });
                this.props.fetchStationsWithinPolygon(
                    {
                        _northEast: {
                            lat: res.boundingbox[0],
                            lng: res.boundingbox[2]
                        },
                        _southWest: {
                            lat: res.boundingbox[1],
                            lng: res.boundingbox[3]
                        }
                    },
                    this.props.filterStationTypes
                );
            });
    }

    _setInRadiusSearch(){
        this.props.setSearchRadius(100);
    }

   _setVisibleAreaSearch(){
        this.props.setSearchBounds(this.props.mapRef.getBounds());
   }

    render() {
        return (
            <div className={"search-address"}>
                <Form onSubmit={this._handleSubmit} inline>
                    <FormGroup controlId="formAddress">
                        <FormControl type="text" placeholder="Find address..." value={this.state.value} onChange={this._handleChange} />
                        <Button type='submit'><Icon icon={search} /></Button>
                        <Button onClick={(e) => this._useCurrentPosition(e)} disable={this.state.geolocationNotSupported}><Icon icon={safari} /></Button>
                    </FormGroup>
                </Form>
                <div className={"dropdown-container"}>
                    {this.state.dropdownVisible ? (
                        <div className={"dropdown"}>
                            {!this.state.currentPositionIsLoading && this.state.items.map(item => {
                                return (
                                    <div key={item.label} className={"dropdown-item"} onClick={() => this._selectItem(item)}>
                                        {item.label}
                                    </div>
                                );
                            })}
                            {this.state.currentPositionIsLoading ? (
                                <div className={"dropdown-item"}>Current position is loading</div>
                            ) : null}
                            {this.state.loading ? (
                                <div className={"dropdown-item"}>Loading</div>
                            ) : null}
                            {this.state.resultEmpty ? (
                                <div className={"dropdown-item"}>Result empty <Button onClick={() => this.setState({dropdownVisible: false})}>Ok</Button></div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        lands: state.lands,
        mapRef: state.mapRef,
        searchAddress: state.searchAddress,
        filterStationTypes: state.filterStationTypes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setSearchAddress: address => dispatch(setSearchAddress(address)),
        setSearchBounds: bounds => dispatch(setSearchBounds(bounds)),
        setSearchRadius: radius => dispatch(setSearchRadius(radius)),
        setChoosenStation: land => dispatch(setChoosenStation(land)),
        fetchStationsWithinPolygon: (bounds, types) => dispatch(fetchStationsWithinPolygon(bounds, types))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchAddress);