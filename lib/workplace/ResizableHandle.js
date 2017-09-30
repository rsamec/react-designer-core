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

var _reactDnd = require('react-dnd');

var _utilItemTypesJs = require('../util/ItemTypes.js');

var _utilItemTypesJs2 = _interopRequireDefault(_utilItemTypesJs);

/**
 * Implements the drag source contract.
 */
var source = {
    beginDrag: function beginDrag(props, monitor, component) {
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
var propTypes = {
    //item: PropTypes.isRequired,

    // Injected by React DnD:
    isDragging: _propTypes2['default'].bool.isRequired,
    connectDragSource: _propTypes2['default'].func.isRequired
};

var ResizableHandle = (function (_React$Component) {
    _inherits(ResizableHandle, _React$Component);

    function ResizableHandle() {
        _classCallCheck(this, ResizableHandle);

        _get(Object.getPrototypeOf(ResizableHandle.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ResizableHandle, [{
        key: 'render',
        value: function render() {
            var _props = this.props;
            var isDragging = _props.isDragging;
            var connectDragSource = _props.connectDragSource;
            var item = _props.item;

            return connectDragSource(_react2['default'].createElement('div', { className: 'resizable-handle' }));
        }
    }]);

    return ResizableHandle;
})(_react2['default'].Component);

;

ResizableHandle.propTypes = propTypes;

// Export the wrapped component:
exports['default'] = (0, _reactDnd.DragSource)(_utilItemTypesJs2['default'].RESIZABLE_HANDLE, source, collect)(ResizableHandle);
module.exports = exports['default'];