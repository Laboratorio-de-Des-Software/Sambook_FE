import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Header from './shared/helpers/Header/Header'
import Menu from './shared/helpers/Menu/Menu'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Header />
    <Menu />
  
  </React.StrictMode>
)
