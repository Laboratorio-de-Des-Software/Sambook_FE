import React, { useState } from 'react'
import SideBarItem from './SideBarItem/SideBarItem'
import { cn } from '../../shared/helpers'
import { IElements, elements } from '../../shared/constants'

export interface IItems extends IElements {
  hasList?: boolean
  onClick?: () => void
}

const items: IItems[] = [
  { title: 'Home', href: '/conteudo/menu', icon: 'icon-casa.svg' },
  { title: 'Elementos', href: '', icon: 'icon-alegoria.svg', hasList: true },
  { title: 'Organograma', href: '', icon: 'icon-organograma.svg' },
  { title: 'Gerar PDF', href: '', icon: 'icon-pdf.svg' }
]

const ElementsList = () => {
  return (
    <>
      {elements.map((element) => (
        <SideBarItem item={element} key={element.title} />
      ))}
    </>
  )
}

const SideBar = () => {
  const [openElementsList, setOpenElementsList] = useState(false)

  return (
    <>
      <div
        onMouseLeave={() => setOpenElementsList(false)}
        className="hide-menu-toggle transition-all ease-in-out duration-500 w-[200px] ml-[-200px] absolute z-10 h-full bg-[#787c88] hover:ml-0">
        <div className="bg-[#474A51] h-[80px] flex items-center">
          <h1 className="text-white ml-4 text-xl">MENU</h1>
        </div>

        {items.map((item, index) => (
          <React.Fragment key={`${item.title}-${index}`}>
            <SideBarItem
              item={item}
              onClick={() =>
                item.hasList && setOpenElementsList(!openElementsList)
              }
            />
            {item.hasList && (
              <div
                className={cn(
                  'sidebar-animation absolute right-[-386px] top-[129px] opacity-0 invisible',
                  openElementsList && 'right-[-186px] opacity-100 visible'
                )}>
                <ElementsList />
              </div>
            )}
          </React.Fragment>
        ))}

        <div className="menu-toggle top-0 w-[50px] h-[80px] bg-[#474A51] rounded-r-[50%] absolute transition-all ease-in-out duration-500 justify-center right-[-50px] flex items-center">
          <img
            src="/images/icon-menu.svg"
            className="w-8 h-8"
            alt="menu-icon"
          />
        </div>
      </div>
    </>
  )
}

export default SideBar
