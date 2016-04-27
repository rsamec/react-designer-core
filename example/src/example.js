import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import Freezer from 'freezer-js';
import Binder from 'react-binding';
import Dock from 'react-dock';
import WidgetRenderer from './components/WidgetRenderer';
import {Workplace,ObjectBrowser} from 'react-designer-core';

import ObjectPropertyGrid from './components/ObjectPropertyGrid';
import ToolBox from './components/ToolBox.js';

import Widgets from './components/WidgetFactory.js';
import FilePickerDialog from './components/FilePickerDialog.js';
import SplitPane from 'react-split-pane';
import Preview from './components/Preview';

import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import {Modal} from 'react-overlays';
import ModalStyles from './components/ModalStyles.js';

//const BASE_SERVICE_URL = 'http://www.paperify.io'
//const BASE_SERVICE_URL = 'http://photo-papermill.rhcloud.com';
//const BASE_SERVICE_URL = 'http://render-pergamon.rhcloud.com';
const BASE_SERVICE_URL = 'http://localhost:8080';
let SERVICE_URL = BASE_SERVICE_URL + '/api';
/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
var emptyObjectSchema = {
	elementName: 'ObjectSchema',
	name: 'rootContainer',
	containers: [],
	props: {
		pageOptions:{width: 794,height:1123},
		context: {}
	}
};
var isContainerFce = (elementName) => {return (elementName === "Container"  || elementName === "BackgroundContainer"  || elementName === "Grid" || elementName === "Cell" || elementName === "Repeater") }
// Create a Freezer store
var frozen = new Freezer({schema: emptyObjectSchema});

class ToolbarActions extends React.Component {
	up() {
		var items = this.props.current.parentNode.containers;
		var itemIndex = items.indexOf(this.props.current.node);
		if (itemIndex === 0) return;

		var element = items[itemIndex];
		var toIndex = _.max([0, itemIndex - 1]);

		var updated = items.splice(itemIndex, 1).splice(toIndex, 0, element);
		this.props.currentChanged(updated[toIndex]);
	}

	down() {
		var items = this.props.current.parentNode.containers;
		var itemIndex = items.indexOf(this.props.current.node);
		if (itemIndex === items.length - 1) return;

		var element = items[itemIndex];
		var toIndex = _.min([items.length, itemIndex + 1]);

		var updated = items.splice(itemIndex, 1).splice(toIndex, 0, element);
		this.props.currentChanged(updated[toIndex]);
	}

	removeCtrl() {
		var current = this.props.current.node;
		if (current === undefined) return;
		var parent = this.props.current.parentNode;
		if (parent === undefined) return;

		var items = this.isContainer() ? parent.containers : parent.boxes;

		//remove selected item
		var index = items.indexOf(current);
		var updated = items.splice(index, 1);

		//set current
		if (index < items.length) {
			this.props.currentChanged(updated[index]);
		}
	}

	copy() {
		var current = this.props.current.node;
		if (current === undefined) return;
		var parent = this.props.current.parentNode;
		if (parent === undefined) return;

		//clone
		var clone = _.cloneDeep(current);
		clone.name = "Copy " + clone.name;

		var isContainer = this.isContainer();

		//move down by item height
		if (!isContainer) clone.style.top = (current.style.top || 0) + (current.style.height || 0);

		var items = isContainer ? parent.containers : parent.boxes;

		//add new cloned of selected item
		var updated = items.push(clone);

		//set current
		var index = items.indexOf(current);
		this.props.currentChanged(updated[index]);
	}

	isContainer() {
		return this.props.current.node !== undefined && isContainerFce(this.props.current.node.elementName);
	}

