import React, { Component } from 'react'
import BoxAligmentStyle from './BoxAlignmentStyle';

export default class GridContainer extends Component {
  render () {
    const { rowTemplate, columnTemplate, areasTemplate } = this.props

    let style = Object.assign({
      display: 'grid',
      gridTemplateRows: rowTemplate,
      gridTemplateColumns: columnTemplate,
      gridTemplateAreas: areasTemplate,
      //...this.props.style
    },BoxAligmentStyle(this.props));

    return <div style={style}>{this.props.children}</div>
  }
}
