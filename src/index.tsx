import React from 'react';
import ReactDOM from 'react-dom';
import ArtilleryVisualizer from './ArtilleryVisualizer';
import reportWebVitals from './reportWebVitals';
import './tailwind.css';
import './main.css';

ReactDOM.render(
  <React.StrictMode>
    <ArtilleryVisualizer />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
