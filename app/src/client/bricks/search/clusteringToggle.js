import React, {Component} from 'react';
import './clusteringToggle.css';

import {connect} from 'react-redux';
import {Button} from "react-bootstrap";
import {toggleClustering} from "../../actions/index";

class ClusteringToggle extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
    }

    render() {
        return (
            <div
                className={"clustering-toggle " + (this.props.clusteringToggled ? "" : "inactive")}
                onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.nativeEvent.stopImmediatePropagation();
                    this.props.toggleClustering();
                }}>
                Clustering
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        clusteringToggled: state.clusteringToggled
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleClustering: () => dispatch(toggleClustering())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusteringToggle);