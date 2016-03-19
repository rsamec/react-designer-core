import React from 'react';
import _  from 'lodash';

import Workplace from './components/Workplace.js';
import ObjectBrowser from './components/ObjectBrowser.js';
import ObjectPropertyGrid from './components/ObjectPropertyGrid.js';
import backgroundStyle from './util/backgroundStyle';
import toEmptyProps from './util/toEmptyProps';

export default {
    Workplace:Workplace,
    ObjectBrowser:ObjectBrowser,
    ObjectPropertyGrid:ObjectPropertyGrid,
	backgroundStyle:backgroundStyle,
	toEmptyProps:toEmptyProps
};
