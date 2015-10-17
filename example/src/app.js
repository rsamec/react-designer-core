import React from 'react';
import {Button,Panel,Tabs,Tab} from 'react-bootstrap';
import _ from 'lodash';
import Freezer from 'freezer-js';
import BindToMixin from 'react-binding';
import SplitPane from 'react-split-pane';
import PropertyEditor from 'react-property-editor';

import {Workplace,Preview, ObjectBrowser,ObjectPropertyGrid,ComponentMetaData} from 'react-designer-core';
import ToolBox from './ToolBox.js';
import Widgets from './WidgetFactory.js';

import {Modal} from 'react-overlays';
import ModalStyles from './ModalStyles.js';
import Dock from 'react-dock';
import FilePickerDialog from './FilePickerDialog.js';

import WidgetStyleEditor from './WidgetStyleEditor.js';
import DataTemplates from './dataTemplates/DataTemplateExamples.js';

var emptyObjectSchema = {
    elementName: 'ObjectSchema',
    name: 'rootContainer',
    containers: [],
    data: {},
    props: {
        title: undefined,
        defaultData: undefined,
        context: {
            styles: undefined
        }

    }
};
PropertyEditor.registerType('widgetStyleEditor',WidgetStyleEditor);

// Create a Freezer store
var frozen = new Freezer({schema: emptyObjectSchema});

var ToolbarActions = React.createClass({
    up: function () {
        var items = this.props.current.parentNode.containers;
        var itemIndex = items.indexOf(this.props.current.node);
        if (itemIndex === 0) return;

        var element = items[itemIndex];
        var toIndex = _.max([0, itemIndex - 1]);

        var updated = items.splice(itemIndex, 1).splice(toIndex, 0, element);
        this.props.currentChanged(updated[toIndex]);
    },
    down: function () {
        var items = this.props.current.parentNode.containers;
        var itemIndex = items.indexOf(this.props.current.node);
        if (itemIndex === items.length - 1) return;

        var element = items[itemIndex];
        var toIndex = _.min([items.length, itemIndex + 1]);

        var updated = items.splice(itemIndex, 1).splice(toIndex, 0, element);
        this.props.currentChanged(updated[toIndex]);
    },
    removeCtrl: function () {
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

    },
    copy: function () {
        var current = this.props.current.node;
        if (current === undefined) return;
        var parent = this.props.current.parentNode;
        if (parent === undefined) return;

        //clone
        var clone = _.cloneDeep(current);
        clone.name = "Copy " + clone.name;

        var isContainer =  this.isContainer();

        //move down by item height
        if (!isContainer) clone.style.top = (current.style.top || 0) + (current.style.height || 0);

        var items = isContainer ? parent.containers : parent.boxes;

        //add new cloned of selected item
        var updated = items.push(clone);

        //set current
        var index = items.indexOf(current);
        this.props.currentChanged(updated[index]);
    },

    isContainer: function () {
        return this.props.current.node !== undefined && (this.props.current.node.elementName === "Container" || this.props.current.node.elementName === "Repeater")
    },
    render: function () {
        var disabledCurrent = this.props.current.node === undefined || this.props.current.parentNode === undefined;
        var items = this.props.current.parentNode !== undefined ? this.props.current.parentNode.containers : [];
        var disabledMove = disabledCurrent || !this.isContainer() || items.lenght <= 1;

        //if first item - > disable
        var disabledUp = disabledMove || items.indexOf(this.props.current.node) === 0;
        //if last item -> disable
        var disabledDown = disabledMove || items.indexOf(this.props.current.node) === items.length - 1;

        return (
            <div>
                &nbsp;&nbsp;
                <button disabled={ disabledUp } type="button" className="btn btn-primary navbar-btn" onClick={this.up}>
                    <span className="glyphicon glyphicon-open-file" title="move up"></span>
                </button>
                <button disabled={ disabledDown } type="button" className="btn btn-primary navbar-btn" onClick={this.down}>
                    <span className="glyphicon glyphicon-save-file" title="move down"></span>
                </button>
                &nbsp;&nbsp;
                <button disabled={ disabledCurrent } type="button" className="btn btn-primary navbar-btn" onClick={this.copy}>
                    <span className="glyphicon glyphicon-copy" title="copy element"></span>
                </button>
                <button disabled={ disabledCurrent } type="button" className="btn btn-primary navbar-btn"
                        onClick={this.removeCtrl}>
                    <span className="glyphicon glyphicon-trash" title="delete element"></span>
                </button>
            </div>
        );
    }
});

