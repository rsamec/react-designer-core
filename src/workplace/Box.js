import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import _ from 'lodash';
import cx from 'classnames';

import ResizeContainer from './ResizeContainer.js';

import ItemTypes  from '../util/ItemTypes.js';
import generateCssTransform from '../util/generateCssTransform';

/**
 * Implements the drag source contract.
 */
const source = {
	beginDrag(props, monitor, component) {
		return {
			//effectAllowed: DropEffects.MOVE,
			item: component.props
		};
	}
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
}

const propTypes = {
	// Injected by React DnD:
	isDragging: PropTypes.bool.isRequired,
	connectDragSource: PropTypes.func.isRequired
};

class Box extends React.Component {
	handleDoubleClick(e) {
		e.stopPropagation();
		if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.node, this.props.path, React.findDOMNode(this));
	}

	handleClick(e) {
		e.stopPropagation();
		if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.node,this.props.path);
	}

	shouldComponentUpdate(nextProps) {

		// The comparison is fast, and we won't render the component if
		// it does not need it. This is a huge gain in performance.
		var box = this.props.node;
		var update = box !== nextProps.node || this.props.selected != nextProps.selected;
		//console.log(nextProps.node.name + ' : ' + update);
		if (update) return update;

		//test -> widget custom style changed
		var propsStyles = this.props.ctx.styles;
		var nextPropsStyles = nextProps.ctx.styles;
		update = (propsStyles && propsStyles[box.elementName]) !== (nextPropsStyles && nextPropsStyles[box.elementName]);

		return update;
	}
	

	render() {
		
		const {widgets,widgetRenderer,selected,node,dataBinder, currentChanged} = this.props;
		const {isDragging, connectDragSource, item } = this.props;
		
		//prepare styles
		var classes = cx({
			'box': true,
			'selected': selected
		});

		//clone node
		var box = node.toJS();
		
		//document custom style
		var ctx = this.props.ctx || {};
		var customStyle = ctx["styles"] && ctx["styles"][box.elementName];
		
		//specific props resolution rule -> propagate width and height from style to widget props
		var boxProps = box.props || {};
		var boxStyle = box.style || {};
		if (!boxProps.width && !!boxStyle.width) boxProps.width =boxStyle.width;
		if (!boxProps.height && !!boxStyle.height) boxProps.height = boxStyle.height;
		
		
		var boxComponent = widgetRenderer !== undefined && widgets !== undefined ?
			React.createElement(widgetRenderer,{
				widget:widgets[box.elementName],
				node:box,
				dataBinder:dataBinder,
				customStyle:customStyle,
				customCode:ctx['customCode'],
				designer:true,
				current:node,
				currentChanged:currentChanged,
				selected:selected
			},null) :
			<div>No widget renderer or widget factory provided.</div>;
		
		
		//create style
		var styles = _.extend({position:this.props.position},boxStyle);
		if (boxStyle.transform !== undefined) styles['transform'] = generateCssTransform(boxStyle.transform);

		//wrap with div double click for transhand transformation
		if (box.elementName !== "Core.RichTextContent") boxComponent = <div onDoubleClick={this.handleDoubleClick.bind(this)}>{boxComponent}</div>;
	
		return connectDragSource(
			<div style={styles} className={classes} onClick={this.handleClick.bind(this)}>
				<ResizeContainer node={node} currentChanged={currentChanged}>
					{boxComponent}
				</ResizeContainer>
			</div>
		);
	}
};

Box.propTypes = propTypes;

// Export the wrapped component:
export default DragSource(ItemTypes.BOX, source, collect)(Box);

