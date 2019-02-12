import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './Components/App/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
