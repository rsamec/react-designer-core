import React from 'react';
import _ from 'lodash';
import Radium from 'radium';
var container = {
    "name": "container",
    "elementName": "Container",
    "style": {
        "top": 0,
        "left": 0,
        "height": 236,
        "width": 399,
        "position": "relative"
    },
    "props": {
        "startOnNewPage": false,
        "unbreakable": false
    },
    "boxes": [
        {
            "name": "Rectangle",
            "elementName": "Shapes.Rectangle",
            "style": {},
            "props": {
                "width": 100,
                "height": 50,
                "strokeWidth": 5
            }
        },
        {
            "name": "Circle",
            "elementName": "Shapes.Circle",
            "style": {
                "top": 80,
                "left": 2
            },
            "props": {
                "r": 30,
                "strokeWidth": 5
            }
        },
        {
            "name": "Ellipse",
            "elementName": "Shapes.Ellipse",
            "style": {
                "top": 82,
                "left": 92
            },
            "props": {
                "rx": 80,
                "ry": 30,
                "strokeWidth": 5
            }
        },
        {
            "name": "Line",
            "elementName": "Shapes.Line",
            "style": {
                "top": 180,
                "left": 4
            },
            "props": {
                "x1": 10,
                "y1": 10,
                "x2": 100,
                "y2": 10,
                "strokeWidth": 4
            }
        },
        {
            "name": "Triangle",
            "elementName": "Shapes.Triangle",
            "style": {
                "top": 0,
                "left": 199
            },
            "props": {
                "width": 70,
                "height": 50,
                "strokeWidth": 5
            }
        },
        {
            "name": "Square",
            "elementName": "Shapes.Rectangle",
            "style": {
                "top": 0,
                "left": 124
            },
            "props": {
                "width": 50,
                "height": 50,
                "strokeWidth": 5
            }
        },
        {
            "name": "Ellipse",
            "elementName": "Shapes.Ellipse",
            "style": {
                "top": 0,
                "left": 291
            },
            "props": {
                "rx": 30,
                "ry": 70,
                "strokeWidth": 5
            }
        }
    ],
    "containers": []
};


class ToolboxShapes extends React.Component {
    render(){
        var imgUrl = 'toolbox/shapes.png';

        var divStyle = {
            position: 'absolute',
            backgroundImage: 'url(' + imgUrl + ')',
            backgroundRepeat:'no-repeat',
            width:container.style.width,
            height:container.style.height
        };
        var addFce = this.props.add;
        return (
            <div>
                <h3>Basic shapes</h3>
                <hr/>
                <div style={divStyle}>
                    {
                      _.map(container.boxes,function(item, index){

                        var itemStyle = item.style;
                        itemStyle.borderWidth = 1;
                        itemStyle.minWidth = 100;
                        itemStyle.minHeight = 100;
                        itemStyle.width = item.props.width;
                        itemStyle.height = item.props.height;
                        itemStyle.position = 'absolute';
                        itemStyle[':hover'] = {
                            backgroundColor: 'lightblue',
                            opacity:0.5
                        };
                        //itemStyle['width'] = item.props.width;
                        //itemStyle['height'] = item.props.height;
                        return (<div key={'item' + index} style={itemStyle} onClick={()=>{addFce(item.elementName)}}></div>)
                    },this)}
                </div>
            </div>
        )
    }
}

export default Radium(ToolboxShapes);