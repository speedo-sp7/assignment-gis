import React, {Component} from 'react';
import './appMapOverlay.css';
import SearchNearControl from './search/searchWithinPolygonControl';
import ClusteringToggle from './search/clusteringToggle';

import FilterByType from "./search/searchTypeFilter";

class AppMapOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        // bind component methods
    }

    render() {
        return (
            <div className={"app-map-overlay"}>
                <div>
                    <div class="top">
                        <div class="left">
                        </div>
                        <div class="center">
                            <FilterByType />
                        </div>
                        <div class="right">
                            <ClusteringToggle />
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="left" />
                        <div class="center">
                        </div>
                        <div class="right" >
                            <SearchNearControl />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppMapOverlay;