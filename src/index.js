import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css'; remover essa linha pois deletei o css que vinha junto com o projeto
import App from './App';
//import * as serviceWorker from './serviceWorker'; remover essa linha depois de eu ter apagado o arquivo servicework criado no meu projeto react

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); 
// esse ReactDOM é a arvore do html, que aparece quando apertamos f11 na pagina
//serviceWorker.unregister();// remover essa outra linha do servicework que foi deletado
