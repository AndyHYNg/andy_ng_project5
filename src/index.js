import React from 'react';
import { render } from 'react-dom';
import './index.css';
import Router from "./components/Router";
import * as serviceWorker from './serviceWorker';

render(<Router />, document.getElementById('root'));

serviceWorker.unregister();
