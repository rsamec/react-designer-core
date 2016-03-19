import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes  from '../util/ItemTypes.js';

import _ from 'lodash';
import cx from 'classnames';
import {Transhand} from 'transhand';
import ResizeContainer from './ResizeContainer.js';
import RichTextEditor from '../workplace/RichTextEditor';

/**
 * Implements the drag source contract.
 */
const source = {
    beginDrag(props,monitor,component) {
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
    //item: PropTypes.string.isRequired,

    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
};

class Box extends React.Component
{
    handleDoubleClick(e){
        e.stopPropagation();
        if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.node,React.findDOMNode(this));

    }
    handleClick(e){
        e.stopPropagation();
        if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.node);
    }
    shouldComponentUpdate(nextProps) {

        // The comparison is fast, and we won't render the component if
        // it does not need it. This is a huge gain in performance.
        var box = this.props.node;
        var update =this.props.node !== nextProps.node ||  this.props.selected != nextProps.selected;
		//console.log(nextProps.node.name + ' : ' + update);
		if (update) return update;
		
        var propsStyles = this.props.ctx.styles;
        var nextPropsStyles = nextProps.ctx.styles;
        update = (propsStyles && propsStyles[box.elementName]) !== (nextPropsStyles && nextPropsStyles[box.elementName]);
		
		return update;
    }
    generateCssTransform(transform) {
        var cssTransform = '';

        if (transform.tx !== undefined)  cssTransform += ' translateX(' + transform.tx + 'px)';
        if (transform.ty !== undefined) cssTransform += ' translateY(' + transform.ty + 'px)';
        if (transform.rz !== undefined) cssTransform += ' rotate(' + transform.rz + 'rad)';
        if (transform.sx !== undefined) cssTransform += ' scaleX(' + transform.sx + ')';
        if (transform.sy !== undefined) cssTransform += ' scaleY(' + transform.sy + ')';

        return cssTransform
    }
    render() {
		//prepare styles
        var classes = cx({
            'box':true,
            'selected':this.props.selected
        });

        var box = this.props.node.toJS();
        var ctx = this.props.ctx || {};
        var customStyle = ctx["styles"] && ctx["styles"][box.elementName];
        //var intlData = ctx["intlData"];


        var widgets = this.props.widgets;
        //propagete width and height to widget props
        if (!box.props.width && !!box.style.width) box.props.width = box.style.width;
        if (!box.props.height&& !!box.style.height) box.props.height = box.style.height;

		var WidgetRenderer = this.props.widgetRenderer;

		var boxComponent = WidgetRenderer !== undefined?<WidgetRenderer widget={widgets[box.elementName]} node={box} dataBinder={this.props.dataBinder} customStyle={customStyle} customCode={ctx['customCode']} designer={true} />:<div>No widget renderer provided</div>
        const { isDragging, connectDragSource, item } = this.props;


        var styles = _.omit(box.style,['width','height']);
		
		if (box.style.transform !== undefined) styles['transform']=this.generateCssTransform(box.style.transform);

        return connectDragSource(
            <div style={styles} className={classes} onClick={this.handleClick.bind(this)}>
                <div onDoubleClick={this.handleDoubleClick.bind(this)}>
                    <ResizeContainer node={this.props.node} currentChanged={this.props.currentChanged}>
						{this.props.selected && box.elementName === "Core.RichTextContent"?<RichTextEditor font={box.props.font} current={this.props.node} currentChanged={this.props.currentChanged} content={box.props.content}/>:boxComponent}
                    </ResizeContainer>
                </div>
            </div>
        );
    }
};

Box.propTypes = propTypes;

// Export the wrapped component:
export default DragSource(ItemTypes.BOX, source, collect)(Box);

