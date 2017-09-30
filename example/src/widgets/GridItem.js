import React, { Component } from 'react';
import PropTypes from 'prop-types'
import BoxAligmentStyle from './BoxAlignmentStyle';

export default class GridItem extends Component {
  render () {
    const { rowStart, rowEnd, columnStart, columnEnd } = this.props;
    
    const {
      columns = `${columnStart} / ${columnEnd}`,
      rows = `${rowStart} / ${rowEnd}`,
      area
    } = this.props

    let style =  Object.assign({
      gridColumn: columns,
      gridRow: rows,
      gridArea: area,
      //...this.props.style
    },BoxAligmentStyle(this.props));

    return <div style={style}>{this.props.children}</div>
  }
}

GridItem.propTypes = {
  area: PropTypes.string,
  rowStart: PropTypes.number,
  rowEnd: PropTypes.number,
  columnStart: PropTypes.number,
  columnEnd: PropTypes.number,
  columns: PropTypes.string,
  rows: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object
}