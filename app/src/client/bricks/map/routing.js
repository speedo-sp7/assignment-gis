import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './routing.css';
import L from 'leaflet';

import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import {connect} from "react-redux";
import {fetchStationsNearRoute, setRoute, setRouteBlock, toggleRouting} from "../../actions/index";

class Routing extends Component {
    static propTypes = {
        map: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this.initializeRouting = this.initializeRouting.bind(this);
        this.destroyRouting = this.destroyRouting.bind(this);
    }

    componentDidMount() {
        this.initializeRouting();
    }

    componentDidUpdate(prevProps, prevState) {
        this.initializeRouting();

        if (prevProps.filterStationTypes !== this.props.filterStationTypes){
            if (this.props.routing.route && this.props.routing.route.positions)
                this.props.fetchStationsNearRoute(this.props.routing.route.positions, this.props.distanceFromRoute, this.props.filterStationTypes);
        }

        if (prevProps.distanceFromRoute !== this.props.distanceFromRoute){
            if (this.props.routing.route && this.props.routing.route.positions)
                this.props.fetchStationsNearRoute(this.props.routing.route.positions, this.props.distanceFromRoute, this.props.filterStationTypes);
        }
    }

    componentWillUnmount() {
        this.destroyRouting();
    }

    initializeRouting() {
        const parent = this;

        if (this.props.map && !this.routing) {
            const plan = new L.Routing.Plan([], {
                routeWhileDragging: false,
                showAlternatives: true,
                geocoder: L.Control.Geocoder.nominatim(),
            });

            this.routing = L.Routing.control({
                plan,
                serviceUrl: "https://api.mapbox.com",
                router: L.Routing.mapbox("pk.eyJ1Ijoic3BlZWRvLXNwNyIsImEiOiJjamZ0bjZxaGYzc3ZzMzBwb3h0djlhM244In0.JJDM4N-31AlH1eF7vJDpCQ"),
                fitSelectedRoutes: true,
                lineOptions: {
                    styles: [
                        {color: 'yellow', opacity: 1, weight: 5},
                    ]
                },
            });

            this.routing.on('routeselected', function(e) {
                let route = e.route;
                // Do something with the route here
                parent.props.setRoute({start: parent.props.routing.route.start, end: parent.props.routing.route.end, positions: route});
                parent.props.fetchStationsNearRoute(route, parent.props.distanceFromRoute, parent.props.filterStationTypes);
            });

            let routeBlock = this.routing.onAdd(this.props.map);
            this.props.setRouteBlock(routeBlock);
        }
    }

    destroyRouting() {
        if (this.props.map) {
            this.props.map.removeControl(this.routing);
        }
    }

    render() {
        console.error("RENDER Routing");

        return null;
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        routing: state.routing,
        filterStationTypes: state.filterStationTypes,
        distanceFromRoute: state.distanceFromRoute
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleRouting: () => dispatch(toggleRouting()),
        setRoute: (route) => dispatch(setRoute(route)),
        setRouteBlock: (block) => dispatch(setRouteBlock(block)),
        fetchStationsNearRoute: (route, distance, types) => dispatch(fetchStationsNearRoute(route, distance, types)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Routing);