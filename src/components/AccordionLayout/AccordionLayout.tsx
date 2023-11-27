import { useState } from 'react'
import { cn } from '../../shared/helpers'

const AccordionLayout = ({ title, children }: any) => {
  const [isopen, setIsopen] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-col w-full p-2 mt-2 rounded-2xl bg-white border-solid border-2 border-black cursor-pointer',
        !isopen && 'h-[40px] bg-[#F1F1EA]'
      )}>
      <div
        onClick={() => setIsopen(!isopen)}
        className="flex justify-between items-center">
        <span className="font-lancelot h-5 text-black text-xl">{title}</span>
        <img
          src="images/icon-arrow-black.svg"
          alt="icone seta"
          className={cn(
            'h-4 w-4 rotate-[270deg] transition ease-in-out duration-500',
            isopen && 'rotate-[90deg]'
          )}
        />
      </div>
      <div className="flex flex-col bg-white ml-2 mt-4 overflow-hidden gap-2">
        {children}
      </div>
    </div>
  )
}

export default AccordionLayout
