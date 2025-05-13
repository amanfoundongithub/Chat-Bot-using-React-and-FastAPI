import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Router, Route, Routes} from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import AuthPage from './login/AuthPage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path = '/home' element = {< ChatPage />} />
      <Route path = '/login' element = {<AuthPage />} />
      <Route path = '/'     element = {<App />} />
    </Routes>
    
   </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
