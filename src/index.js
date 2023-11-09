import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MainTemplate from './MainTemplate'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Menu from './components/Menu'
import Enredo from './components/Enredo'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainTemplate />,
    children: [
      {
        path: '/dashboard',
        element: <Menu />
      }
    ]
  },

  {
    path: '/',
    element: <MainTemplate />,
    children: [
      {
        path: '/enredo',
        element: <Enredo />
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
