import React from 'react';
import ReactDOM from 'react-dom';

import Freezer from 'freezer-js';
import Designer from './components/Designer';


// Create a Freezer store
var freezer  = new Freezer({
	schema: {
		elementName: 'ObjectSchema',
		name: 'New Document',
		containers: []
	}
});

// export default class App extends React.Component {
//
//   componentDidMount() {
//     var me = this;
//
//     // 2. Your app get re-rendered on any state change
//     freezer.on('update', function () {
//       me.forceUpdate()
//     });
//   }
//
//   render() {
//     // 1. Your app receives the state
//     var state = freezer.get();
//
//     return <Designer state={ state } />;
//   }
// }

class AppWithHistory extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			storeHistory: [freezer.get()],
			currentStore: 0
		};
	}
	undo() {
		var nextIndex = this.state.currentStore - 1;
		if (nextIndex < 0 ) return;
		freezer.set(this.state.storeHistory[nextIndex]);
		this.setState({currentStore: nextIndex});
	}

	redo() {
		var nextIndex = this.state.currentStore + 1;
		if (nextIndex > this.state.storeHistory.length -1) return;
		freezer.set(this.state.storeHistory[nextIndex]);
		this.setState({currentStore: nextIndex});
	}

	componentDidMount() {
		var me = this;

		// 2. Your app get re-rendered on any state change
		freezer.on('update', function ( state ) {

			var storeHistory, nextIndex;
			// Check if this state has not been set by the history
			if (state != me.state.storeHistory[me.state.currentStore]) {

				nextIndex = me.state.currentStore + 1;
				storeHistory = me.state.storeHistory.slice(0, nextIndex);
				storeHistory.push(state);

				// Set the state will re-render our component
				me.setState({
					storeHistory: storeHistory,
					currentStore: nextIndex
				});
			}
			else {
				// The change has been already triggered by the state, no need of re-render
			}

			//me.forceUpdate()
		});
	}

	render() {
		// 1. Your app receives the state
		var state = freezer.get();


		var editorState = {
			undo:this.undo.bind(this),
			redo:this.redo.bind(this),
			canUndo:!this.state.currentStore,
			canRedo:this.state.currentStore == this.state.storeHistory.length - 1
		};

		return <Designer state={ state } editorState={editorState} />;
	}
}

ReactDOM.render(<AppWithHistory />, document.getElementById('app'));
