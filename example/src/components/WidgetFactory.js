import _ from 'lodash';
import WidgetFactory from 'react-photo-widget-factory';
import {Rectangle,Circle,Ellipse,Line,PolyLine,Triangle} from 'react-shapes';
import RichTextRenderer from '../widgets/RichTextRenderer';
import TextRenderer from '../widgets/TextRenderer';
import JsxRenderer from '../widgets/JsxRenderer';
import {Bar, Pie, Tree, SmoothLine, StockLine, Scatterplot, Radar} from 'react-pathjs-chart';
import * as md from 'react-icons/lib/md';
import {Input,Panel,Button,Alert,Glyphicon} from 'react-bootstrap';
import Gmaps from '../widgets/Gmaps';
import HBar from '../widgets/HBar';
import InputRange from '../widgets/InputRange';

var Widgets = {
	"Core.TextContent":WidgetFactory.TextContent,
	"Core.RichTextContent":WidgetFactory.RichTextContent,
	"Core.HtmlContent": WidgetFactory.HtmlContent,
	"Core.JsxContent": WidgetFactory.JsxContent,
	"Core.ArticleContent": WidgetFactory.ArticleContent,
	"Core.ListItemContent": WidgetFactory.ListItemContent,

	"Core.ImageBox": WidgetFactory.ImageBox,
	"Core.SmartImageBox": WidgetFactory.SmartImageBox,
	"Core.ATvImageBox":WidgetFactory.ATvImageBox,

	"Core.BackgroundBox": WidgetFactory.BackgroundBox,
	"Core.HtmlBox": WidgetFactory.HtmlBox,
	"Core.HtmlImageBox": WidgetFactory.HtmlImageBox,

	"Core.ImageFlexBox":WidgetFactory.ImageFlexBox,

	"Core.TextBoxInput":WidgetFactory.TextBoxInput,
	"Core.Icon":WidgetFactory.Icon,
	"Core.IconMorph":WidgetFactory.IconMorph,

	"Shapes.Rectangle":Rectangle,
	"Shapes.Circle":Circle,
	"Shapes.Ellipse":Ellipse,
	"Shapes.Line":Line,
	"Shapes.PolyLine":PolyLine,
	"Shapes.Triangle":Triangle,
	
	"Chart.Bar":Bar,
	"Chart.Pie":Pie,
	"Chart.Tree":Tree,
	"Chart.SmoothLine":SmoothLine,
	"Chart.StockLine":StockLine,
	"Chart.Scatterplot":Scatterplot,
	"Chart.Radar":Radar,

	"react-bootstrap.Input":Input,
	"react-bootstrap.Panel":Panel,
	"react-bootstrap.Button":Button,
	"react-bootstrap.Alert":Alert,
	"react-bootstrap.Glyphicon":Glyphicon,
	
	"react-input-range.InputRange":InputRange,
	
	"react-gmaps.Gmaps":Gmaps,
	"Chart.HBar":HBar

};

_.extend(WidgetFactory.HtmlContent,{metaData:{
	settings: {
		fields: {
			content: {type: 'htmlEditor'},
			font:{type:'fontEditor'}
		}
	}
}});

_.extend(WidgetFactory.ArticleContent,{  metaData: {
	settings: {
		fields: {
			content: {type: 'htmlEditor'},
			font:{type:'fontEditor'},
			columnCount:{type:'number'}
		}
	}
}});

_.extend(WidgetFactory.ListItemContent,{  metaData: {
	settings: {
		fields: {
			content: {type: 'htmlEditor'},
			font:{type:'fontEditor'},
			counterReset:{type:'number'}
		}
	}
}});

_.extend(WidgetFactory.ImageBox,{metaData: {
	settings: {
		fields: {
			url:{type:'string'},
			border:{type:'borderEditor'},
			objectFit: {
				type: 'select',
				settings: {options: ['cover', 'fill', 'contain']}
			},
			clipPath:{type:'string'}
		}
	}
} });
_.extend(WidgetFactory.ATvImageBox,{metaData: {
	settings: {
		fields: {
			front:{type:'string'},
			back:{type:'string'},
			border:{type:'borderEditor'},
			objectFit: {
				type: 'select',
				settings: {options: ['cover', 'fill', 'contain']}
			},
			clipPath:{type:'string'}
		}
	}
} });