	render() {
		var disabledCurrent = this.props.current.node === undefined || this.props.current.parentNode === undefined;
		var items = this.props.current.parentNode !== undefined ? this.props.current.parentNode.containers : [];
		var disabledMove = disabledCurrent || !this.isContainer() || items.lenght <= 1;

		//if first item - > disable
		var disabledUp = disabledMove || items.indexOf(this.props.current.node) === 0;
		//if last item -> disable
		var disabledDown = disabledMove || items.indexOf(this.props.current.node) === items.length - 1;

		return (
			<span>
				&nbsp;&nbsp;
				<button disabled={ disabledUp } type="button" className="btn btn-primary navbar-btn"
						onClick={this.up.bind(this)}>
					<span className="glyphicon glyphicon-open-file" title="move up"></span>
				</button>
				<button disabled={ disabledDown } type="button" className="btn btn-primary navbar-btn"
						onClick={this.down.bind(this)}>
					<span className="glyphicon glyphicon-save-file" title="move down"></span>
				</button>
				&nbsp;&nbsp;
				<button disabled={ disabledCurrent } type="button" className="btn btn-primary navbar-btn"
						onClick={this.copy.bind(this)}>
					<span className="glyphicon glyphicon-copy" title="copy element"></span>
				</button>
				<button disabled={ disabledCurrent } type="button" className="btn btn-primary navbar-btn"
						onClick={this.removeCtrl.bind(this)}>
					<span className="glyphicon glyphicon-trash" title="delete element"></span>
				</button>
			</span>
		);
	}
}

let FixedHeader = (props) => {
	return (<div style={{position:'absolute',width:'100%',paddingRight:30}}>
		<div className="toolBox header" style={{width:'100%',position:'relative',zIndex:2}}>
			{props.children}
		</div>
	</div>)
}

let staticCounter = 0;

//Designer - top editor
class Designer extends React.Component {
	constructor(props) {
		super(props);
		var store = this.props.store.get();
		this.state = {
			// We create a state with all the history
			// and the index to the current store
			storageKey: 'Untitled',
			storeHistory: [store],
			currentStore: 0,
			jsonShown: false,
			current: {
				node: store.schema
			},
			openDlgShow: false,
			saveDlgShow: false,
			importDlgShow: false,
			previewModalOpen: false,
			toolboxVisible: false,
			snapGrid: [10, 10],
			data: _.cloneDeep(store.schema.props && store.schema.props.defaultData) || {}
		};

		this.saveChanges = _.debounce(this.saveChanges,10000);
	}

	undo() {
		var nextIndex = this.state.currentStore - 1;
		this.props.store.set(this.state.storeHistory[nextIndex]);
		this.setState({currentStore: nextIndex});
	}

	redo() {
		var nextIndex = this.state.currentStore + 1;
		this.props.store.set(this.state.storeHistory[nextIndex]);
		this.setState({currentStore: nextIndex});
	}
	schema() {
		return this.props.store.get().schema;
	}
	schemaToJson() {
		return JSON.stringify(this.props.store.get().toJS().schema);
	}

	loadObjectSchema(objectSchema, key) {
		var store = this.props.store.get();
		var updated = store.schema.reset(objectSchema);
		this.currentChanged(updated);
		this.setState({storageKey: key});
		this.clearHistory();
	}

	clearHistory() {
		this.setState({
			storeHistory: [this.props.store.get()],
			currentStore: 0
		});
	}

	currentChanged(currentNode,path) {
		if (currentNode === undefined) return;
		
		var lastCurrentPath = this.state.current && this.state.current.path;
		if (path === undefined) path = lastCurrentPath;
		
		var parent = currentNode.__.parents;
		var parentNode = parent.length !== 0 ? parent[0].__.parents[0] : undefined;
		this.setState({
				current: {
					node: currentNode,
					parentNode: parentNode,
					path:path
				}
			}
		);
	}

	addNewContainer() {
		this.addNewCtrl('Container')
	}

