import { IoIosArrowForward as ArrowIcon } from 'react-icons/io'

const items = [
  { title: 'Home', href: '/' },
  { title: 'Organograma', href: '/organograma' },
  { title: 'Gerar PDF', href: '/gerarpdf' }
]

const SideBar = () => {
  return (
    <div className="h-[calc(100%_-_100px)] w-[200px] bg-[#4E5453] text-white absolute">
      <div className="relative text-[32px] bg-[#474A51] text-white text-center	font-bold" style={{ top: '-0.21px', height: '62px', width: '200px' }}>
        Menu
      </div>
      {items.map((item) => (
        <div className="border-b border-b-white px-2 py-4 flex justify-between items-center cursor-pointer hover:bg-[#474A51]">
          {item.title.toUpperCase()}
          <ArrowIcon />
        </div>
      ))}
    </div>
  )
}

export default SideBar
