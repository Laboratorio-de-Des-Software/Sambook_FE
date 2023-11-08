import Card from '../Card/Card'
import { FaTheaterMasks } from 'react-icons/fa'
import { GiDominoMask } from 'react-icons/gi'

const Menu = () => {
  return (
    <div className="lg:flex lg:flex-row lg:items-center lg:justify-around lg:gap-8 lg:p-5 md:flex md:flex-row md:items-center md:gap-8  sm:flex sm:flex-col sm:items-center sm:gap-y-8">
      <Card title="Enredo" icon={<FaTheaterMasks />} status="Finalizado" />
      <Card title="Fantasia" icon={<GiDominoMask />} status="Em Progresso" />
    </div>
  )
}

export default Menu
