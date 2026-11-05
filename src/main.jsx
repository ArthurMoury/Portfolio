import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './global.css';
import { useLanguage } from './i18n';

function LocalizedApp(){const language=useLanguage();return <App key={language}/>;}

createRoot(document.getElementById('root')).render(<React.StrictMode><LocalizedApp /></React.StrictMode>);
