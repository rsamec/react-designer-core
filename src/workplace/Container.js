import React, { PropTypes, Component } from 'react';
import ItemTypes from '../util/ItemTypes.js';
import { DropTarget } from 'react-dnd';

import _ from 'lodash';
import cx from 'classnames';

import Box from './Box';
import ResizableHandle from './ResizableHandle.js';

const HANDLE_OFFSET = 8;

let snapToGrid = function(grid,deltaX,deltaY){
	let x = Math.round(deltaX/grid[0]) * grid[0];
	let y = Math.round(deltaY/grid[1]) * grid[1];
	return [x,y];
}


const target = {
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            // If you want, you can check whether some nested
            // target already handled drop
            return;
        }
        //props.onDrop(monitor.getItem());

        var item = monitor.getItem().item;
        //console.log(item);

        var delta = monitor.getDifferenceFromInitialOffset();
        //console.log(delta);
        if (!!!delta) return;

        if (monitor.getItemType() === ItemTypes.BOX) {
            var left = Math.round(isNaN(item.left) ? 0 : parseInt(item.left, 10) + delta.x);
            var top = Math.round(isNaN(item.top) ? 0 : parseInt(item.top, 10) + delta.y);
			
            component.moveBox(item.index, left, top);
        }

        if (monitor.getItemType() === ItemTypes.RESIZABLE_HANDLE) {
            var left = Math.round(delta.x<0?delta.x + HANDLE_OFFSET: delta.x - HANDLE_OFFSET);
            var top = Math.round(delta.y<0?delta.y + HANDLE_OFFSET: delta.y - HANDLE_OFFSET);
            component.resizeContainer(item.parent, left,top);
        }
    }
};

class Container extends React.Component {
	shouldComponentUpdate(nextProps,nextState) {

		//return true;
		
		
		// The comparison is fast, and we won't render the component if
		// it does not need it. This is a huge gain in performance.
		//var box = this.props.node;
		var update = this.props.node !== nextProps.node || (this.props.current && this.props.current.path) != (nextProps.current && nextProps.current.path);
		
		//if (update)	console.log(nextProps.node.name + ' : ' + update);
		if (update) return update;

		//var propsStyles = this.props.ctx.styles;
		//var nextPropsStyles = nextProps.ctx.styles;
		//update = (propsStyles && propsStyles[box.elementName]) !== (nextPropsStyles && nextPropsStyles[box.elementName]);

		return update;
	}
	
	// componentWillReceiveProps(nextProps) {
	// 	var current = this.props.node;
	// 	var updatedCurrent = nextProps.node;
	// 	console.log(nextProps.node.name);
	// 	if (!updatedCurrent.$selected) return;
	//	
	//	
	//	
	// 	var parent = updatedCurrent.__.parents;
	// 	var parentNode = parent.length !== 0 ? parent[0].__.parents[0] : undefined;
	// 	this.setState({
	// 			current: {
	// 				node: updatedCurrent,
	// 				parentNode: parentNode
	// 			}
	// 		}
	// 	);
	//}
	
	moveBox(index, left, top) {
		var boxes = this.props.boxes;
		if (boxes === undefined) return;
		var box = boxes[index];
		if (box === undefined) return;

		var deltas = snapToGrid(this.context.snapGrid, left, top);
		var updated = box.set({'style': _.merge(_.clone(box.style), {'left': deltas[0], 'top': deltas[1],})});
		//var updated = box.set({'style': {'top': top, 'left': left,'height':box.style.height,'width':box.style.width}});
		this.props.currentChanged(updated);
	}

	resizeContainer(container, deltaWidth, deltaHeight) {
		if (container === undefined) return;

		//TODO: use merge instead of clone
		var style = _.clone(container.style);
		var newWidth = (style.width || 0) + deltaWidth;
		if (newWidth < 0)return;
		var newHeight = (style.height || 0) + deltaHeight;
		if (newHeight < 0)return;

		var deltas = snapToGrid(this.context.snapGrid, newWidth, newHeight);
		style.width = deltas[0];
		style.height = deltas[1];

		//var newStyle = {'style':{'top':container.top,'left':container.left,'width':width,'height':height, 'position':container.position}};
		var updated = container.set({'style': style});
		this.props.currentChanged(updated);
		//currentChanged(updated);
		
	}

	handleClick(e) {
		e.stopPropagation();
		if (this.props.handleClick !== undefined) this.props.handleClick();
	}
	
