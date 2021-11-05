import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Cesium from "cesium";
import {  BrowserRouter  } from 'react-router-dom';
import 'bootstrap-daterangepicker/daterangepicker.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZmE0MTY3ZS0xYmNhLTQ5ODYtYWYzMC1hYjk1YzNjYWQyNTkiLCJpZCI6MTYyNjksInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NzAwMzk1MDZ9.1h2RrjbaSGg75mV1JhTi8dNLOR04938Wk-3XbqXOfQc";


axios.defaults.baseURL = 'https://ucalgary-sandbox-01.sensorup.com/v1.0';
// axios.defaults.headers.common['Authorization'] = 'Auth TOKEN';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

const app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
