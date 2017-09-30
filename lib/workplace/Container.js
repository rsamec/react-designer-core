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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Box = require('./Box');

var _Box2 = _interopRequireDefault(_Box);

var _ResizableHandleJs = require('./ResizableHandle.js');

var _ResizableHandleJs2 = _interopRequireDefault(_ResizableHandleJs);

var HANDLE_OFFSET = 8;

var snapToGrid = function snapToGrid(grid, deltaX, deltaY) {
	var x = Math.round(deltaX / grid[0]) * grid[0];
	var y = Math.round(deltaY / grid[1]) * grid[1];
	return [x, y];
};

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

		if (monitor.getItemType() === _utilItemTypesJs2['default'].BOX) {
			var left = Math.round(isNaN(item.left) ? 0 : parseInt(item.left, 10) + delta.x);
			var top = Math.round(isNaN(item.top) ? 0 : parseInt(item.top, 10) + delta.y);

			component.moveBox(item.index, left, top);
		}

		if (monitor.getItemType() === _utilItemTypesJs2['default'].RESIZABLE_HANDLE) {
			var left = Math.round(delta.x < 0 ? delta.x + HANDLE_OFFSET : delta.x - HANDLE_OFFSET);
			var top = Math.round(delta.y < 0 ? delta.y + HANDLE_OFFSET : delta.y - HANDLE_OFFSET);
			component.resizeContainer(item.parent, left, top);
		}
	}
};