	addNewCtrl(elName, itemToAdd) {
		var current = this.state.current.node;
		if (current === undefined) return;

		if (elName === "Group") {
			this.currentChanged(current.containers.push(_.cloneDeep(itemToAdd.container)).__.parents[0]);
			return;
		}


		var isContainer = isContainerFce(elName);
		var normalizeElName = elName;
		if (!isContainer) {
			var position = elName.indexOf('.');
			normalizeElName = position !== -1 ? elName.substr(position + 1) : elName;
		}
		var items = isContainer ? current.containers : current.boxes;
		var defaultNewItem = isContainer ? {
			name: normalizeElName,
			elementName: elName,
			style: (elName === "Container" || elName === "Repater" || elName === "BackgroundContainer") ? {
				top: 0,
				left: 0,
				height: 200,
				width: 740,
				position: 'relative'
			} : {},
			props: {},
			boxes: [],
			containers: []
		}
			: {
			name: normalizeElName,
			elementName: elName,
			style: {
				top: 0,
				left: 0
			},
			props: {}
		};

		if (itemToAdd !== undefined) {
			defaultNewItem.style.transform = _.clone(itemToAdd.style && itemToAdd.style.transform);
			defaultNewItem.props = _.cloneDeep(itemToAdd.props);
			//  defaultNewItem.style.top = 0;
			//  defaultNewItem.style.left = 0;
		}


		var updated = items.push(defaultNewItem);
		this.currentChanged(updated.__.parents[0]);
	}

	handleTabChange(index) {
		this.setState({
			tabActiveIndex: index
		})
	}

	switchWorkplace() {
		this.setState({jsonShown: !this.state.jsonShown});
	}

	componentDidMount() {
		var me = this;
		
		// this.props.store.on('beforeAll', function( eventName, arg1, arg2 ){
		// 	console.log( event, arg1, arg2 );
		// });

			// We are going to update the props every time the store changes
		this.props.store.on('update', function (updated,prevState) {

			var storeHistory, nextIndex;
			// Check if this state has not been set by the history
			if (updated != me.state.storeHistory[me.state.currentStore]) {

				nextIndex = me.state.currentStore + 1;
				storeHistory = me.state.storeHistory.slice(0, nextIndex);
				storeHistory.push(updated);

				var prevSchema = prevState.schema;
				var defaultData = prevSchema.props && prevSchema.props.defaultData;
				var updatedSchema = updated.schema;
				var newDefautData = updatedSchema.props && updatedSchema.props.defaultData;

				if (defaultData !== newDefautData) me.setState({data: _.cloneDeep(newDefautData)});

				// Set the state will re-render our component
				me.setState({
					storeHistory: storeHistory,
					currentStore: nextIndex
				});
				
				
				me.saveChanges();
			}
			else {
				// The change has been already triggered by the state, no need of re-render
			}
		});
	}

