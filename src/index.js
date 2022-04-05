import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";

import { Root } from "./Root";
import reportWebVitals from "./reportWebVitals";
import store from "./store";

import './antd.css';
import './style.scss';

ReactDOM.render(
  <Provider store={store}>
    <Helmet titleTemplate="EvntBoard - %s" defaultTitle="EvntBoard" />
    <Router>
      <Root />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
