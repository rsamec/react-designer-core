import React, { PropTypes, Component } from 'react';
import { Transhand } from 'transhand';

import _ from 'lodash';
import cx from 'classnames';

export default class TransformContainer extends React.Component {

    handleDoubleClick(e){
        e.stopPropagation();
        if (this.props.handleClick !== undefined) this.props.handleClick(React.findDOMNode(this));
    }

    render() {
        return (
        <div onDoubleClick={this.handleDoubleClick.bind(this)}>
                {this.props.children}
        </div>)
    }
};