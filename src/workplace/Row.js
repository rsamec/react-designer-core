import React, { PropTypes, Component } from 'react';

import _ from 'lodash';
import cx from 'classnames';
import Box from './Box.js';

export default class Row extends React.Component {

	handleClick(e) {
		e.stopPropagation();
		if (this.props.handleClick !== undefined) this.props.handleClick();
	}
	render() {

		var containers = this.props.containers || [];
		var boxes = this.props.boxes || [];

		//styles
		var classes = cx({
			'con': true,
			'selected': this.props.selected,
			'parentSelected': this.props.parentSelected,
			'root': this.props.isRoot,
			'row':containers.length !== 0
		});

		var styles = {
			//left: this.props.left,
			//top: this.props.top,
			//height: this.props.height,
			//width: this.props.width,
			//position: this.props.position || 'relative'
		};

		var selfNode = this.props.parent;
		var selfProps = selfNode && selfNode.props || {};
		var selfBindings = selfNode && selfNode.bindings || {};


		return (<div className={classes} style={styles} onClick={this.handleClick.bind(this)}>
			<div>
				{containers.map(function (container, index) {

					var selected = container === this.props.current.node;
					var parentSelected = container === this.props.current.parentNode;
					var key = container.name + index;

					var handleClick = function () {
						if (this.props.currentChanged !== undefined) this.props.currentChanged(container);
					}.bind(this);

					var left = container.style.left === undefined ? 0 : parseInt(container.style.left, 10);
					var top = container.style.top === undefined ? 0 : parseInt(container.style.top, 10);
					
					return (<div className="col-md-2">
						<Row key={key}
										  index={index}
										  left={left}
										  top={top}
										  height={container.style.height}
										  width={container.style.width}
										  position={container.style.position || 'relative'}
										  boxes={container.boxes}
										  containers={container.containers}
										  currentChanged={this.props.currentChanged}
										  current={this.props.current}
										  handleClick={handleClick}
										  parent={container}
										  parentSelected={parentSelected}
										  selected={selected}
										  dataBinder={this.props.dataBinder}
										  intlData={this.props.intlData}
										  ctx={this.props.ctx}
										  widgets={this.props.widgets}
										  widgetRenderer={this.props.widgetRenderer} />
						</div>
					);
				}, this)}

				{boxes.map(function (box, index) {

					var selected = box === this.props.current.node;
					var key = box.name + index;

					var left = box.style.left === undefined ? 0 : parseInt(box.style.left, 10);
					var top = box.style.top === undefined ? 0 : parseInt(box.style.top, 10);
					return (

						<Box key={key}
							 index={index}
							 left={left}
							 top={top}
							 selected={selected}
							 hideSourceOnDrag={this.props.hideSourceOnDrag}
							 currentChanged={this.props.currentChanged}
							 node={box} dataBinder={this.props.dataBinder}
							 ctx={this.props.ctx}
							 widgets={this.props.widgets}
							 widgetRenderer={this.props.widgetRenderer}>
						</Box>

					);
				}, this)
				}
			</div>
		</div>)
	}
}
