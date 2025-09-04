import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// This is the standard entry point for a React application.
// It finds the <div id="root"></div> in your index.html file
// and renders your entire <App /> component inside of it.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
