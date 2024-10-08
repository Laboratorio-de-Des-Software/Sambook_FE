import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MainTemplate from './MainTemplate'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Menu from './components/Menu'
import Enredo from './components/Enredo'
import Fantasia from './components/Fantasia'
import Alegoria from './components/Alegoria'
import SambaEnredo from './components/SambaEnredo'
import Bateria from './components/Bateria'
import InfoComp from './components/InfoComp'
import MSala from './components/MSala'
import Harmonia from './components/Harmonia'
import Evolucao from './components/Evolucao'
import ComFrente from './components/ComFrente'
import Login from './components/Login/Login'
import ResetSenha from './components/ResetSenha'
import NovaFantasia from './components/NovoRegistro/Fantasia/NovaFantasia'
import EditarFantasia from './components/NovoRegistro/Fantasia/EditarFantasia'
import NovaAlegoria from './components/NovoRegistro/Alegoria/NovaAlegoria'
import EditarAlegoria from './components/NovoRegistro/Alegoria/EditarAlegoria'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/resetsenha',
    element: <ResetSenha />
  },
  {
    path: '/conteudo',
    element: <MainTemplate />,
    children: [
      {
        path: '/conteudo/menu',
        element: <Menu />
      },
      {
        path: '/conteudo/enredo',
        element: <Enredo />
      },
      {
        path: '/conteudo/fantasia',
        element: <Fantasia />
      },
      {
        path: '/conteudo/alegoria',
        element: <Alegoria />
      },
      {
        path: '/conteudo/sambaenredo',
        element: <SambaEnredo />
      },
      {
        path: '/conteudo/bateria',
        element: <Bateria />
      },
      {
        path: '/conteudo/harmonia',
        element: <Harmonia />
      },
      {
        path: '/conteudo/evolucao',
        element: <Evolucao />
      },
      {
        path: '/conteudo/comissaodefrente',
        element: <ComFrente />
      },
      {
        path: '/conteudo/infocomplementar',
        element: <InfoComp />
      },
      {
        path: '/conteudo/mestresala&portabandeira',
        element: <MSala />
      },
      {
        path: '/conteudo/novafantasia',
        element: <NovaFantasia />
      },
      {
        path: '/conteudo/editarfantasia/:id',
        element: <EditarFantasia />
      },
      {
        path: '/conteudo/novaalegoria',
        element: <NovaAlegoria />
      },
      {
        path: '/conteudo/editaralegoria/:id',
        element: <EditarAlegoria />
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<RouterProvider router={router} />)
