import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import  ItemTypes  from '../util/ItemTypes.js';

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
    //item: PropTypes.isRequired,


    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
};

class ResizableHandle extends React.Component {
    render() {
        const { isDragging, connectDragSource, item } = this.props;
        return connectDragSource(
            <div className="resizable-handle">
            </div>
        );
    }
};

ResizableHandle.propTypes = propTypes;

// Export the wrapped component:
export default DragSource(ItemTypes.RESIZABLE_HANDLE, source, collect)(ResizableHandle);

