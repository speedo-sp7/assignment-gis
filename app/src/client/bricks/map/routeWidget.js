import React, {Component} from 'react';
import './routeWidget.css';
import L from 'leaflet';

import {connect} from "react-redux";
import {setDistanceFromRoute, setOnMapClick, setRoute, toggleRouting} from "../../actions/index";
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods

        //save map ref for easy use in application
        this.myRef = React.createRef();
        this.controlsRef = React.createRef();
    }

    componentDidMount(){
        //prepare routing control
        if (this.props.routeBlock && !this.routeBlock) {
            this.controlsRef.current.appendChild(this.props.routeBlock);
            this.routeBlock = this.props.routeBlock;
        }
    }

    componentDidUpdate(){
        //prepare routing control
        if (this.props.routeBlock && !this.routeBlock) {
            this.controlsRef.current.appendChild(this.props.routeBlock);
            this.routeBlock = this.props.routeBlock;
        }
    }

    render() {
        window.routing = L.Routing.control({
            serviceUrl: "https://api.mapbox.com",
            router: L.Routing.mapbox("pk.eyJ1Ijoic3BlZWRvLXNwNyIsImEiOiJjamZ0bjZxaGYzc3ZzMzBwb3h0djlhM244In0.JJDM4N-31AlH1eF7vJDpCQ"),
        });

        return (
            <div
                ref={this.myRef}
                className={"route-widget"}
            >
                <div ref={this.controlsRef}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        mapRef: state.mapRef,
        routingActive: state.routing.active,
        route: state.routing.route,
        routeBlock: state.routeBlock,
        stations: state.stations.value,
        distanceFromRoute: state.distanceFromRoute,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleRouting: () => dispatch(toggleRouting()),
        setRoute: (route) => dispatch(setRoute(route)),
        setOnMapClick: (callback) => dispatch(setOnMapClick(callback)),
        setDistanceFromRoute: distance => dispatch(setDistanceFromRoute(distance))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Route);