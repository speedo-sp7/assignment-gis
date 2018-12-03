import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './searchContent.css';
import List from "./list";
import SpecialPlaces from "./specialPlacesList";
import Search from "./search/search";
import StationInfo from "./station/stationInfo";
import RouteWidget from "./map/routeWidget";

import {connect} from "react-redux";


class SearchContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getLabel = this.getLabel.bind(this);
    }

    getLabel(){
        if (this.props.useCase === "map"){
            return (
                <div className={"label"}>
                    Map
                </div>
            );
        } else if (this.props.useCase === "route"){
            return (
                <div className={"label"}>
                    Route
                </div>
            );
        }
    }

    render() {
        let content = [];
        const station = this.props.choosenStation.value;

        if(this.props.useCase === "map") {
            if (station) {
                content = [
                    <Search/>,
                    <StationInfo/>,
                    <SpecialPlaces />
                ];
            }
            else {
                content = [
                    <Search/>,
                    <List/>
                ];
            }
        } else if (this.props.useCase === "route"){
            if (station) {
                content = [
                    <StationInfo/>,
                    <SpecialPlaces />
                ];
            }
            else {
                content = [
                    <RouteWidget />,
                    <List/>
                ];
            }
        }

        return (
            <div className={"search-content"}>
                {this.getLabel()}
                {content.map(content => content)}
            </div>
        );
    }
}

SearchContent.propTypes = {
    choosenStation: PropTypes.object.isRequired,
    fetchChoosenStationHasFailed: PropTypes.bool.isRequired,
    fetchChoosenStationIsLoading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        useCase: state.useCase,
        choosenStation: state.choosenStation,
        fetchChoosenStationHasFailed: state.fetchChoosenStationHasFailed,
        fetchChoosenStationIsLoading: state.fetchChoosenStationIsLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchLands: limit => dispatch(fetchLands(limit))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContent);