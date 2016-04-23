react-designer-core
=======================

React designer is WYSIWYG editor for **easy content creation** (legal contracts, business forms, marketing leaflets, technical guides, visual reports, rich dashboards, tutorials and other content, etc.).

[Live demo](http://rsamec.github.io/react-designer-core/)

## Main goals 

+   it is for developers - to use it in your own solutions with your own widgets (components)  
+   it is based on simple principals
 	+	minimal JSON definition - [PTT](https://github.com/rsamec/ptt) - maps directly to React components
 	+	good performance even for big documents - due to usage of immutable structure
 	+	fully extensible by various css and widgets frameworks (react-bootstrap, material-design, your company made widgets, etc.) 	
+ 	offers standard design components (Workplace, Container, Box, PropertyEditor, ObjectBrowser) and features
	+	layouting - moving positions, resizing, moving up/down in component hieararchy, copying, deleting, etc.
 	+	component editing - property editors, inline editing - using [draftjs](https://facebook.github.io/draft-js/), streching, rotating, transforming [transhand](https://github.com/azazdeaz/transhand),etc.
 	+	workplace - selecting, undo/redo, previewing, import/export, etc.
 	  	 	
 	       
**Warning**: Nevertheless, i must repeatedly stress that it is still a prototype and work in progress.

## Features

+   directly manipulate the layout of a document without having to type or remember names of components, elements, properties or other layout commands.
+   precise visual layout that corresponds to an existing paper version
    +   support for various output formats - html, pdf, ...
+   high-quality on-screen output and on-printer output (only partially implemented)
+   comfortable user experience - basic WYSIWYG features
    +   support drag nad drop - resize object length, move object positions
    +   support manipulating objects -> copy, move, up, down objects in object schema hierarchy
    +   highlighting currently selected object and its parent
	+   minimum input, maximum output
	+	remove the barriers of entry
+   build-in html content publishing (preview of html dynamic document)
+   binding support using [react-binding](https://github.com/rsamec/react-binding) - experimental
+   props inheritance - when rendering occurs -> the props value is resolved by using a value resolution strategy (Binding Value -> Local Value -> Style Value -> Default Value)
+   usable for big documents - careful designed to use react performance
    +   we won't render the component if it doesn't need it
    +   simple comparison is fast because of using immutable data structure
+   undo/redo functionality

It comes with core components typical for WYSIWYG designers

+   Workplace - main working area for drawing documents
+   PropertyGrid - component properties editors (html editors, color pickers, json editors, etc.)
+   ObjectTree - logical component tree - enables to search and move components between nodes


Document definition is done in JSON - uses [PTT](https://github.com/rsamec/ptt) that follows the separation between      

+   logical component tree - JSON simple document description - [Page Transform Tree (PTT)](https://github.com/rsamec/ptt) - it is framework agnostic definition
+   visual component tree - [React virtual DOM](http://facebook.github.io/react) - rendering to DOM so that it maps each component (terminal node) from logical tree to react component and its properties


### Logical component tree - [PTT](https://github.com/rsamec/ptt)

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

### Visual componenet tree - using react

To render react components specifies in react is really simple

```js
    createComponent: function (box) {
        var widget =widgets[box.elementName];
        if (widget === undefined) return React.DOM.span(null,'Component ' + box.elementName + ' is not register among widgets.');

        return React.createElement(widget,box, box.content!== undefined?React.DOM.span(null, box.content):undefined);
    },
    render:function(){
       {this.props.boxes.map(function (box, i) {
                var component = this.createComponent(box);
                return (
                       <div style={box.style}>
                            {component}
                       </div>
                       );
       }, this)}
    }
```

## Demo & Examples

[Live demo](http://rsamec.github.io/react-designer-core/)

To build the examples locally, run:

```
npm install
gulp dev
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use this component is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-shapes.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-designer-core --save
```

## Usage

import {Workplace,ObjectBrowser,ObjectPropertyGrid} from 'react-designer-core';



See the example folder.

## Roadmap

+   support for more positioning schemas (especially to support for responsive design)
	+	[Responsive grid system] (http://getbootstrap.com/css/#grid)
	+	[CSS Flex box](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)
	+	[Grid Style Sheets](http://gridstylesheets.org/)
+   support for typography (vertical rhythm, modular scale, web fonts, etc.)
+   support for more fonts (google fonts)
+   support for print (PDF) - 300 DPI pixel perfect print
	+	support html fragments -> to pdf (using html parser)
	+	custom PDF rendering - (no dependency on PhantomJS or Electron)
+   improve designer experience
    +   move objects in object browser
    +   disabled add widget when box is selected
    +   improve property editor
+   performance issues
    +   recheck - should component update
    +   parse property values (parseInt,etc.) - to many places - remove defensive programming favor contract by design
+   data binding refactoring    
    +   support for binding to remote stores (consider falcor)
    +   data watchers - if some data changes, it changes on the other site

### License

MIT. Copyright (c) 2015 Roman Samec

