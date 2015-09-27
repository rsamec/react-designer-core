import _ from 'lodash';

export default {
    ObjectSchema: {
        metaData: {
            props: {
                title: undefined,
                defaultData:undefined,
                context:{
                    styles:undefined
                }
            },
            settings: {
                fields: {
                    defaultData: {type: 'plainJsonEditor'},
                    context: {
                        fields:{
                            intlData: {type: 'plainJsonEditor'},
                            //styles:{type:'widgetStyleEditor'}

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
    }
}
