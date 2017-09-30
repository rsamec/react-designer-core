import _ from 'lodash';

const COMPONENT_METADATA = {
	ObjectSchema: {
		metaData: {
			settings: {
				fields: {
					defaultData: { type: 'plainJsonEditor' },
					background: { type: 'bgEditor' },
					pageOptions: { type: 'pageOptionsEditor' },
					context: {
						fields: {
							intlData: { type: 'plainJsonEditor' },
							styles: { type: 'widgetStyleEditor' },
							code: { type: 'codeEditor' }
						}
					}
				}
			}
		}
	},
	Container: {
		metaData: {
			settings: {
				fields: {
					visibility: { type: 'boolean' },
					startOnNewPage: { type: 'boolean' },
					unbreakable: { type: 'boolean' }

				}
			}
		}
	},
	BackgroundContainer: {
		metaData: {
			settings: {
				fields: {
					visibility: { type: 'boolean' },
					startOnNewPage: { type: 'boolean' },
					unbreakable: { type: 'boolean' },
					width: { type: 'number' },
					height: { type: 'number' },
					background: { type: 'bgEditor' }
				}
			}
		}
	},
	Repeater: {
		metaData: {
			settings: {
				fields: {
					binding: { type: 'plainJsonEditor' },
					startOnNewPage: { type: 'boolean' },
					unbreakable: { type: 'boolean' }
				}
			}
		}
	},
	Grid: {
		metaData: {
			settings: {
				fields: {
					rowTemplate: { type: 'string' },
					columnTemplate: { type: 'string' },
					areasTemplate: { type: 'string' },
					visibility: { type: 'boolean' },
					justifyItems: {
						type: 'select',
						settings: { options: ['start', 'end', 'center', 'stretch'] }
					},
					alignItems: {
						type: 'select',
						settings: { options: ['start', 'end', 'center', 'stretch'] }
					},
					justifyContent: {
						type: 'select',
						settings: { options: ['start', 'end', 'center', 'stretch', 'space-around', 'space-between', 'space-evenly'] }
					},
					alignContent: {
						type: 'select',
						settings: { options: ['start', 'end', 'center', 'stretch', 'space-around', 'space-between', 'space-evenly'] }
					},
					background: { type: 'bgEditor' },
					padding: { type: 'boxSizeEditor' },
					border: { type: 'borderEditor' }
				}
			}
		}
	},
	Cell: {
		metaData: {
			settings: {
				fields: {
					justifySelf: {
						type: 'select',
						settings: { options: ['start', 'end', 'center', 'stretch'] }
					},
					alignSelf: {
						type: 'select',
						settings: { options: ['start', 'end', 'center', 'stretch'] }
					},
					area: { type:'string'},
					rowStart: {type:'number'},
					rowEnd: {type: 'number'},
					columnStart: {type: 'number'},
					columnEnd: {type: 'number'},
					columns: {type: 'string'},
					rows: {type: 'string'},
					background: { type: 'bgEditor' },
					padding: { type: 'boxSizeEditor' },
					border: { type: 'borderEditor' }
				}
			}
		}
	}
};


const convertToEmptyProps = function (children) {
	var result = _.mapValues(children, function () { return undefined });
	for (var key in children) {
		var fields = children[key]['fields'];
		if (fields === undefined) continue;
		result[key] = convertToEmptyProps(fields);
	}
	return result;
}
const CONTAINER_KEYS = _.keys(COMPONENT_METADATA);
const isContainer = function (elementName) {
	return _.includes(CONTAINER_KEYS, elementName);
}

export default function (elementName) {
	if (!isContainer(elementName)) return;
	let metadata = COMPONENT_METADATA[elementName].metaData;
	let settings = metadata && metadata.settings || {}
	return convertToEmptyProps(settings.fields);
}