	generate(type) {

		var contentType = 'image/' + type;
		if (type === "pdf") contentType = 'application/pdf';
		//var url = 'http://render-pergamon.rhcloud.com';
		//var url = 'http://photo-papermill.rhcloud.com';
		//var url = 'http://localhost:8080';
		//var name = this.context.router.getCurrentParams().name;

		var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
		xmlhttp.open("POST", SERVICE_URL + '/' + type);

		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.responseType = 'arraybuffer';

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var blob = new Blob([xmlhttp.response], {type: contentType});
				var fileURL = URL.createObjectURL(blob);
				window.open(fileURL);
			}
		};
		xmlhttp.send(this.schemaToJson());
	}
	saveChanges(){
		
		if (this.props.schemaId === undefined) return;
		console.log("Attempt to save changes .");

		//return;
		
		var me = this;
		var schema = this.schema();
		var name = schema.name;
		
		schema = this.schemaToJson();
		
		$.ajax({
			type: "PUT",
			url: SERVICE_URL + "/docs/" + this.props.schemaId,
			data: {
				schemaTemplate: schema,
				name: name,
				owner: '56b1147e42dea27c23ba397e'
			},
			dataType: 'json',
			success: function (data) {
				console.log("Save success.");
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log("Save failure.");
				alert("failed");
			}
		})
	}
	publish() {
		var me = this;
		var schema = this.schema();
		var name = schema.name;
		var schema = this.schemaToJson();
		me.setState({publishOpen: true, published: false});
		$.ajax({
			type: "POST",
			url: SERVICE_URL + "/docs",
			data: {
				schemaTemplate: schema,
				name: name,
				owner: '56b1147e42dea27c23ba397e'
			},
			dataType: 'json',
			success: function (data) {
				me.setState({
					published: true,
					publishInfo: {
						name: data.name,
						url:  BASE_SERVICE_URL + '/view/#/' + data._id
					}
				})
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert("failed");
			}
		})
	}

	render() {

		var schema = this.schema(),
			disabledUndo = !this.state.currentStore,
			disabledRedo = this.state.currentStore == this.state.storeHistory.length - 1;

		var exportSchema = "data:text/json;charset=utf-8," + encodeURIComponent(this.schemaToJson());
		var exportSchemaName = schema.name + ".json";

		var published = this.state.published || false;
		var publishInfo = this.state.publishInfo || {};

		var dataContext = Binder.bindToState(this, 'data');
		return (
			<div>

				<SplitPane split="vertical" minSize={80} defaultSize="65vw">
					<div>
						<Workplace schema={schema} current={this.state.current} dataContext={dataContext}
								   currentChanged={this.currentChanged.bind(this)} widgets={Widgets}
								   widgetRenderer={WidgetRenderer} snapGrid={this.state.snapGrid}/>
					</div>
					<div>
						<SplitPane split="horizontal" className='rightPane'>
							<div style={{width:'100%'}}>
								<div className="propertyBox header">
									<div className="pull-right">
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
										<span className="dropdown">
											<a href="#" className="dropdown-toggle" data-toggle="dropdown"
											   role="button"
											   aria-haspopup="true" aria-expanded="false">
												<span style={{fontSize:20,margin:5}}  className="glyphicon glyphicon-menu-hamburger"
													  title="actions"></span>
											</a>
											<ul className="dropdown-menu">
												<li><a
													onClick={()=> {this.setState({importDlgShow:true})}}>Import</a>
												</li>
												<li><a href={exportSchema} download={exportSchemaName}>Export</a>
												</li>
												<li role="separator" className="divider"></li>
												<li><a onClick={this.publish.bind(this)}>Publish</a></li>
												<li role="separator" className="divider"></li>
												<li><a onClick={() => {this.setState({schemaOpen: true})}}>Schema</a></li>
												<li role="separator" className="divider"></li>
												<li><a onClick={this.generate.bind(this,'pdf')}>PDF</a></li>
												<li><a onClick={this.generate.bind(this,'jpg')}>JPG</a></li>
											</ul>
										</span>
										<ToolbarActions current={this.state.current} currentChanged={this.currentChanged.bind(this)}/>
									</div>
									<div>
										<button type="button" className="btn btn-primary navbar-btn"
												onClick={() => {this.addNewCtrl('Container')}}>
												<span className="glyphicon glyphicon-new-window"
													  title="add section"></span>
										</button>
										<button type="button" className="btn btn-primary navbar-btn"
												onClick={() => this.setState({toolboxVisible: true})}>
                                                    <span className="glyphicon glyphicon-plus"
														  title="preview"></span>
										</button>
										<span>&nbsp;&nbsp;</span>
										<button type="button" className="btn btn-primary navbar-btn"
												onClick={() => this.setState({previewModalOpen: true})}>
                                                    <span className="glyphicon glyphicon-fullscreen"
														  title="preview"></span>
										</button>
										<span>&nbsp;&nbsp;</span>
										<button disabled={ disabledUndo } type="button"
												className="btn btn-primary  navbar-btn"
												onClick={this.undo.bind(this)}>
                                                    <span className="glyphicon glyphicon-arrow-left"
														  title="undo"></span>
										</button>
										<button disabled={ disabledRedo } type="button"
												className="btn btn-primary  navbar-btn"
												onClick={this.redo.bind(this)}>
                                                    <span className="glyphicon glyphicon-arrow-right"
														  title="redo"></span>
										</button>
										
										
									</div>
									
								</div>
								<div>
									<ObjectPropertyGrid current={this.state.current}
														currentChanged={this.currentChanged.bind(this)}
														widgets={Widgets}/>
								</div>
							</div>
							<div>
								<div className="objectBrowser header"><h4>Component tree</h4></div>
								<ObjectBrowser rootNode={schema} current={this.state.current}
											   currentChanged={this.currentChanged.bind(this)}/>
							</div>
						</SplitPane>
					</div>
				</SplitPane>
				<Dock position='right' dimMode={this.state.toolboxPin?"none":"opaque"}
					  isVisible={this.state.toolboxVisible}
					  onVisibleChange={(isVisible) => this.setState({ toolboxVisible:isVisible })}>
					{/* you can pass a function as a child here */}
					<div>
						<FixedHeader>
							<div style={{float:'right'}}>
								<button type="button" className="btn btn-primary navbar-btn"
										onClick={() => this.setState({ toolboxPin: !this.state.toolboxPin })}>
									{this.state.toolboxPin ?
										<span className="glyphicon glyphicon-paperclip" title="pin"/> :
										<span className="glyphicon glyphicon-pushpin" title="pin"/>}
								</button>
								<button type="button" className="btn btn-primary navbar-btn"
										onClick={() => this.setState({ toolboxVisible: !this.state.toolboxVisible })}>
														<span className="glyphicon glyphicon-remove-sign"
															  title="close"></span>
								</button>
								
							</div>
							<h3>Components</h3>
						</FixedHeader>
						<div style={{paddingTop:60,paddingLeft:5,}}>
							<ToolBox addCtrl={this.addNewCtrl.bind(this)}/>
						</div>
					</div>
				</Dock>
				<div>
					<Modal show={this.state.previewModalOpen} onHide={()=>{	this.setState({previewModalOpen: false})}}
						   style={ModalStyles.modalStyle} backdropStyle={ModalStyles.backdropStyle}>
						<div style={ModalStyles.dialogStyle}>
							<Preview
								widgets={Widgets}
								schema={schema}/>
						</div >
					</ Modal >
					<Modal show={this.state.schemaOpen} onHide={()=>{this.setState({schemaOpen: false})}}
						   style={ModalStyles.modalStyle}
						   backdropStyle={ModalStyles.backdropStyle}>
						<div style={ModalStyles.dialogStyle}>
							{JSON.stringify(this.props.store.get().toJS().schema, null, 2)}
						</div>
					</Modal>
					<FilePickerDialog show={this.state.importDlgShow} confirm={this.loadObjectSchema.bind(this)}
									  storageKey={this.state.storageKey}
									  onHide={() => {this.setState({importDlgShow:false})}}/>
					<Modal show={this.state.publishOpen} onHide={()=>{this.setState({publishOpen: false})}}
						   style={ModalStyles.modalStyle}
						   backdropStyle={ModalStyles.backdropStyle}
					>
						<div style={ModalStyles.dialogStyle}>
							{published ?
								<div><h4>{publishInfo.name}</h4><a target="_blank"
																   href={publishInfo.url}>{publishInfo.url}</a></div> :
								<span>Please, wait, publishing ...</span>}
						</div>

					</Modal>
				</div>

			</div>
		)
	}
}

