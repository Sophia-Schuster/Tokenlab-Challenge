import React, {useState, useEffect} from 'react';
import firebase from './firebase';
//import logo from './logo.svg'; remover pois apaguei o logo
//import './App.css'; remover pois tirei todos os css pre determinados
//sempre que eu for usar html em uma pagina preciso importar o React! 
//JSX - javracsript + HTML 
import Landing from './pages/Landing'
import './assets/styles/global.css' //se nao importar meus arquivos de estilizacao nao funciona

function App() {

    const[firebaseInitialized, setFirebaseInitialized] = useState(false)

    useEffect(() => {
      firebase.isInitialized().then(val => {
        setFirebaseInitialized(val)
      })
    })

  return firebaseInitialized !== false ? (
    <Landing/> 
    // substitui o que tinha aqui pelo meu Landing, agora na pagina vai aparecer o que esta na funcao landing no index.tsx
  ) : <div id="loader">Carregando</div>
} //componente dentro do react: funcoes que retornam um html
//aqui posso criar estruturas que se repetem muito nas nossas paginas, como "html global" que se aplica a todas paginas
//nome do componente sempre tem que comecar com letra maiuscula!
export default App;
