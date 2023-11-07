type info = {
  title: string
  icon: SVGAElement
  status: string
}

const Card = (props: info) => {
  return (
    <div className="rounded-lg gap-5 ">
      <div className="flex flex-col justify-center items-center rounded-t-3xl bg-[#474A51] h-[50px] w-[200px] ">
        <p className="text-white font-lancelot">{props.title}</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-white  h-[100px] w-[200px] ">
        <p className="text-black text-5xl indent-[20px] ">{props.icon}</p>
      </div>
      <div className="flex flex-col rounded-b-3xl bg-[#209D34] h-[50px] w-[200px] ">
        <p className="text-white flex flex-rol justify-center p-2 items-center text-lg font-lancelot ">
          {props.status}
        </p>
      </div>
    </div>
  )
}

export default Card
