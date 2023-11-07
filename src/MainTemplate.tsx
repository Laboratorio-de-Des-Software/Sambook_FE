import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'

const MainTemplate = () => {
  return (
    <main>
      <Header />
      <SideBar />
      <div className="ml-[200px] p-5">
        <h1 className="text-black text-2xl">Sambook Home Page</h1>
        <Outlet />
      </div>
    </main>
  )
}

export default MainTemplate
