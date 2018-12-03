import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './search.css';

import {connect} from 'react-redux';

import {OpenStreetMapProvider} from 'leaflet-geosearch';

import SearchAddress from './searchAddress';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods

        this.provider = new OpenStreetMapProvider();
    }

    render() {
        return (
            <div className={"search"}>
                <SearchAddress/>
            </div>
        );
    }
}

Search.propTypes = {
    lands: PropTypes.array.isRequired,
    mapRef: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        lands: state.lands,
        mapRef: state.mapRef
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);