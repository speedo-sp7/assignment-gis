import React, {Component} from 'react';
import './header.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const appIcon = require('../assets/appIcon.svg');

        return (
            <div className={"header"}>
                <span className={"app-icon"}>
                    <img src={appIcon}/>
                </span>
                <span className={"app-name"}>STATIONITY</span>
            </div>
        );
    }
}

Header.propTypes = {
};

Header.defaultProps = {
};