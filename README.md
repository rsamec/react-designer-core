react-designer-core
=======================

React-designer-core is a set of core components for [react-designer](https://github.com/rsamec/react-designer). This is WYSIWYG editor for **easy content creation** (legal contracts, business forms, marketing leaflets, technical guides, visual reports, rich dashboards, tutorials and other content, etc.).

Live demos

+	[simple](http://rsamec.github.io/react-designer-core/)
+	[react-designer](http://rsamec.github.io/react-designer/)

## Main goals 

+   it is for developers - to use it in your own solutions with your own widgets (components)  
+   it is based on simple principals
 	+	minimal JSON definition - [PTT](https://github.com/rsamec/ptt) - maps directly to React components
 	+	good performance even for big documents - due to usage of immutable structure using [freezer-js](https://github.com/arqex/freezer)
 	+	simple extensible by custom components or frameworks (react-bootstrap, material-design, your company made widgets, etc.) 	
+ 	offers standard design components (Workplace, Container, Box, ObjectBrowser) and features
	+	layouting - moving positions, resizing, moving up/down in component hieararchy, copying, deleting, etc.
 	+	component editing - property editors, inline editing - using [draftjs](https://facebook.github.io/draft-js/), streching, rotating, transforming [transhand](https://github.com/azazdeaz/transhand),etc.
 	+	workplace - selecting, undo/redo, previewing, import/export, etc. 	 	
 	       
It comes with core components typical for WYSIWYG designers

+   Workplace - main working area for drawing documents
+   ObjectTree - logical component tree - enables to search and move components between nodes

Document definition is done in JSON - uses [PTT](https://github.com/rsamec/ptt)      

+   document definition - simple JSON - [Page Transform Tree (PTT)](https://github.com/rsamec/ptt) - it is framework agnostic definition
+   document rendering  - visual component tree - [React virtual DOM](http://facebook.github.io/react) - rendering to DOM so that it maps each component (terminal node) from logical tree to react component and its properties


### Document definition - [PTT](https://github.com/rsamec/ptt)

The PPT format is __framework agnostic__ document description. It enables to dynamically render pages in different sizes (A4,A3,Letter,...),in various formats (html,pdf,...) and for various visual media (screen, papers).

It is a simple component tree that consists of these two nodes

+   **containers** - nodes that are containers for other components - visual and logical grouping of parts of document (sections, containers,grids, rows, cells, panels, etc. )
+   **boxes** - terminal nodes (leaf) that are visible components - (components, boxes, widgets) - renders to document (typically by simple mapings to props of component)

There is an minimal 'Hello world' example. The PTT consists of one container and one box with TextBox element.

```json
{
 "name": "Hello World Example",
 "elementName": "PTTv1",
 "containers": [
    {
     "name": "My first container",
     "elementName": "Container",
     "style": { "top": 0, "left": 0, "height": 200, "width": 740, "position": "relative" },
     "boxes": [{
        "name": "My first text",
        "elementName": "TextContent",
        "style": { "top": 0, "left": 0 },
        "props":{
             "content": "Hello world"
            }
        }]
    }]
}
```

See the full [PTT specification](https://github.com/rsamec/ptt).

### Document rendering - visual component tree - PTT rendering in react

To render react components specifies in react is really simple

```js
    render:{
       {this.props.boxes.map(function (box, i) {
                var component = React.createElement(widget,box, box.content!== undefined?React.DOM.span(null, box.content):undefined);
                return (
                       <div style={box.style}>
                            {component}
                       </div>
                       );
       }, this)}
    }
```

## Demo & Examples

+	[Simple](http://rsamec.github.io/react-designer-core/)
+	[Complex](http://rsamec.github.io/react-designer/)

To build the examples locally, run:

```
npm install
gulp dev
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use this component is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-designer-core.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-designer-core --save
```

## Usage

import {Workplace,ObjectBrowser} from 'react-designer-core';

```js

import React from 'react';
import Freezer from 'freezer-js';
import Designer from './Designer';

// Create a Freezer store
var freezer  = new Freezer({
  schema: {
    elementName: 'ObjectSchema',
    name: 'New Document',
    containers: []
  }
})

export default class AppContainer extends React.Component {

   componentDidMount() {
     var me = this;

     // 2. Your app get re-rendered on any state change
     freezer.on('update', function () {
       me.forceUpdate()
     });
   }

   render() {
     // 1. Your app receives the state
     var state = freezer.get();
     return <Designer state={ state } />;
   }
 }
```

```js

import React from 'react';
import {Workplace,ObjectBrowser} from 'react-designer-core';

import Widgets from './Widgets';
import WidgetRenderer from './WidgetRenderer';


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
  
    this.setState({
        current: {
          node: currentNode,
          path: path === undefined ? this.state.current && this.state.current.path : path
        }
      }
    );
  }
  
 render() {
    var schema = this.props.state.schema;
    return
     	<div className="index">
            <Workplace schema={schema} current={this.state.current}
                       currentChanged={this.currentChanged.bind(this)} widgets={Widgets}
                       widgetRenderer={WidgetRenderer} snapGrid={this.state.snapGrid}/>
            <ObjectBrowser rootNode={schema} current={this.state.current}
                       currentChanged={this.currentChanged.bind(this)}/>
      	</div>
 }
}
```

See the example folder to see more features.

### License

MIT. Copyright (c) 2015 Roman Samec

