import { FaDoorOpen } from 'react-icons/fa'
import Card from '../Card/Card'

const Header = () => {
  return (
    <main>
      <div className="flex flex-rol justify-between items-center p-5 bg-blue-50 h-[100px]">
        <div>
          <h1 className="text-black text-2xl ml-5 ">Sambook</h1>
        </div>
        <h1 className="text-black text-2xl">Grande Rio</h1>
        <div className="flex flex-col ">
          <h2 className="text-black text-md ml-5 ">Gabriel Haddad</h2>
          <p className="text-black float-right">
            <FaDoorOpen className="float-right" />
          </p>
        </div>
      </div>
      <div className="h-[700px] flex flex-row">
        <Card className="gap-5"/>
        <Card />
        
      </div>
    </main>
  )
}

export default Header