	render() {
		let { elementName, ctx,widgets, node, parent, dataBinder} = this.props;
		const { canDrop, isOver, connectDropTarget } = this.props;

		var containers = this.props.containers || [];
		var boxes = this.props.boxes || [];

		//styles
		var classes = cx({
			'con': true,
			'selected': this.props.selected,
			'parentSelected': this.props.parentSelected,
			'root': this.props.isRoot
		});

		var styles = {
			left: this.props.left,
			top: this.props.top,
			height: this.props.height,
			width: this.props.width,
			position: this.props.position || 'relative'
		};


		var nodeProps = node.props;
		var nodeBindings = node.bindings || {};
		
		//apply custom styles
		var customStyle = ctx["styles"] && ctx["styles"][elementName];
		if (customStyle !== undefined) nodeProps = _.merge(_.cloneDeep(customStyle), nodeProps)

		//apply node props
		if (this.props.dataBinder !== undefined)nodeProps = this.props.widgetRenderer.bindProps(_.cloneDeep(nodeProps), nodeBindings.bindings, this.props.dataBinder, true);


		var containerComponent = widgets[elementName] || 'div';

		return connectDropTarget(
			<div className={classes} style={styles} onClick={this.handleClick.bind(this)}>
				<div>
					{containers.length !== 0 ? React.createElement(containerComponent, nodeProps, containers.map(function (container, index) {

						var selected = container === this.props.current.node;
						var parentSelected = false; //container === this.props.current.parentNode;
						var key = container.name + index;

						var handleClick = function () {
							if (this.props.currentChanged !== undefined) this.props.currentChanged(container,this.props.path);
						}.bind(this);

						var left = container.style.left === undefined ? 0 : parseInt(container.style.left, 10);
						var top = container.style.top === undefined ? 0 : parseInt(container.style.top, 10);

						//je potreba merge
						var childProps = _.cloneDeep(container.props) || {};
						var childBindings = container.bindings || {};

						//apply custom styles
						var childCustomStyle = ctx["styles"] && ctx["styles"][container.elementName];
						if (childCustomStyle !== undefined) childProps = _.merge(_.cloneDeep(childCustomStyle), childProps)

						//apply node props
						if (dataBinder !== undefined)childProps = this.props.widgetRenderer.bindProps(childProps, childBindings.bindings, dataBinder, true);


						//propagete width and height to child container props
						if (!childProps.width && !!container.style.width) childProps.width = container.style.width;
						if (!childProps.height && !!container.style.height) childProps.height = container.style.height;

						var childComponent = widgets[container.elementName] || 'div';
						var path = `${this.props.path}.containers[${index}]`;  
						return (React.createElement(childComponent, _.extend(childProps,{child:true,key: key}),
							<WrappedContainer elementName={container.elementName}
											  index={index}
											  left={left}
											  top={top}
											  height={container.style.height}
											  width={container.style.width}
											  position={container.style.position || 'relative'}
											  boxes={container.boxes}
											  containers={container.containers}
											  node={container}
											  path={path}
											  parent={this.props.parent}
											  currentChanged={this.props.currentChanged}
											  current={this.props.current}
											  handleClick={handleClick}
											  parentSelected={parentSelected}
											  selected={selected}
											  dataBinder={this.props.dataBinder}
											  ctx={this.props.ctx}
											  widgets={widgets}
											  widgetRenderer={this.props.widgetRenderer}
							/>
						));
					}, this)) : null}

					{boxes.map(function (box, index) {

						var selected = box === this.props.current.node;
						var key = box.name + index;

						var left = box.style.left === undefined ? 0 : parseInt(box.style.left, 10);
						var top = box.style.top === undefined ? 0 : parseInt(box.style.top, 10);

						var path = `${this.props.path}.boxes[${index}]`;
						return (

							<Box key={key}
								 index={index}
								 left={left}
								 top={top}
								 path={path}
								 position={elementName ==="Cell"?'relative':'absolute'}
								 selected={selected}
								 hideSourceOnDrag={this.props.hideSourceOnDrag}
								 currentChanged={this.props.currentChanged}
								 node={box} dataBinder={this.props.dataBinder}
								 ctx={this.props.ctx}
								 widgets={this.props.widgets}
								 widgetRenderer={this.props.widgetRenderer}
							>
							</Box>

						);
					}, this)
					}
				</div>
				{this.props.isRoot || (this.props.width === undefined || this.props.height === undefined) ? null :
					<ResizableHandle parent={this.props.node}/>
				}
			</div>
		);
	}
}

Container.contextTypes =  {
	snapGrid: React.PropTypes.arrayOf(React.PropTypes.number)
}

var collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
});
var WrappedContainer = DropTarget([ItemTypes.RESIZABLE_HANDLE, ItemTypes.BOX], target, collect)(Container);
// Export the wrapped component:
export default WrappedContainer;
//module.exports = Container;
