'use strict';

import 'styles/main.scss';

import React from 'react';
import { render } from 'react-dom';

import TvApp from 'components/TvApp/TvApp';

var mainApp = (function() {

    render(<TvApp time={new Date()} channelData={channelData}/>, document.getElementById('js-main'));

})();
