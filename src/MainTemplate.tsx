import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'

const MainTemplate = () => {
  return (
    <main className="relative min-h-screen">
      <Header />
      <SideBar />
      <section className="ml-[200px] h-full p-5 bg-[#FFFFFF]">
        <Outlet />
      </section>
    </main>
  )
}

export default MainTemplate
