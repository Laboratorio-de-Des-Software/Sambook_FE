type info = {
  title: string
  icon?: any
  status: string
  link?: string
}

const Card = ({ title, icon, status, link }: info) => {
  return (
    <a href={link || ''} className="rounded-lg gap-5 cursor-pointer ">
      <div className="flex flex-col justify-center items-center rounded-t-3xl bg-[#474A51] h-[50px] w-[200px] ">
        <p className="text-white font-lancelot">{title}</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-white  h-[100px] w-[200px] ">
        <p className="text-black text-5xl indent-[20px] ">
          <img src={`images/${icon}`} alt={`icone do card ${title}`} />
        </p>
      </div>
      <div className="flex flex-col rounded-b-3xl bg-[#209D34] h-[50px] w-[200px] ">
        <p className="text-white flex flex-rol justify-center p-2 items-center text-lg font-lancelot ">
          {status}
        </p>
      </div>
    </a>
  )
}

export default Card
