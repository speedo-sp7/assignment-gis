import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import './searchTypeFilter.css';

import {connect} from 'react-redux';

import { Portal } from "react-leaflet-portal";
import {Button} from "react-bootstrap";
import {filterStationsByTypes} from "../../actions/index";

class FilterByType extends Component  {
    constructor(props) {
        super(props);
        this.state = {};

        // bind component methods
        this._toggleType = this._toggleType.bind(this);
    }

    _toggleType(type){
        const filterTypes = this.props.filterStationTypes.map(elem => {
            if (elem.name === type.name){
                return {
                    name: elem.name,
                    selected: !elem.selected,
                    label: elem.label
                }
            }
            else return elem;
        });
        this.props.filterByType(filterTypes);
    }

    render(){
        console.log(">>>>> RENDER: FilterByType");

        if (this.props.filterStationTypes.length) {
            return (
                <div className={"search-type-filter"}>
                    {
                        this.props.filterStationTypes.map(type => {
                            return (
                                <Button
                                    key={type.name}
                                    className={type.selected ? "selected" : ""}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        event.nativeEvent.stopImmediatePropagation();
                                        this._toggleType(type);
                                    }}>{type.label}
                                </Button>
                            );
                        })
                    }
                </div>
            );
        }
        else return null;
    }
}

function mapStateToProps(state) {
    return {
        filterStationTypes: state.filterStationTypes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        filterByType: types => dispatch(filterStationsByTypes(types))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterByType);