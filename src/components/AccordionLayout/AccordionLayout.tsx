import React, { useState } from 'react'
import { cn } from '../../shared/helpers'

// import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

const AccordionLayout = ({
  title,
  children,
  index,
  activeIndex,
  setActiveIndex
}: any) => {
  const [isopen, setIsopen] = useState(false)
  return (
    <>
      <div
        className={cn(
          'flex flex-col w-full  p-2 mt-2 rounded-2xl bg-white border-solid border-2 border-black  cursor-pointer',
          !isopen && 'h-[40px] bg-[#F1F1EA] '
        )}>
        <div
          onClick={() => setIsopen(!isopen)}
          className="flex flex-col font-lancelot  text-black font-bold">
          {title}
        </div>
        <div className="flex flex-col bg-white ml-2 mt-4 overflow-hidden gap-2">
          {children}
        </div>
      </div>
    </>
  )
}

export default AccordionLayout
