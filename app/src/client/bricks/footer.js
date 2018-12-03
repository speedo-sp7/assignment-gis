import React, {Component} from 'react';
import './footer.css';

export default class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"footer"}>
                <div>
                    Created by: Stanislav Vnenčák
                </div>
            </div>
        );
    }
}

Footer.propTypes = {
};

Footer.defaultProps = {
};