'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utilItemTypesJs = require('../util/ItemTypes.js');

var _utilItemTypesJs2 = _interopRequireDefault(_utilItemTypesJs);

var _reactDnd = require('react-dnd');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ResizableHandleJs = require('./ResizableHandle.js');

var _ResizableHandleJs2 = _interopRequireDefault(_ResizableHandleJs);

var target = {
    drop: function drop(props, monitor, component) {
        if (monitor.didDrop()) {
            // If you want, you can check whether some nested
            // target already handled drop
            return;
        }

        var item = monitor.getItem().item;

        var delta = monitor.getDifferenceFromInitialOffset();

        if (!!!delta) return;

        if (monitor.getItemType() === _utilItemTypesJs2['default'].RESIZABLE_HANDLE) {
            var left = Math.round(delta.x);
            var top = Math.round(delta.y);

            component.resizeContainer(item.parent, left, top);
        };
    }
};
var HANDLE_OFFSET = 30;

var ResizeContainer = (function (_React$Component) {
    _inherits(ResizeContainer, _React$Component);

    function ResizeContainer() {
        _classCallCheck(this, ResizeContainer);

        _get(Object.getPrototypeOf(ResizeContainer.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ResizeContainer, [{
        key: 'resizeContainer',
        value: function resizeContainer(container, deltaWidth, deltaHeight) {
            if (container === undefined) return;

            //TODO: use merge instead of clone
            var style = _lodash2['default'].cloneDeep(container.style);
            style.width += deltaWidth;
            style.height += deltaHeight;

            var updated = container.set({ 'style': style });
            this.props.currentChanged(updated);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var canDrop = _props.canDrop;
            var isOver = _props.isOver;
            var connectDropTarget = _props.connectDropTarget;

            var style = this.props.node && this.props.node.style || {};

            //resize handle position
            var useResize = !!style.height && !!style.width;
            var resizeHandlePosition = { top: style.height - HANDLE_OFFSET, left: style.width - HANDLE_OFFSET };

            return connectDropTarget(_react2['default'].createElement(
                'div',
                null,
                this.props.children,
                useResize ? _react2['default'].createElement(_ResizableHandleJs2['default'], { styles: style, left: resizeHandlePosition.left, top: resizeHandlePosition.top, parent: this.props.node }) : null
            ));
        }
    }]);

    return ResizeContainer;
})(_react2['default'].Component);

;

var collect = function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
};

// Export the wrapped component:
exports['default'] = (0, _reactDnd.DropTarget)(_utilItemTypesJs2['default'].RESIZABLE_HANDLE, target, collect)(ResizeContainer);
module.exports = exports['default'];