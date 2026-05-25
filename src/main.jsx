// ============================================================================
// ARQUIVO: main.jsx
// ============================================================================
// Este é o ponto de entrada da aplicação React.
// Ele é responsável por montar o componente principal <App /> no elemento DOM com id 'root'.
// ============================================================================

// Importa a biblioteca React (necessária para usar JSX e hooks)
import React from 'react'

// Importa o módulo ReactDOM, que fornece métodos específicos para integração com o DOM do navegador.
// A versão 'client' (React 18+) introduz a API createRoot para renderização concorrente.
import ReactDOM from 'react-dom/client'

// Importa o componente principal da aplicação, que contém toda a estrutura do site (Navbar, Hero, etc.)
import App from './App'

// Cria uma raiz React (root) no elemento HTML com id 'root'.
// O 'document.getElementById('root')' localiza o elemento onde a aplicação será injetada.
// Normalmente esse elemento está no arquivo index.html fornecido pelo bundler (vite, create-react-app, etc.)
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode> é um utilitário que ativa verificações extras e avisos para práticas recomendadas.
  // Ele não afeta a interface visual, mas ajuda a detectar problemas de ciclo de vida e efeitos colaterais.
  <React.StrictMode>
    {/* Renderiza o componente principal App dentro da raiz. */}
    <App />
  </React.StrictMode>
)