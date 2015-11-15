import _ from 'lodash';


export default {
    ObjectSchema: {
        metaData: {
            props: {
                title: undefined,
                defaultData:undefined,
                dataSources:undefined,
                defaultPageSize:undefined,
                tour:undefined,
                context:{
                    styles:undefined,
                    code:undefined,
                }
            },
            settings: {
                fields: {
                    defaultData: {type: 'plainJsonEditor'},
                    defaultPageSize: {type: 'select', settings: {options: ['A4','A3','A2','A5','A6','Tabloid','Letter']}},
                    dataSources: {type: 'plainJsonEditor'},
                    tour:{type:'plainJsonEditor'},
                    context: {
                        fields:{
                            intlData: {type: 'plainJsonEditor'},
                            styles:{type:'widgetStyleEditor'},
                            code:{type:'codeEditor'}
                        }
                    }
                }
            }
        }
    },
    Container:{
        metaData: {
            props: {
                visibility:undefined,
                startOnNewPage: false,
                unbreakable: false
            },
            settings: {
                fields: {
                    visibility: {type: 'bindingEditor'},
                    startOnNewPage: {type: 'boolean'},
                    unbreakable: {type: 'boolean'}

                }
            }
        }
    },
    Repeater:{
        metaData: {
            props: {
                binding: undefined,
                startOnNewPage: false,
                unbreakable: false
            },
            settings: {
                fields: {
                    binding: {type: 'bindingEditor'},
                    startOnNewPage: {type: 'boolean'},
                    unbreakable: {type: 'boolean'}
                }
            }
        }
    },
    BoxStyle: {
        metaData: {
            props: {
                top: undefined,
                left: undefined,
                width: undefined,
                height: undefined,
                zIndex: undefined,
                transform: {
                    tx: undefined, ty: undefined,     //translate in px
                    sx: undefined, sy: undefined,     //scale
                    rz: undefined,            //rotation in radian
                    ox: undefined, oy: undefined //transform origin
                }
            }
        }
    },
    ContainerStyle: {
        metaData: {
            props: {
                top: undefined,
                left: undefined,
                width: undefined,
                height: undefined,
                position: undefined
            }
        }
    }
}