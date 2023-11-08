const Card = () => {
  return (
    <div className="rounded-lg gap-5">
      <div className="flex flex-col justify-center items-center rounded-t-3xl bg-[#474A51] h-[50px] w-[200px] ">
        <p>Bateria</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-white  h-[100px] w-[200px] ">
        <p className="text-black text-5xl indent-[20px] ">Testes</p>
      </div>
      <div className="flex flex-col rounded-b-3xl bg-[#209D34] h-[50px] w-[200px] "></div>
    </div>
  )
}

export default Card
