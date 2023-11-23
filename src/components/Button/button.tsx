type info = {
  title: string
  textColor: string
  background: string
  width: string
  height: string
}

const Button = (props: info) => {
  return (
    <div className="flex flex-col justify-center items-center border-solid  border-2 border-black  cursor-pointer bg-[{props.background}] w-[{props.width}] h-[{props.height}] rounded-lg">
      <h1 className="text-[{props.textColor}] text-xl mx-3">{props.title} </h1>
    </div>
  )
}

export default Button