let Spinner = (props) => {
	if (props.error!== undefined && props.error.hasError) return <span>{props.error.errorMessage}</span>
	return <span>Loading...</span>
}

class DesignView extends React.Component {
	constructor(props){
		super(props);
		this.state = {loaded:false}
	}
	
	componentDidMount() {
		//nothing to load - fallback to empty 
		if (this.props.params.id === undefined) {
			this.setState({loaded:true});
			return;
		}
		
		//load schema
		var url = SERVICE_URL + "/docs/" + this.props.params.id;
		var me = this;
		$.ajax({
			type: "GET",
			url:url,
			dataType: 'json',
			success: function (data) {
				var schema = JSON.parse(data.schemaTemplate);
				frozen = new Freezer({schema: schema});
				me.setState({
					loaded: true,
					//frozen: new Freezer({schema: schema})
				});
			},
			error: function (xhr, ajaxOptions, thrownError) {
				me.setState({
					loaded: false,
					error: {
						hasError: true, errorMessage: xhr.responseText
					}
				});
			}
		})
	}
	
	render() {
		if (this.state.loaded) {
			return <Designer store={ frozen } original={ frozen.get() } schemaId={this.props.params.id}/>
		} else {
			return <Spinner error={this.state.error} />;
		}
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
};

ReactDOM.render((
	// Render the main component into the dom
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={DesignView}/>
			<Route path=":id" component={DesignView}/>
		</Route>
	</Router>
), document.getElementById('app'));

//ReactDOM.render(
//	<Designer store={ frozen } original={ frozen.get() }/>
//	, document.getElementById('app'));
