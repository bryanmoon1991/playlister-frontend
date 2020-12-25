import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import persistReducer from './Redux/rootReducer'
import thunk from 'redux-thunk';
import './index.css';
import App from './App';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';


const store = createStore(persistReducer, applyMiddleware(thunk))
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

