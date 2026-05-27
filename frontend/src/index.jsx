import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { store } from './redux/store';
import './styles/global.css';
import { SearchProvider } from './context/SearchContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <SearchProvider>
         <App />
      </SearchProvider>
    </AuthProvider>
  </Provider>
);