_.extend(WidgetFactory.BackgroundBox,{  metaData: {
	settings: {
		fields: {
			background:{type:'bgEditor'},
			border: {type: 'borderEditor'},
			clipPath:{type:'string'}
		}
	}
}});

_.extend(WidgetFactory.HtmlBox,{  metaData: {
	settings: {
		fields: {
			content:{type:'htmlEditor'},
			font: {type: 'fontEditor'},
			padding: {type: 'boxSizeEditor'},
			border: {type: 'borderEditor'},
			background: {type: 'bgEditor'},
			clipPath:{type:'string'}
		}
	}
}});

_.extend(WidgetFactory.HtmlImageBox,{metaData:{
	settings: {
		fields: {
			content:{type:'htmlEditor'},
			font: {type: 'fontEditor'},
			padding: {type: 'boxSizeEditor'},
			border: {type: 'borderEditor'},
			background: {type: 'bgEditor'},
			clipPath:{type:'string'},
			imageAlign: {
				type: 'select',
				settings: {options: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
			},
			image: {
				fields: {
					url:{type:'string'},
					margin: {type: 'boxSizeEditor'},
					border: {type: 'borderEditor'},
					width: {type: 'number'},
					height: {type: 'number'}
				}
			}
		}
	}
}});
_.extend(WidgetFactory.SmartImageBox,{metaData: {
	settings: {
		fields: {
			url:{type:'string'},
			border:{type:'borderEditor'},
			objectFit: {
				type: 'select',
				settings: {options: ['cover', 'fill', 'contain']}
			},
			clipPath:{type:'string'},
			caption:{type:'string'},
			description:{type:'htmlEditor'}
		}
	}
} });

_.extend(WidgetFactory.TextBoxInput,{metaData: {
	settings: {
		fields: {
			value: {type: 'string'},
			placeholder: {type: 'string'},
			label: {type: 'string'}
		}
	}
}} );

_.extend(WidgetFactory.ImageFlexBox,{metaData: {
	settings: {
		fields: {
			flexDirection: {
				type: 'select',
				settings: {options: ['row', 'column', 'row-reverse','column-reverse']}
			},
			alignContent: {
				type: 'select',
				settings: {options: ['stretch', 'flex-start', 'flex-end','center','space-between','space-around']}
			},
			images:{type:'plainJsonEditor'},
			image: {
				fields: {
					width:{type:'number'},
					height:{type:'number'},
					border: {type: 'borderEditor'},
					objectFit: {
						type: 'select',
						settings: {options: ['cover', 'fill', 'contain']}
					},
					clipPath: {type: 'string'}
				}
			}
		}
	}
} });

var iconKeys = _.rest(_.keys(md),1);

var sharedFields = {
	fill: {type: 'colorPicker'},
	stroke: {type: 'colorPicker'},
	strokeWidth: {type: 'number'}
}

_.extend(WidgetFactory.Icon,{  metaData: {
	settings: {
		fields: _.extend({
			width:{type:'number'},
			height:{type:'number'},
			icon: {
				type: 'select',
				settings: {options: iconKeys}
			}
		},sharedFields)
	}
}});

_.extend(WidgetFactory.IconMorphTransition,{  metaData: {
	settings: {
		fields: _.extend({
			width:{type:'number'},
			height:{type:'number'},
		
			from: {
				type: 'select',
				settings: {options: iconKeys}
			},
			to: {
				type: 'select',
				settings: {options: iconKeys}
			},	duration:{type:'number'}
		},sharedFields)
	}
}});

_.extend(WidgetFactory.RichTextContent,{  metaData: {
	settings: {
		fields: {
			content: {type: 'jsonEditor'},
			font:{type:'fontEditor'}
		}
	}
}});

_.extend(WidgetFactory.TextContent,{  metaData: {
	settings: {
		fields: {
			content: {type: 'string'},
			font:{type:'fontEditor'}
		}
	}
}});

_.extend(WidgetFactory.JsxContent,{  metaData: {
	settings: {
		fields: {
			data:{type:'plainJsonEditor'},
			content: {type: 'codeEditor'},
			font:{type:'fontEditor'}
		}
	}
}});


var bootstrapSettings = {
	fields:{
		//content:{type:'string'},
		bsSize:{type:'select',settings: {
			options: _.map(['large','medium','small','xsmall'], function (key, value) {
				return {value: key, label: key};
			})
		}},
		bsStyle:{type:'select',settings: {
			options: _.map(['default','primary','success','info','warning','danger','link'], function (key, value) {
				return {value: key, label: key};
			})
		}}
	}
};

var extendBootstrapFields = function(fields){return _.merge(_.cloneDeep(bootstrapSettings),{fields:fields})};

_.extend(Widgets['react-bootstrap.Button'], {
	metaData: {
		props: {
			bsSize: 'medium', bsStyle: 'default', content: 'Type content'
		},
		settings:extendBootstrapFields({content: {type:'htmlEditor'}})
	}
});
_.extend(Widgets['react-bootstrap.Label'], {
	metaData: {
		props: {
			bsSize: 'medium', bsStyle: 'default', content: 'Type content'
		},
		settings:extendBootstrapFields({content: {type:'htmlEditor'}})
	}
});

_.extend(Widgets['react-bootstrap.Panel'], {
	metaData: {
		props: {
			header:"Header",bsStyle: 'default', content: 'Type content'
		},
		settings:extendBootstrapFields({header:{type:'htmlEditor'}, content: {type:'htmlEditor'}})
	}
});

_.extend(Widgets['react-bootstrap.Glyphicon'], {
	metaData: {
		props: {
			bsSize: 'medium', bsStyle: 'default', glyph: 'star'
		},
		settings:extendBootstrapFields({content: {type:'htmlEditor'}})
	}
});

_.extend(Widgets['react-bootstrap.Alert'], {
	metaData: {
		props: {
			bsSize: 'medium', bsStyle: 'default', content: 'Type content'
		},
		settings:extendBootstrapFields({content: {type:'htmlEditor'}})
	}
});

_.extend(Widgets['react-bootstrap.Well'], {
	metaData: {
		props: {
			bsSize: 'medium', bsStyle: 'default', content: 'Type content'
		},
		settings:extendBootstrapFields({content: {type:'htmlEditor'}})
	}
});

_.extend(Widgets['react-bootstrap.Input'], {
	metaData: {
		props: {
			type: 'text',placeholder:'type your text', label:'label', help:'',value:''
		},
		settings:extendBootstrapFields({type: {type:'string'},placeholder: {type:'string'},label: {type:'string'},help: {type:'string'}})
	}
});
//var bootstrapSettings = {
//	metaData: {
//		settings: {
//			fields: {
//				//content:{type:'string'},
//				bsSize: {
//					type: 'select', settings: {
//						options: _.map(['large', 'medium', 'small', 'xsmall'], function (key, value) {
//							return {value: key, label: key};
//						})
//					}
//				}
//				,
//				bsStyle: {
//					type: 'select', settings: {
//						options: _.map(['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'], function (key, value) {
//							return {value: key, label: key};
//						})
//					}
//				}
//			}
//		}
//	}
//};
//var extendBootstrapFields = function(fields){return _.merge(_.cloneDeep(bootstrapSettings),{metaData:{settings:{fields:fields}}})};
//_.extend(Widgets['react-bootstrap.Button'],extendBootstrapFields(bootstrapSettings,{ content: {type:'htmlEditor'}}));
//_.extend(Widgets['react-bootstrap.Label'],extendBootstrapFields(bootstrapSettings,{ content: {type:'htmlEditor'}}));
//_.extend(Widgets['react-bootstrap.Panel'],extendBootstrapFields({header:{type:'htmlEditor'}, content: {type:'htmlEditor'}}));
//_.extend(Widgets['react-bootstrap.Glyphicon'],extendBootstrapFields(bootstrapSettings,{ glyph: {type:'string'}}));
//_.extend(Widgets['react-bootstrap.Alert'],extendBootstrapFields(bootstrapSettings,{ content: {type:'htmlEditor'}}));
//_.extend(Widgets['react-bootstrap.Input'],extendBootstrapFields(bootstrapSettings,{ type: {type:'string'},placeholder: {type:'string'},label: {type:'string'},help: {type:'string'}}));
//

_.merge(Bar, {
		metaData: {
			settings: {
				fields: {
					data: {
						type: 'gridEditor',
						settings: {
							config: {
								// True if the first column in each row is a header (th)
								hasHeadColumn: true,
								// True if the data for the first column is just a string.
								// Set to false if you want to pass custom DOM elements.
								isHeadColumnString: true,
								// True if the first row is a header (th)
								hasHeadRow: true,
								// True if the data for the cells in the first row contains strings.
								// Set to false if you want to pass custom DOM elements.
								isHeadRowString: true,
								// True if the user can add rows (by navigating down from the last row)
								canAddRow: true,
								// True if the user can add columns (by navigating right from the last column)
								canAddColumn: true,
								// Override the display value for an empty cell
								emptyValueSymbol: '-',
								// Fills the first column with index numbers (1...n) and the first row with index letters (A...ZZZ)
								hasLetterNumberHeads: false
							},
							initialData: {
								rows: [
									['Key', 'AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG'],
									['COM', '0,0', '0,1', '0,2', '0,3', '0,4', '0,5', '0,6'],
									['DIV', '1,0', '1,1', '1,2', '1,3', '1,4', '1,5', '1,6'],
									['DEV', '2,0', '2,1', '2,2', '2,3', '2,4', '2,5', '2,6'],
									['ACC', '3,0', '3,1', '3,2', '3,3', '3,4', '3,5', '3,6']
								]
							},
							converter: {
								parse: function (value) {
									return _.map(_.rest(value.rows, 1), function (row, r) {
										var name = row[0];
										return _.map(_.rest(row, 1), function (cell, c) {
											var c = _.isString(cell) ? cell.replace(",", ".") : cell;
											var n = parseFloat(c);
											return {name: name, v: isNaN(n) ? c : n};
										})
									})
								},
								format: function (value) {
									var headRow = ['Key', 'AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG'];
									var columns = ["COM", "DIV", "DEV", "ACC"];

									return {
										rows: [headRow].concat(_.map(value, function (row, r) {
											var name = columns[r];
											return [name].concat(_.map(row, function (cell, c) {
												return cell.v;
											}))
										}))
									}
								}
							}
						}
					}
				}
			}
		}
	}
)
_.extend(Gmaps,{  metaData: {
	settings: {
		fields: {
			width:{type:'number'},
			height:{type:'number'},
			lat:{type:'number'},
			lng:{type:'number'},
			zoom:{type:'number'},
			content:{type:'string'},
		}
	}
}});

_.extend(HBar,{  metaData: {
	settings: {
		fields: {
			width:{type:'number'},
			height:{type:'number'},
			item:{fields:{
				width:{type:'number'},
				height:{type:'number'},
				count:{type:'number'}				
			}},
			icon: {
				type: 'select',
				settings: {options: iconKeys}
			},
			color:{type:'colorPicker'},
			selectColor: {type: 'colorPicker'},
			value:{type:'number'},
		}
	}
}});

_.extend(InputRange,{  metaData: {
	settings: {
		fields: {
			maxValue:{type:'number'},
			minValue:{type:'number'},
			value:{type:'number'},
			font:{type:'fontEditor'},
		}
	}
}});
export default Widgets;
