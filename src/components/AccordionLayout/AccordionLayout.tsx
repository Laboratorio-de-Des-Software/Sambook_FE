import React from 'react'

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

const AccordionLayout = ({
  title,
  children,
  index,
  activeIndex,
  setActiveIndex
}) => {
  const handleSetIndex = (index) =>
    activeIndex !== index && setActiveIndex(index)

  return (
    <>
      <div
        onClick={() => handleSetIndex(index)}
        className="flex w-full justify-between p-2 mt-2 rounded-2xl bg-[#D9D9D9] border-solid border-2 border-black  cursor-pointer ">
        <div className="flex">
          <div className="flex flex-col justify-center items-center font-lancelot  text-black font-bold">
            {title}
          </div>
        </div>
        <div className="flex items-center justify-center">
          {activeIndex === index ? (
            <MdKeyboardArrowDown className="w-8 h-8" />
          ) : (
            <MdKeyboardArrowUp className="w-8 h-8" />
          )}
        </div>
      </div>

      {activeIndex === index && (
        <div className="shadow-3xl rounded-2xl shadow-cyan-500/50 p-4 mb-6 border-solid border-2 border-black">
          {children}
        </div>
      )}
    </>
  )
}

export default AccordionLayout
