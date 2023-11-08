import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'

const MainTemplate = () => {
  return (
    <main>
      <Header />
      <SideBar />
      <section className="ml-[200px] p-5">
        <Outlet />
      </section>
    </main>
  )
}

export default MainTemplate
