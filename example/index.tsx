import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ActiveDetector from '../.';

const ad = new ActiveDetector();

ReactDOM.render(<></>, document.getElementById('root'));
