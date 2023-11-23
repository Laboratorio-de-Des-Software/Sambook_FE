import { IItems } from '../SideBar'

const SideBarItem = ({
  item,
  onClick
}: {
  item: IItems
  onClick?: () => void
}) => {
  const { icon, title, href, hasList } = item

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      onClick={onClick}
      href={!hasList ? href : undefined}
      className="h-[49px] flex justify-between cursor-pointer hover:bg-[#5a5e66] bg-[#787c88] peer">
      <div className="flex">
        <div className=" bg-white border rounded-r-3xl w-[45px] border-black flex items-center">
          <img
            src={`images/${icon}`}
            alt={`${title} icon`}
            className="ml-1 w-[30px]"
          />
        </div>
        <span className="flex items-center ml-3 text-white text-xs">
          {title.toUpperCase()}
        </span>
      </div>
      {hasList && (
        <img
          src={'images/icon-arrow.svg'}
          className="w-4 color-white mr-2"
          alt="arrow icon"
        />
      )}
    </a>
  )
}

export default SideBarItem