var Container = (function (_React$Component) {
	_inherits(Container, _React$Component);

	function Container() {
		_classCallCheck(this, Container);

		_get(Object.getPrototypeOf(Container.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(Container, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {

			// The comparison is fast, and we won't render the component if
			// it does not need it. This is a huge gain in performance.
			var node = this.props.node;
			var current = this.props.current;
			var update = node !== nextProps.node || (current && current.path) != (nextProps.current && nextProps.current.path);

			if (update) return update;

			//test -> container custom style changed
			var propsStyles = this.props.ctx.styles;
			var nextPropsStyles = nextProps.ctx.styles;
			update = propsStyles !== nextPropsStyles;

			return update;
		}
	}, {
		key: 'moveBox',
		value: function moveBox(index, left, top) {
			var deltas = snapToGrid(this.context.snapGrid, left, top);
			this.moveBoxEx(index, deltas[0], deltas[1]);
		}
	}, {
		key: 'moveBoxEx',
		value: function moveBoxEx(index, left, top) {
			var boxes = this.props.boxes;
			if (boxes === undefined) return;
			var box = boxes[index];
			if (box === undefined) return;

			var updated = box.set({ 'style': _lodash2['default'].merge(_lodash2['default'].clone(box.style), { 'left': left, 'top': top }) });
			this.props.currentChanged(updated);
		}

		// moveBoxToDirection(index, direction) {
		// 	var boxes = this.props.boxes;
		// 	if (boxes === undefined) return;
		// 	var box = boxes[index];
		// 	if (box === undefined) return;

		// 	var deltas = this.getDirectionDeltas(direction);
		// 	var updated = box.set({ 'style': _.merge(_.clone(box.style), { 'left': (box.style.left || 0) + deltas[0], 'top': (box.style.top || 0) + deltas[1], }) });
		// 	this.props.currentChanged(updated);
		// }
	}, {
		key: 'getDirectionDeltas',
		value: function getDirectionDeltas(direction) {
			var snaps = this.context.snapGrid;
			var deltas = [0, 0];
			switch (direction) {
				case "left":
					return [-1 * snaps[0], 0];
				case "right":
					return [snaps[0], 0];
				case "up":
					return [0, -1 * snaps[1]];
				case "down":
					return [0, snaps[1]];
				default:
					return deltas;
			}
		}
	}, {
		key: 'resizeContainer',
		value: function resizeContainer(container, deltaWidth, deltaHeight) {
			if (container === undefined) return;

			//TODO: use merge instead of clone
			var style = _lodash2['default'].clone(container.style) || {};
			var newWidth = (style.width || 0) + deltaWidth;
			if (newWidth < 0) return;
			var newHeight = (style.height || 0) + deltaHeight;
			if (newHeight < 0) return;

			var deltas = snapToGrid(this.context.snapGrid, newWidth, newHeight);
			style.width = deltas[0];
			style.height = deltas[1];

			var updated = container.set({ 'style': style });
			this.props.currentChanged(updated);
		}
	}, {
		key: 'handleClick',
		value: function handleClick(e) {
			e.stopPropagation();
			if (this.props.handleClick !== undefined) this.props.handleClick();
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props;
			var elementName = _props.elementName;
			var ctx = _props.ctx;
			var widgets = _props.widgets;
			var widgetRenderer = _props.widgetRenderer;
			var current = _props.current;
			var currentChanged = _props.currentChanged;
			var node = _props.node;
			var parent = _props.parent;
			var dataBinder = _props.dataBinder;
			var _props2 = this.props;
			var canDrop = _props2.canDrop;
			var isOver = _props2.isOver;
			var connectDropTarget = _props2.connectDropTarget;

			var containers = this.props.containers || [];
			var boxes = this.props.boxes || [];

			//styles
			var classes = (0, _classnames2['default'])({
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
				position: this.props.position || 'relative'
			};

			var nodeProps = node.props;
			var nodeBindings = node.bindings || {};

			//apply custom styles
			var customStyle = ctx["styles"] && ctx["styles"][elementName];
			if (customStyle !== undefined) nodeProps = _lodash2['default'].merge(_lodash2['default'].cloneDeep(customStyle), nodeProps);

			//apply node props
			if (dataBinder !== undefined && widgetRenderer) nodeProps = widgetRenderer.bindProps(_lodash2['default'].cloneDeep(nodeProps), nodeBindings.bindings, dataBinder, true);

			var containerComponent = widgets[elementName] || 'div';

			return connectDropTarget(_react2['default'].createElement(
				'div',
				{ className: classes, style: styles, onClick: this.handleClick.bind(this) },
				_react2['default'].createElement(
					'div',
					null,
					containers.length !== 0 ? _react2['default'].createElement(containerComponent, nodeProps, containers.map(function (container, index) {

						var selected = container === current.node;
						var parentSelected = false; //container === current.parentNode;
						var key = container.name + index;
						var containerStyle = container.style || {};

						var path = this.props.path + '.containers[' + index + ']';

						var handleClick = function handleClick() {
							if (currentChanged !== undefined) currentChanged(container, path);
						};

						var left = containerStyle.left === undefined ? 0 : parseInt(containerStyle.left, 10);
						var top = containerStyle.top === undefined ? 0 : parseInt(containerStyle.top, 10);

						var childProps = _lodash2['default'].cloneDeep(container.props) || {};
						var childBindings = container.bindings || {};

						//apply custom styles
						var childCustomStyle = ctx["styles"] && ctx["styles"][container.elementName];
						if (childCustomStyle !== undefined) childProps = _lodash2['default'].merge(_lodash2['default'].cloneDeep(childCustomStyle), childProps);

						//apply node props
						if (dataBinder !== undefined && widgetRenderer) childProps = widgetRenderer.bindProps(childProps, childBindings.bindings, dataBinder, true);

						//specific props resolution rule -> propagate width and height from style to child container props

						if (!childProps.width && !!containerStyle.width) childProps.width = containerStyle.width;
						if (!childProps.height && !!containerStyle.height) childProps.height = containerStyle.height;
						if (!childProps.left && !!containerStyle.left) childProps.left = containerStyle.left;
						if (!childProps.top && !!containerStyle.top) childProps.top = containerStyle.top;

						var applyDirectChildContainers = elementName == "Grid"; //container.containers && container.containers.length === 0;
						//var childComponent = 'div';
						var wrappedContainer = _react2['default'].createElement(WrappedContainer, { elementName: container.elementName,
							index: index,
							left: left,
							top: top,
							height: containerStyle.height,
							width: containerStyle.width,
							position: containerStyle.position || 'relative',
							boxes: container.boxes,
							containers: container.containers,
							node: container,
							path: path,
							parent: parent,
							currentChanged: currentChanged,
							current: current,
							handleClick: handleClick,
							parentSelected: parentSelected,
							selected: selected,
							dataBinder: dataBinder,
							ctx: ctx,
							widgets: widgets,
							widgetRenderer: widgetRenderer
						});

						return applyDirectChildContainers ? _react2['default'].createElement(widgets[container.elementName] || 'div', _lodash2['default'].extend(childProps, { child: true, key: key }), wrappedContainer) : wrappedContainer;
					}, this)) : null,
					boxes.map(function (box, index) {

						var selected = box === current.node;
						var key = box.name + index;

						var boxStyle = box.style || {};
						var left = boxStyle.left === undefined ? 0 : parseInt(box.style.left, 10);
						var top = boxStyle.top === undefined ? 0 : parseInt(box.style.top, 10);

						var path = this.props.path + '.boxes[' + index + ']';

						var box = _react2['default'].createElement(_Box2['default'], { key: key,
							index: index,
							left: left,
							top: top,
							path: path,
							position: elementName === "Cell" ? 'relative' : 'absolute',
							selected: selected,
							hideSourceOnDrag: this.props.hideSourceOnDrag,
							currentChanged: currentChanged,
							node: box, dataBinder: dataBinder,
							ctx: ctx,
							widgets: widgets,
							widgetRenderer: widgetRenderer
						});

						return box;
					}, this)
				),
				this.props.isRoot || this.props.width === undefined || this.props.height === undefined ? null : _react2['default'].createElement(_ResizableHandleJs2['default'], { parent: this.props.node })
			));
		}
	}]);

	return Container;
})(_react2['default'].Component);

Container.contextTypes = {
	snapGrid: _propTypes2['default'].arrayOf(_propTypes2['default'].number)
};

var collect = function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	};
};
var WrappedContainer = (0, _reactDnd.DropTarget)([_utilItemTypesJs2['default'].RESIZABLE_HANDLE, _utilItemTypesJs2['default'].BOX], target, collect)(Container);
exports['default'] = WrappedContainer;
module.exports = exports['default'];