//Designer - top editor
var Designer = React.createClass({
    getInitialState() {
        var store = this.props.store.get();
        return {
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
            previewModalOpen: false
        };
    },
    undo() {
        var nextIndex = this.state.currentStore - 1;
        this.props.store.set(this.state.storeHistory[nextIndex]);
        this.setState({currentStore: nextIndex});
    },
    redo() {
        var nextIndex = this.state.currentStore + 1;
        this.props.store.set(this.state.storeHistory[nextIndex]);
        this.setState({currentStore: nextIndex});
    },
    schema() {
        return this.props.store.get().schema;
    },
    schemaToJson () {
        return JSON.stringify(this.props.store.get().toJS().schema);
    },
    loadObjectSchema(objectSchema, key) {
        var store = this.props.store.get();
        var updated = store.schema.reset(objectSchema);
        this.currentChanged(updated);
        this.setState({storageKey: key});
        this.clearHistory();
    },
    clearHistory () {
        this.setState({
            storeHistory: [this.props.store.get()],
            currentStore: 0
        });
    },
    currentChanged (currentNode) {
        var parent = currentNode.__.parents;
        var parentNode = parent.length !== 0 ? parent[0].__.parents[0] : undefined;
        this.setState({
                current: {
                    node: currentNode,
                    parentNode: parentNode
                }
            }
        );
    },
    addNewContainer(){
        this.addNewCtrl('Container')
    },
    addNewCtrl (elName,itemToAdd) {
        var current = this.state.current.node;
        if (current === undefined) return;


        var isContainer = (elName === "Container" || elName === "Repeater");
        var normalizeElName = elName;
        if (!isContainer) {
            var position = elName.indexOf('.');
            normalizeElName = position !== -1 ? elName.substr(position + 1) : elName;
        }
        var items = isContainer ? current.containers : current.boxes;
        var defaultNewItem = isContainer ? {
            name: "container",
            elementName: elName,
            style: {
                top: 0,
                left: 0,
                height: 200,
                width: 740,
                position: 'relative'
            },
            props: ComponentMetaData[elName].metaData.props,
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

        if (itemToAdd !== undefined){
            defaultNewItem.style.transform = _.clone(itemToAdd.style.transform);
            defaultNewItem.props = _.cloneDeep(itemToAdd.props);
          //  defaultNewItem.style.top = 0;
          //  defaultNewItem.style.left = 0;
        }

        var updated = items.push(defaultNewItem);
        this.currentChanged(updated.__.parents[0]);
    },
    handleTabChange (index) {
        this.setState({
            tabActiveIndex: index
        })
    },
    switchWorkplace () {
        this.setState({jsonShown: !this.state.jsonShown});
    },

    componentDidMount () {
        var me = this;

        // We are going to update the props every time the store changes
        this.props.store.on('update', function (updated) {

            var storeHistory, nextIndex;
            // Check if this state has not been set by the history
            if (updated != me.state.storeHistory[me.state.currentStore]) {

                nextIndex = me.state.currentStore + 1;
                storeHistory = me.state.storeHistory.slice(0, nextIndex);
                storeHistory.push(updated);

                // Set the state will re-render our component
                me.setState({
                    storeHistory: storeHistory,
                    currentStore: nextIndex
                });
            }
            else {
                // The change has been already triggered by the state, no need of re-render
            }
        });
    },
    openModal() {
        this.setState({previewModalOpen: true});

    },
    closeModal(){
        this.setState({dataGeneratorModalOpen: false});
        this.setState({previewModalOpen: false});
    },
    generate(type){

        var contentType = 'image/' + type;
        if (type === "pdf") contentType = 'application/pdf';
        var url = 'http://localhost:8080';
        //var name = this.context.router.getCurrentParams().name;

        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("POST", url + '/' + type);

        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.responseType = 'arraybuffer';

        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var blob = new Blob([xmlhttp.response], {type: contentType});
                var fileURL = URL.createObjectURL(blob);
                window.open(fileURL);
            }
        };
        xmlhttp.send(this.schemaToJson());
    },
    render () {

        var schema = this.schema(),
            disabledUndo = !this.state.currentStore,
            disabledRedo = this.state.currentStore == this.state.storeHistory.length - 1;

        var exportSchema = "data:text/json;charset=utf-8," + encodeURIComponent(this.schemaToJson());
        var exportSchemaName = schema.name + ".json";



        return (
            <div>

                <SplitPane split="vertical" minSize={80} defaultSize="70vw">
                    <div>
                        <Workplace schema={schema} current={this.state.current}
                                   currentChanged={this.currentChanged} widgets={Widgets}/>
                    </div>
                    <div>
                        <SplitPane split="horizontal" className='rightPane'>

                            <div className="propertyContainer">
                                <nav className="navbar navbar-default navbar-fixed-top-custom">
                                    <ul className="nav navbar-nav">
                                        <li>
                                            <button type="button" className="btn btn-primary navbar-btn" onClick={() => {this.addNewCtrl('Container')}}>
                                                    <span className="glyphicon glyphicon-modal-window" title="add section"></span>
                                            </button>
                                            <button type="button" className="btn btn-primary navbar-btn" onClick={() => {this.setState({isVisible: true})}}>
                                                <span className="glyphicon glyphicon-plus" title="show toolbox"></span>
                                            </button>

                                            <button type="button" className="btn btn-primary navbar-btn" onClick={this.openModal}>
                                                    <span className="glyphicon glyphicon-fullscreen"
                                                          title="preview"></span>
                                            </button>
                                        </li>
                                        <li>
                                            <ToolbarActions current={this.state.current}
                                                            currentChanged={this.currentChanged}/>
                                        </li>
                                        <li> &nbsp;&nbsp; </li>
                                        <li>
                                            <button disabled={ disabledUndo } type="button"
                                                    className="btn btn-primary  navbar-btn"
                                                    onClick={this.undo}>
                                                    <span className="glyphicon glyphicon-arrow-left"
                                                          title="undo"></span>
                                            </button>
                                        </li>
                                        <li>
                                            <button disabled={ disabledRedo } type="button"
                                                    className="btn btn-primary  navbar-btn"
                                                    onClick={this.redo}>
                                                    <span className="glyphicon glyphicon-arrow-right"
                                                          title="redo"></span>
                                            </button>
                                        </li>
                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                                <span className="glyphicon glyphicon-menu-hamburger" title="actions"></span>
                                            </a>
                                            <ul className="dropdown-menu">
                                                <li><a onClick={() => {this.generate('pdf')}}>PDF</a></li>
                                                <li><a onClick={() => {this.generate('png')}}>PNG</a></li>
                                                <li role="separator" className="divider"></li>
                                                <li><a onClick={()=> {this.setState({importDlgShow:true})}}>Import</a></li>
                                                <li> <a href={exportSchema} download={exportSchemaName}>Export</a></li>
                                                <li role="separator" className="divider"></li>
                                                <li><a onClick={()=> {this.setState({dataGeneratorModalOpen:true})}}>Data generator</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                                <div className="propertyGrid">
                                    <ObjectPropertyGrid current={this.state.current}
                                                        currentChanged={this.currentChanged} widgets={Widgets}/>
                                </div>
                            </div>
                            <div>
                                <ObjectBrowser rootNode={schema} current={this.state.current}
                                               currentChanged={this.currentChanged}/>
                            </div>
                        </SplitPane>
                    </div>
                </SplitPane>
                <Dock position='right' dimMode='none' isVisible={this.state.isVisible}>
                    <div>
                        <span style={{float:'right'}} className="glyphicon glyphicon-remove"  title="close" onClick={() => this.setState({ isVisible: !this.state.isVisible })}></span>
                    </div>
                    <ToolBox addCtrl={this.addNewCtrl}/>
                </Dock>

                <div>

                    <Modal show={this.state.previewModalOpen} onHide={this.closeModal} style={ModalStyles.modalStyle}
                           backdropStyle={ModalStyles.backdropStyle}>
                        <div style={ModalStyles.dialogStyle}>
                            <Preview widgets={Widgets} schema={schema}/>
                        </div>
                    </Modal>
                    <Modal show={this.state.dataGeneratorModalOpen} onHide={this.closeModal} style={ModalStyles.modalStyle}
                           backdropStyle={ModalStyles.backdropStyle}>
                        <div style={ModalStyles.dialogStyle}>
                            <PropertyEditor value={{template:{}}} settings={{fields:{template:{type:'dataTemplateEditor',settings:{templates:DataTemplates}}}}} />
                        </div>
                    </Modal>
                    <FilePickerDialog show={this.state.importDlgShow} confirm={this.loadObjectSchema} storageKey={this.state.storageKey} onHide={() => {this.setState({importDlgShow:false})}} />

                </div>

            </div>
        )
    }
});

React.render(
    <Designer store={ frozen } original={ frozen.get() }/>,
    document.getElementById('app')
);
