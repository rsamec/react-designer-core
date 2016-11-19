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

var _reactTreeview = require('react-treeview');

var _reactTreeview2 = _interopRequireDefault(_reactTreeview);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var CONTAINER_KEYS = ["ObjectSchema", "Container", "Repeater", "Grid", "Cell", "BackgroundContainer"];

var ObjectBrowser = (function (_React$Component) {
    _inherits(ObjectBrowser, _React$Component);

    function ObjectBrowser(props) {
        _classCallCheck(this, ObjectBrowser);

        _get(Object.getPrototypeOf(ObjectBrowser.prototype), 'constructor', this).call(this, props);
        this.state = { filterText: '' };
    }

    _createClass(ObjectBrowser, [{
        key: 'handleUserInput',
        value: function handleUserInput(e) {
            this.setState({
                filterText: e.target.value
            });
        }
    }, {
        key: 'executeAction',
        value: function executeAction(action, args) {
            if (action === "onDragStart") {
                this.currentItem = args;
                return;
            }
            if (action === "onDrop") {
                this.move(this.currentItem, args);
                this.currentItem = undefined;
                return;
            }
        }
    }, {
        key: 'move',
        value: function move(from, to) {
            //console.log(from.node.name + " -> " + to.node.name);
            // transact returns a mutable object
            // to make all the local changes

            //find source
            var source = from.node;
            var isContainer = _lodash2['default'].contains(CONTAINER_KEYS, source.elementName);

            //move source to target - do it in transaction
            var targetArray = isContainer ? to.node.containers : to.node.boxes;
            targetArray.transact().push(from.node);

            //remove source - do it in transaction
            var sourceParent = isContainer ? from.parentNode.containers : from.parentNode.boxes;
            var indexToRemove = sourceParent.indexOf(source);
            //console.log(indexToRemove);
            if (indexToRemove !== -1) {
                sourceParent.transact().splice(indexToRemove, 1);
            }

            // all the changes are made at once
            targetArray.run();
            sourceParent.run();

            // use it as a normal array
            //trans[0] = 1000; // [1000, 1, 2, ..., 999]
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var classes = (0, _classnames2['default'])({
                'node': true,
                'selected': this.props.current.node === this.props.rootNode
            });
            var path = 'schema';
            return _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                    'div',
                    { className: 'form-group' },
                    _react2['default'].createElement('input', { type: 'search', className: 'form-control', placeholder: 'Search for...', onChange: this.handleUserInput.bind(this) })
                ),
                _react2['default'].createElement(
                    'div',
                    { className: classes, onClick: function (e) {
                            return _this.props.currentChanged(_this.props.rootNode, path);
                        } },
                    this.props.rootNode.name
                ),
                this.props.rootNode.containers.length === 0 ? _react2['default'].createElement(
                    'span',
                    null,
                    'No objects to show.'
                ) : _react2['default'].createElement(TreeNode, { key: 'root', path: path, node: this.props.rootNode, current: this.props.current,
                    currentChanged: this.props.currentChanged.bind(this), filterText: this.state.filterText,
                    executeAction: this.executeAction.bind(this) })
            );
        }
    }]);

    return ObjectBrowser;
})(_react2['default'].Component);

exports['default'] = ObjectBrowser;
;

