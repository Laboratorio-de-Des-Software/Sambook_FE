type info = {
  title: string
  textColor: string
  background: string
  width: string
  height: string
}

const Button = (props: info) => {
  return (
    <button className="justify-center items-center border-solid  border-2 border-black p-2 cursor-pointer bg-[{props.background}] w-[{props.width}] h-[{props.height}] rounded-2xl text-xl mx-3">
      {props.title}
    </button>
  )
}

export default Button
