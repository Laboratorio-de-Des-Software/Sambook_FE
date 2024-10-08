import Card from '../Card/Card'
import { elements } from '../../shared/constants'

const Menu = () => {
  return (
    <div className="lg:flex lg:flex-row lg:items-center lg:flex-wrap lg:gap-8 lg:p-5 md:flex md:flex-row md:items-center md:gap-8 sm:flex sm:flex-col sm:items-center sm:gap-y-8">
      {elements.map(({ title, icon, href }) => (
        <Card title={title} icon={icon} link={href} status="Em Progresso" />
      ))}
    </div>
  )
}

export default Menu
