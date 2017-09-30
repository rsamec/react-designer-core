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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactDnd = require('react-dnd');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ResizeContainerJs = require('./ResizeContainer.js');

var _ResizeContainerJs2 = _interopRequireDefault(_ResizeContainerJs);

var _utilItemTypesJs = require('../util/ItemTypes.js');

var _utilItemTypesJs2 = _interopRequireDefault(_utilItemTypesJs);

var _utilGenerateCssTransform = require('../util/generateCssTransform');

var _utilGenerateCssTransform2 = _interopRequireDefault(_utilGenerateCssTransform);

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
	// Injected by React DnD:
	isDragging: _propTypes2['default'].bool.isRequired,
	connectDragSource: _propTypes2['default'].func.isRequired
};

var Box = (function (_React$Component) {
	_inherits(Box, _React$Component);

	function Box() {
		_classCallCheck(this, Box);

		_get(Object.getPrototypeOf(Box.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(Box, [{
		key: 'handleDoubleClick',
		value: function handleDoubleClick(e) {
			e.stopPropagation();
			if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.node, this.props.path, _reactDom2['default'].findDOMNode(this));
		}
	}, {
		key: 'handleClick',
		value: function handleClick(e) {
			e.stopPropagation();
			if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.node, this.props.path);
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps) {

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

		// componentWillReceiveProps(nextProps){		
		// 	var index = this.props.index;
		// 	for (var action of ['right','left','up','down'])
		// 	{
		// 		if (nextProps.selected)this.props.bindShortcut(action, this.props.moveBox.bind(this,index,action));//: this.props.unbindShortcut(action);
		// 	}
		// }
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props;
			var widgets = _props.widgets;
			var widgetRenderer = _props.widgetRenderer;
			var selected = _props.selected;
			var node = _props.node;
			var dataBinder = _props.dataBinder;
			var currentChanged = _props.currentChanged;
			var index = _props.index;
			var _props2 = this.props;
			var isDragging = _props2.isDragging;
			var connectDragSource = _props2.connectDragSource;
			var item = _props2.item;

			//prepare styles
			var classes = (0, _classnames2['default'])({
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
			if (!boxProps.width && !!boxStyle.width) boxProps.width = boxStyle.width;
			if (!boxProps.height && !!boxStyle.height) boxProps.height = boxStyle.height;

			var boxComponent = widgetRenderer !== undefined && widgets !== undefined ? _react2['default'].createElement(widgetRenderer, {
				tabIndex: index,
				widget: widgets[box.elementName],
				node: box,
				dataBinder: dataBinder,
				customStyle: customStyle,
				customCode: ctx['customCode'],
				designer: true,
				current: node,
				currentChanged: currentChanged,
				selected: selected
			}, null) : _react2['default'].createElement(
				'div',
				null,
				'No widget renderer or widget factory provided.'
			);

			//create style
			var styles = _lodash2['default'].extend({ position: this.props.position }, boxStyle);
			if (boxStyle.transform !== undefined) styles['transform'] = (0, _utilGenerateCssTransform2['default'])(boxStyle.transform);

			//wrap with div double click for transhand transformation
			if (box.elementName !== "Core.RichTextContent") boxComponent = _react2['default'].createElement(
				'div',
				{ onDoubleClick: this.handleDoubleClick.bind(this) },
				boxComponent
			);

			return connectDragSource(_react2['default'].createElement(
				'div',
				{ style: styles, className: classes, onClick: this.handleClick.bind(this) },
				_react2['default'].createElement(
					_ResizeContainerJs2['default'],
					{ node: node, currentChanged: currentChanged },
					boxComponent
				)
			));
		}
	}]);

	return Box;
})(_react2['default'].Component);

;

Box.propTypes = propTypes;
// Export the wrapped component:
exports['default'] = (0, _reactDnd.DragSource)(_utilItemTypesJs2['default'].BOX, source, collect)(Box);
module.exports = exports['default'];