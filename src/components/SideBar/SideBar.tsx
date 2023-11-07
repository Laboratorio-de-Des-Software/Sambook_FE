import { IoIosArrowForward as ArrowIcon } from 'react-icons/io'

const items = [
  { title: 'Home', href: '/' },
  { title: 'Organograma', href: '/organograma' },
  { title: 'Gerar PDF', href: '/gerarpdf' }
]

const SideBar = () => {
  return (
    <div className="h-[calc(100%_-_100px)] w-[200px] bg-[#4E5453] text-white absolute">
      {items.map((item) => (
        <div className="border-b border-b-white px-2 py-4 flex justify-between items-center cursor-pointer">
          {item.title.toUpperCase()}
          <ArrowIcon />
        </div>
      ))}
    </div>
  )
}

export default SideBar
