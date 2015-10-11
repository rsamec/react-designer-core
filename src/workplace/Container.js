import React, { PropTypes, Component } from 'react';
import ItemTypes from '../util/ItemTypes.js';
import { DropTarget } from 'react-dnd';

import _ from 'lodash';
import cx from 'classnames';

//import TransformContainer from './TransformContainer.js';
import Box from './Box.js';
import ResizableHandle from './ResizableHandle.js';
import ResizeContainer from './ResizeContainer.js';
import If from './../util/If';

var handle = 30;
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
        ;

        if (monitor.getItemType() === ItemTypes.RESIZABLE_HANDLE) {
            var left = Math.round(delta.x);
            var top = Math.round(delta.y);

            component.resizeContainer(item.parent, left, top);
        }
        ;
    }
};
class Container extends React.Component {
    moveBox(index, left, top) {
        var boxes = this.props.boxes;
        if (boxes === undefined) return;
        var box = boxes[index];
        if (box === undefined) return;

        var updated = box.set({'style': _.merge(_.clone(box.style),{'top': top, 'left': left})});
        //var updated = box.set({'style': {'top': top, 'left': left,'height':box.style.height,'width':box.style.width}});
        this.props.currentChanged(updated);
    }

    resizeContainer(container, deltaWidth, deltaHeight) {
        if (container === undefined) return;

        //TODO: use merge instead of clone
        var style = _.clone(container.style);
        style.width += deltaWidth;
        style.height += deltaHeight;

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
            position: this.props.position
        };

        //resize handle position

        var resizeHandlePosition = {top: (this.props.top + this.props.height - handle), left: (this.props.left + this.props.width - handle)};


        const { canDrop, isOver, connectDropTarget } = this.props;

        return connectDropTarget(
            <div className={classes} style={styles} onClick={this.handleClick.bind(this)}>
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
                        return (
                            <WrappedContainer key={key}
                                              index={index}
                                              left={left}
                                              top={top}
                                              height={container.style.height}
                                              width={container.style.width}
                                              position={container.style.position}
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
                                />
                        );
                    }, this)
                    }

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
                                        >
                                    </Box>

                        );
                    }, this)
                    }
                </div>
                <If test={this.props.isRoot?false:true}>
                    <ResizableHandle left={resizeHandlePosition.left} top={resizeHandlePosition.top}
                                     parent={this.props.parent}/>
                </If>
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
var WrappedContainer = DropTarget([ItemTypes.RESIZABLE_HANDLE, ItemTypes.BOX], target, collect)(Container);
// Export the wrapped component:
export default WrappedContainer;

//module.exports = Container;
