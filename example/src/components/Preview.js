import React from 'react';
import Binder from 'react-binding';
import _ from 'lodash';

import HtmlPagesRenderer from 'react-html-pages-renderer';

export default class Preview  extends React.Component 
{
    constructor(props){
		super(props);
		this.state = {data:_.cloneDeep(this.props.schema.props && this.props.schema.props.defaultData) || {}}
    }
    render() {
        var schema = _.cloneDeep(this.props.schema);
        var dataContext = Binder.bindToState(this,'data');
		
        return (
            <div>
                <HtmlPagesRenderer widgets={this.props.widgets} schema={schema} dataContext={dataContext} doublePage={schema.props.doublePage}/>
            </div>
        );

    }
};
