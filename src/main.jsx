import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import {Provider} from 'react-redux'
import store from './app/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <App />
    </Provider>

);