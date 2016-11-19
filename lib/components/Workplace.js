'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactDndHtml5Backend = require('react-dnd-html5-backend');

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

var _reactDnd = require('react-dnd');

var _transhand = require('transhand');

var _workplaceContainer = require('./../workplace/Container');

var _workplaceContainer2 = _interopRequireDefault(_workplaceContainer);

var _utilBackgroundStyle = require('../util/backgroundStyle');

var _utilBackgroundStyle2 = _interopRequireDefault(_utilBackgroundStyle);

var React = require('react');

var DEFAULT_TRANSFORM = {
	tx: 0, ty: 0, //translate in px
	sx: 1, sy: 1, //scale
	rz: 0, //rotation in radian
	ox: 0.5, oy: 0.5 //transform origin
};

var DEFAULT_ROOT_PATH = 'path';

var Workplace = (function (_React$Component) {
	_inherits(Workplace, _React$Component);

	function Workplace(props) {
		_classCallCheck(this, Workplace);

		_get(Object.getPrototypeOf(Workplace.prototype), 'constructor', this).call(this, props);
		this.state = {};
	}

	_createClass(Workplace, [{
		key: 'getChildContext',
		value: function getChildContext() {
			return { snapGrid: this.props.snapGrid };
		}
	}, {
		key: 'handleChange',
		value: function handleChange(change) {
			var currentNode = this.props.current.node;
			if (currentNode == undefined) return;

			var style = currentNode.style;
			if (style === undefined) return;

			//resolution strategy -> defaultTransform -> style.transform -> change
			var transform = _lodash2['default'].merge(_lodash2['default'].merge(_lodash2['default'].clone(DEFAULT_TRANSFORM), style.transform), change);

			var updated = currentNode.set('style', _lodash2['default'].extend(_lodash2['default'].clone(style), { 'transform': transform }));
			this.props.currentChanged(updated);
		}
	}, {
		key: 'currentChanged',
		value: function currentChanged(node, path, domEl) {
			if (this.props.currentChanged !== undefined) this.props.currentChanged(node, path);
			this.setState({
				currentDOMNode: domEl
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props;
			var schema = _props.schema;
			var current = _props.current;
			var currentChanged = _props.currentChanged;
			var dataContext = _props.dataContext;

			var handleClick = function handleClick() {
				if (currentChanged !== undefined) currentChanged(schema, DEFAULT_ROOT_PATH);
			};

			var style = current.node && current.node.style || {};
			var transform = _lodash2['default'].merge(_lodash2['default'].clone(DEFAULT_TRANSFORM), style.transform);

			var ctx = schema.props && schema.props.context || {};
			var customStyles = ctx['styles'] || {};
			var code = ctx['code'] && ctx['code'].compiled;
			var customCode = !!code ? eval(code) : undefined;

			//append shared code to data context
			if (dataContext !== undefined) dataContext.customCode = customCode;

			var context = {
				styles: customStyles,
				customCode: customCode
			};

			var bg = schema.props && schema.props.background || {};
			var bgStyle = (0, _utilBackgroundStyle2['default'])(bg);

			bgStyle.position = 'absolute';
			bgStyle.width = '100%';
			bgStyle.height = '100%';
			bgStyle.zIndex = -1;

			var component = React.createElement(_workplaceContainer2['default'], {
				containers: schema.containers,
				boxes: schema.boxes,
				currentChanged: this.currentChanged.bind(this),
				current: current,
				path: DEFAULT_ROOT_PATH,
				handleClick: handleClick,
				isRoot: true,
				node: schema,
				dataBinder: dataContext,
				ctx: context,
				widgets: this.props.widgets,
				widgetRenderer: this.props.widgetRenderer
			});

			return React.createElement(
				'div',
				{ className: 'cWorkplace' },
				React.createElement('div', { style: bgStyle }),
				component,
				this.state.currentDOMNode !== undefined ? React.createElement(_transhand.CSSTranshand, { transform: transform, deTarget: this.state.currentDOMNode,
					onChange: this.handleChange.bind(this) }) : null
			);
		}
	}]);

	return Workplace;
})(React.Component);

;
Workplace.childContextTypes = { snapGrid: React.PropTypes.arrayOf(React.PropTypes.number) };
exports['default'] = (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2['default'])(Workplace);
module.exports = exports['default'];