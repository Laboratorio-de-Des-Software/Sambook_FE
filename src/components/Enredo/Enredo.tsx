import AccordionLayout from '../AccordionLayout'
import Button from '../Button'

const Enredo = () => {
  return (
    <div className="lg:flex lg:flex-col lg:items-center lg:p-5 md:flex md:flex-row md:items-center sm:flex sm:flex-col sm:items-center ">
      <Button
        title="Editar"
        textColor="#030303"
        background="#D9D9D9"
        width="30px"
        height="10px"
      />
      <AccordionLayout
        title="Ficha Técnica"
        index={1}
        activeIndex={1}
        setActiveIndex={2}>
        <div className="flex flex-col w-full h-full">
          Teste 1<div className="">Teste 2</div>
        </div>
      </AccordionLayout>
    </div>
  )
}

export default Enredo