var TreeNode = (function (_React$Component2) {
    _inherits(TreeNode, _React$Component2);

    function TreeNode() {
        _classCallCheck(this, TreeNode);

        _get(Object.getPrototypeOf(TreeNode.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(TreeNode, [{
        key: 'handleClick',
        value: function handleClick(node, path) {
            this.props.currentChanged(node, path);
        }

        //TODO: optimize -> now each node starts its own tree traversal
    }, {
        key: 'hideNode',
        value: function hideNode(node, filterText) {
            var trav = function trav(node) {
                var containers = node.containers;
                var boxes = node.boxes;
                var anyBoxes = _lodash2['default'].any(boxes, function (item) {
                    return item.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
                });
                if (anyBoxes) return true;
                if (node.name.indexOf(filterText) !== -1) return true;
                //recursion condtion stop
                var childrenBoxes = false;
                for (var i in containers) {
                    //recursion step
                    childrenBoxes = trav(containers[i]);
                    if (childrenBoxes) return true;
                }
                return false;
            };

            return !trav(node);
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return true;
            // The comparison is fast, and we won't render the component if
            // it does not need it. This is a huge gain in performance.
            //var current = this.props.current.node;
            //var nextCurrent = nextProps.current.node;
            //return this.props.filterText != nextProps.filterText ||  this.props.nodes != nextProps.nodes || (current!==undefined && nextCurrent !==undefined && current.name != nextCurrent.name);
        }
    }, {
        key: 'render',
        value: function render() {
            var containers = this.props.node.containers || [];

            return _react2['default'].createElement(
                'div',
                null,
                containers.map(function (node, i) {
                    if (this.hideNode(node, this.props.filterText)) return;

                    var onDragStart = (function (e) {
                        console.log('drag started');
                        e.stopPropagation();
                        var draggingItem = {
                            node: node,
                            parentNode: this.props.node };
                        this.props.executeAction("onDragStart", draggingItem);
                    }).bind(this);
                    var onDragEnter = (function (e) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                        e.stopPropagation();
                        //window.event.returnValue=false;
                        //if (this.props.dragging.type !== this.props.item.type || this.props.dragging.id !== this.props.item.id)  {
                        var dropCandidate = { node: node, parentNode: this.props.node };
                        //    var self = this;
                        this.props.executeAction("dropPossible", dropCandidate);
                        //}
                    }).bind(this);
                    var onDragOver = (function (e) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                        e.stopPropagation();
                        //window.event.returnValue=false;
                    }).bind(this);
                    var onDrop = (function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var dropPlace = { node: node, parentNode: this.props.node };
                        this.props.executeAction("onDrop", dropPlace);
                    }).bind(this);

                    var type = node.elementName;

                    var containers = node.containers || [];
                    var boxes = node.boxes || [];

                    var selected = this.props.current.node === node;
                    var parentSelected = this.props.current.parentNode === node;
                    var path = this.props.path + '.containers[' + i + ']';

                    var classes = (0, _classnames2['default'])({
                        'node': true,
                        'selected': selected,
                        'parentSelected': this.props.parentSelected
                    });

                    var label = _react2['default'].createElement(
                        'span',
                        { draggable: 'true', onDragEnter: onDragEnter,
                            onDragStart: onDragStart,
                            onDragOver: onDragOver, onDrop: onDrop, className: classes, onClick: this.handleClick.bind(this, node, path) },
                        node.name
                    );
                    return _react2['default'].createElement(
                        _reactTreeview2['default'],
                        { key: type + '|' + i, nodeLabel: label, defaultCollapsed: false },
                        _react2['default'].createElement(TreeNode, { key: node.name + '|' + i, node: node, path: path, current: this.props.current, currentChanged: this.props.currentChanged.bind(this), filterText: this.props.filterText, executeAction: this.props.executeAction.bind(this) }),
                        boxes.map(function (box, j) {

                            var onDragStart1 = (function (e) {
                                console.log('drag started');
                                e.stopPropagation();
                                var draggingItem = {
                                    node: box,
                                    parentNode: node };
                                this.props.executeAction("onDragStart", draggingItem);
                            }).bind(this);

                            if (box.name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) {
                                return;
                            }

                            var boxPath = path + '.boxes[' + j + ']';
                            var classes = (0, _classnames2['default'])({
                                'node': true,
                                'selected': this.props.current.node === box
                            });
                            return _react2['default'].createElement(
                                'div',
                                { draggable: 'true', className: classes, onDragStart: onDragStart1, onClick: this.handleClick.bind(this, box, boxPath), key: box.name + j },
                                _react2['default'].createElement(
                                    'span',
                                    null,
                                    box.name
                                )
                            );
                        }, this)
                    );
                }, this)
            );
        }
    }]);

    return TreeNode;
})(_react2['default'].Component);

module.exports = exports['default'];