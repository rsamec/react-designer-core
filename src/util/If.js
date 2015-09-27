import React from 'react';

export default class If extends React.Component {
    render() {
        if (this.props.test) {
            return this.props.children;
        }
        else {
            return false;
        }
    }
}
