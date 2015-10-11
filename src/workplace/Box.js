import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes  from '../util/ItemTypes.js';

import _ from 'lodash';
import cx from 'classnames';
import {WidgetRenderer} from 'react-page-renderer';
import {Transhand} from 'transhand';
import ResizeContainer from './ResizeContainer.js';
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
        if (update) return update;

        var propsStyles = this.props.ctx.styles;
        var nextPropsStyles = nextProps.ctx.styles;
        return (propsStyles && propsStyles[box.elementName]) !== (nextPropsStyles && nextPropsStyles[box.elementName]);
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
        //if (!box.props.width && !!box.style.width) box.props.width = box.style.width;
        //if (!box.props.height&& !!box.style.height) box.props.height = box.style.height;

        var boxComponent = <WidgetRenderer widget={widgets[box.elementName]} node={box} dataBinder={this.props.dataBinder} customStyle={customStyle} />;
        const { isDragging, connectDragSource, item } = this.props;


        var styles = box.style;
        //var styles = {
        //    left: this.props.left,
        //    top: this.props.top,
        //    height: this.props.height,
        //    width: this.props.width,
        //    position: this.props.position,
        //};
        if (box.style.transform !== undefined) styles['transform']=this.generateCssTransform(box.style.transform);

        return connectDragSource(
            <div style={styles} className={classes} onClick={this.handleClick.bind(this)}>
                <div onDoubleClick={this.handleDoubleClick.bind(this)}>
                    <ResizeContainer node={this.props.node} currentChanged={this.props.currentChanged}>
                        {boxComponent}
                    </ResizeContainer>
                </div>
            </div>
        );
    }
};

Box.propTypes = propTypes;

// Export the wrapped component:
export default DragSource(ItemTypes.BOX, source, collect)(Box);

