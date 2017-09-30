import React from 'react';
import TreeView from 'react-treeview';
import _ from 'lodash';
import cx from 'classnames';

const  CONTAINER_KEYS  = ["ObjectSchema","Container","Repeater","Grid","Cell","BackgroundContainer"];

export default class ObjectBrowser extends React.Component {
	constructor(props) {
		super(props)
		this.state = {filterText: ''};
	}	
    handleUserInput(e) {
        this.setState({
            filterText: e.target.value
        });
    }
    executeAction(action,args){
        if (action === "onDragStart"){
            this.currentItem =  args;
            return;
        }
        if (action === "onDrop"){
            this.move(this.currentItem,args);
            this.currentItem = undefined;
            return;
        }
    }
    move(from, to){
        //console.log(from.node.name + " -> " + to.node.name);
        // transact returns a mutable object
        // to make all the local changes

        //find source
        var source = from.node;
        var isContainer = _.includes(CONTAINER_KEYS,source.elementName);
		
        //move source to target - do it in transaction
        var targetArray = isContainer? to.node.containers:to.node.boxes;
        targetArray.transact().push(from.node);

        //remove source - do it in transaction
        var sourceParent = isContainer?from.parentNode.containers:from.parentNode.boxes;
        var indexToRemove = sourceParent.indexOf(source);
        //console.log(indexToRemove);
        if (indexToRemove !== -1) {
            sourceParent.transact().splice(indexToRemove,1);
        }

        // all the changes are made at once
        targetArray.run();
        sourceParent.run();

        // use it as a normal array
        //trans[0] = 1000; // [1000, 1, 2, ..., 999]
    }
    render() {
		var classes = cx({
			'node': true,
			'selected': this.props.current.node === this.props.rootNode
		});
		let path = 'schema';
        return (
            <div>
                <div className="form-group">
                     <input type="search" className="form-control" placeholder="Search for..." onChange={this.handleUserInput.bind(this)} />
                </div>
				<div className={classes} onClick={(e)=>this.props.currentChanged(this.props.rootNode,path)}>{this.props.rootNode.name}</div>
                {this.props.rootNode.containers.length === 0 ? <span>No objects to show.</span> :
                    <TreeNode key="root" path={path} node={this.props.rootNode} current={this.props.current}
                              currentChanged={this.props.currentChanged.bind(this)} filterText={this.state.filterText}
                              executeAction={this.executeAction.bind(this)}/>
                }
            </div>
        );
    }
};

class TreeNode extends React.Component
{
    handleClick(node,path) {
        this.props.currentChanged(node,path);
    }

    //TODO: optimize -> now each node starts its own tree traversal
    hideNode(node,filterText){
        var trav = function(node){
            var containers = node.containers;
            var boxes = node.boxes;
            var anyBoxes = _.some(boxes,function(item){return item.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1});
            if (anyBoxes) return true;
            if (node.name.indexOf(filterText) !== -1) return true;
            //recursion condtion stop
            var childrenBoxes = false;
            for (var i in containers)
            {
                //recursion step
                childrenBoxes = trav(containers[i]);
                if (childrenBoxes) return true;
            }
            return false;
        };

        return !trav(node);
    }
    shouldComponentUpdate( nextProps ){
        return true;
        // The comparison is fast, and we won't render the component if
        // it does not need it. This is a huge gain in performance.
        //var current = this.props.current.node;
        //var nextCurrent = nextProps.current.node;
        //return this.props.filterText != nextProps.filterText ||  this.props.nodes != nextProps.nodes || (current!==undefined && nextCurrent !==undefined && current.name != nextCurrent.name);
    }
    render() {
        var containers = this.props.node.containers || [];

        return (
            <div>
        {containers.map(function (node, i) {
            if (this.hideNode(node,this.props.filterText)) return;

            var onDragStart = function(e) {
                console.log('drag started');
                e.stopPropagation();
                var draggingItem = {
                    node: node,
                    parentNode : this.props.node};
                this.props.executeAction("onDragStart",draggingItem);

            }.bind(this);
            var onDragEnter = function(e){
                e.preventDefault(); // Necessary. Allows us to drop.
                e.stopPropagation();
                //window.event.returnValue=false;
                //if (this.props.dragging.type !== this.props.item.type || this.props.dragging.id !== this.props.item.id)  {
                var dropCandidate = {node: node, parentNode:this.props.node};
                //    var self = this;
                this.props.executeAction("dropPossible", dropCandidate);
                //}
            }.bind(this);
            var onDragOver = function(e){
                e.preventDefault(); // Necessary. Allows us to drop.
                e.stopPropagation();
                //window.event.returnValue=false;
            }.bind(this);
            var onDrop = function(e) {
                e.preventDefault();
                e.stopPropagation();
                var dropPlace= {node: node, parentNode: this.props.node};
                this.props.executeAction("onDrop",dropPlace);
            }.bind(this);


            var type = node.elementName;

            var containers = node.containers || [];
            var boxes = node.boxes || [];

            var selected = this.props.current.node === node;
            var parentSelected = this.props.current.parentNode === node;
			var path = `${this.props.path}.containers[${i}]`;

			var classes = cx({
                'node': true,
                'selected': selected,
                'parentSelected':this.props.parentSelected
            });

            var label = <span draggable="true" onDragEnter={onDragEnter}
                onDragStart = {onDragStart}
                onDragOver = {onDragOver} onDrop={onDrop} className={classes} onClick={this.handleClick.bind(this,node,path)}>{node.name}</span>;
            return (

                <TreeView key={type + '|' + i} nodeLabel={label} defaultCollapsed={false}>
                    <TreeNode key={node.name + '|' + i} node={node} path={path} current={this.props.current} currentChanged={this.props.currentChanged.bind(this)} filterText={this.props.filterText} executeAction={this.props.executeAction.bind(this)} />
                      {boxes.map(function (box, j) {

                          var onDragStart1 = function(e) {
                              console.log('drag started');
                              e.stopPropagation();
                              var draggingItem = {
                                  node: box,
                                  parentNode : node};
                              this.props.executeAction("onDragStart",draggingItem);

                          }.bind(this);

                          if (box.name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) {
                              return;
                          }

						  var boxPath = `${path}.boxes[${j}]`;
                          var classes = cx({
                              'node': true,
                              'selected': this.props.current.node === box
                          });
                          return (<div draggable="true"  className={classes} onDragStart = {onDragStart1} onClick={this.handleClick.bind(this,box,boxPath)} key={box.name + j}><span>{box.name}</span></div>)

                      },this)}

                </TreeView>
            );
        }, this)}
            </div>
        );
    }
}
