import React from 'react';
import {Workplace, ObjectBrowser} from 'react-designer-core';
import SplitPane from 'react-split-pane';

import Widgets from './Widgets';
import WidgetRenderer from './WidgetRenderer';
import Toolbar from './Toolbar';


export default class Designer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {
        node: props.state.schema
      },
      snapGrid: [10, 10]
    }
  }

  currentChanged(currentNode, path) {
    if (currentNode === undefined) return;
    var parent = currentNode.__.parents;
    var parentNode = parent.length !== 0 ? parent[0].__.parents[0] : undefined;
    this.setState({
        current: {
          node: currentNode,
          parentNode: parentNode,
          path: path === undefined ? this.state.current && this.state.current.path : path
        }
      }
    );
  }

  addNewContainer(elName) {

    var itemToAdd = {
      elementName: elName,
      style: elName === 'Container' ? {height: 200, width: 740} : {},
      containers: [],
      boxes: []
    };
    this.addNewItem(itemToAdd);
  }

  addNewCtrl(elName) {
    var itemToAdd = {elementName: elName};
    this.addNewItem(itemToAdd);
  }

  addNewItem(itemToAdd) {
    var current = this.state.current.node;
    if (current === undefined) return;

    if (itemToAdd.name === undefined) itemToAdd['name'] = itemToAdd.elementName;
    if (itemToAdd.style === undefined) itemToAdd['style'] = {};

    var type = itemToAdd.containers !== undefined ? "containers" : "boxes";
    //init empty collection if needed
    var updated = (current[type] === undefined) ? current.set({[type]: [itemToAdd]}) : current[type].push(itemToAdd).__.parents[0];

    this.currentChanged(updated);
  }


  render() {
    var schema = this.props.state.schema;
    var editorState = this.props.editorState || {};
    return (
      <div className="index">

        <SplitPane split="vertical" minSize={80} defaultSize="65vw">
          <div>
            <Workplace schema={schema} current={this.state.current}
                       currentChanged={this.currentChanged.bind(this)} widgets={Widgets}
                       widgetRenderer={WidgetRenderer} snapGrid={this.state.snapGrid}/>
          </div>
          <div>
            <div>
              <button disabled={ editorState.canUndo } type="button"
                      className="btn btn-primary  navbar-btn"
                      onClick={editorState.undo}>
                <span className="glyphicon glyphicon-arrow-left" title="undo"></span>
              </button>
              <button disabled={ editorState.canRedo } type="button"
                      className="btn btn-primary  navbar-btn"
                      onClick={editorState.redo}>
                <span className="glyphicon glyphicon-arrow-right" title="redo"></span>
              </button>
              <span>&nbsp;&nbsp;</span>
                 <span className="dropdown">
											<a href="#" className="dropdown-toggle" data-toggle="dropdown"
                         role="button"
                         aria-haspopup="true" aria-expanded="false">
												<span style={{fontSize:20,margin:5}} className="glyphicon glyphicon-plus"
                              title="actions"></span>
											</a>
											<ul className="dropdown-menu">
                        <li><a onClick={() => this.addNewContainer('Container')}>Container</a></li>
                        <li><a onClick={() => this.addNewContainer('Grid')}>Grid</a></li>
                        <li><a onClick={() => this.addNewContainer('Cell')}>Cell</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a onClick={() => this.addNewCtrl('Core.TextContent')}>Text</a></li>
                        <li><a onClick={() => this.addNewCtrl('Core.RichTextContent')}>Rich text</a></li>
											</ul>
										</span>
										<span className="dropdown">
											<a href="#" className="dropdown-toggle" data-toggle="dropdown"
                         role="button"
                         aria-haspopup="true" aria-expanded="false">
												<span style={{fontSize:20,margin:5}} className="glyphicon glyphicon-th"
                              title="actions"></span>
											</a>
											<ul className="dropdown-menu">
												<li><a onClick={() => {this.setState({snapGrid:[1,1]})}}>0x0</a>
												</li>
												<li><a onClick={() => {this.setState({snapGrid:[5,5]})}}>5x5</a>
												</li>
												<li><a onClick={() => {this.setState({snapGrid:[10,10]})}}>10x10</a>
												</li>
												<li><a onClick={() => {this.setState({snapGrid:[20,20]})}}>20x20</a>
												</li>
												<li><a onClick={() => {this.setState({snapGrid:[50,50]})}}>50x50</a>
												</li>
											</ul>
										</span>
										
              <Toolbar current={this.state.current} currentChanged={this.currentChanged.bind(this)}/>
            </div>

            <ObjectBrowser rootNode={schema} current={this.state.current}
                           currentChanged={this.currentChanged.bind(this)}/>
          </div>
        </SplitPane>
      </div>

    );
  }
}
