import { elements } from '../../shared/constants'

const SideBar = () => {
  return (
    <>
      <div className="transition-all ease-in-out duration-500 w-[45px] absolute z-10 h-full peer">
        {elements.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="h-[49px] flex items-center bg-white border rounded-r-3xl border-black">
            <img
              src={`images/${item?.icon}`}
              alt={`${item.title} icon`}
              className="ml-1 w-[30px]"
            />
          </div>
        ))}
      </div>
      <div className="w-0 peer-hover:w-[200px] hover:w-[200px] bg-[#787c88] text-white absolute ">
        {elements.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="border-b border-b-white px-2 py-4 flex justify-between items-center cursor-pointer hover:bg-[#5a5e66]">
            <span className="ml-[45px] text-xs">
              {item.title.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export default SideBar
