import React, { PropTypes, Component } from 'react';
import ItemTypes from '../util/ItemTypes.js';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';

import ResizableHandle from './ResizableHandle.js';


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

        if (monitor.getItemType() === ItemTypes.RESIZABLE_HANDLE) {
            var left = Math.round(delta.x);
            var top = Math.round(delta.y);

            component.resizeContainer(item.parent, left, top);
        };

    }
};
class ResizeContainer extends React.Component {
    resizeContainer(container, deltaWidth, deltaHeight) {
        if (container === undefined) return;

        //TODO: use merge instead of clone
        var style = _.cloneDeep(container.style);
        style.width += deltaWidth;
        style.height += deltaHeight;

        //var newStyle = {'style':{'top':container.top,'left':container.left,'width':width,'height':height, 'position':container.position}};
        var updated = container.set({'style': style});
        this.props.currentChanged(updated);
        //currentChanged(updated);

    }
    render() {

        var style = this.props.node.style;

        //resize handle position
        var handle = 30;
        var useResize = !!style.height && !!style.width;
        var resizeHandlePosition = {top: (style.height - handle), left: (style.width - handle)};


        const { canDrop, isOver, connectDropTarget}  = this.props;

        return connectDropTarget(
            <div>
                {this.props.children}
                {useResize?
                    <ResizableHandle styles={style} left={resizeHandlePosition.left} top={resizeHandlePosition.top} parent={this.props.node}  />:null
                }
            </div>
        );
    }
};

//Container.propTypes = propTypes;

var collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
});

// Export the wrapped component:
export default DropTarget(ItemTypes.RESIZABLE_HANDLE, target, collect)(ResizeContainer);
