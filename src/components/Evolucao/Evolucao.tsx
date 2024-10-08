import AccordionLayout from '../AccordionLayout'
import Button from '../Button'
import {
  FichaTecnica,
  OutrasInfo
} from './EvolucaoComponents/EvolucaoComponents'

const items = [
  {
    title: 'Ficha Técnica',
    children: <FichaTecnica />
  },
  {
    title: 'Outras informações julgadas necessárias',
    children: <OutrasInfo />
  }
]

const Evolucao = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-end mr-6 gap-x-1">
        {/*<Button
          title="Editar"
          textColor="#030303"
          background="#D9D9D9"
          width="30px"
          height="10px"
        />
        <Button
          title="Concluir"
          textColor="white"
          background="black"
          width="50px"
          height="10px"
  />*/}
      </div>
      <div className="lg:flex lg:flex-col lg:items-center lg:p-5 lg:gap-2 md:flex md:flex-row md:items-center sm:flex sm:flex-col sm:items-center">
        {items.map((item) => (
          <AccordionLayout title={item.title}>{item.children}</AccordionLayout>
        ))}
      </div>
    </div>
  )
}

export default Evolucao
