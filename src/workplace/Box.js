import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes  from '../util/ItemTypes.js';

import _ from 'lodash';
import cx from 'classnames';
import {WidgetRenderer} from 'react-page-renderer';


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
    item: PropTypes.string.isRequired,

    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
};

class Box extends React.Component
{

    handleClick(e){
        e.stopPropagation();
        if (this.props.handleClick !== undefined) this.props.handleClick();
    }
    shouldComponentUpdate(nextProps) {

        // The comparison is fast, and we won't render the component if
        // it does not need it. This is a huge gain in performance.
        var box = this.props.node;
        var update = this.props.node !== nextProps.node ||  this.props.selected != nextProps.selected || (this.props.ctx["styles"] && this.props.ctx["styles"][box.elementName]) !== (nextProps.ctx["styles"] && nextProps.ctx["styles"][box.elementName]);

        return update;//update;
    }
    render() {
        //prepare styles
        var classes = cx({
            'box':true,
            'selected':this.props.selected
        });

        var box = this.props.node;
        var ctx = this.props.ctx || {};
        var customStyle = ctx["styles"] && ctx["styles"][box.elementName];
        var intlData = ctx["intlData"];

        var widgets = this.props.widgets;
        var boxComponent = <WidgetRenderer widget={widgets[box.elementName]} node={box} dataBinder={this.props.dataBinder} customStyle={customStyle} intlData={intlData} />;
        const { isDragging, connectDragSource, item } = this.props;
        return connectDragSource(
            <div className={classes} style={{left: this.props.left,top: this.props.top}} onClick={this.handleClick.bind(this)}>
                {boxComponent}
            </div>
        );
    }
};

Box.propTypes = propTypes;

// Export the wrapped component:
export default DragSource(ItemTypes.BOX, source, collect)(Box);

