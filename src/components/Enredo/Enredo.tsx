import AccordionLayout from '../AccordionLayout'
import Button from '../Button'
import TextArea from '../TextArea'

const Enredo = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-end mr-6 gap-x-1">
        <Button
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
        />
      </div>

      <div className="lg:flex lg:flex-col lg:items-center lg:p-5 lg:gap-2 md:flex md:flex-row md:items-center sm:flex sm:flex-col sm:items-center ">
        <AccordionLayout title="Ficha Técnica">
          <TextArea
            label="Enredo"
            rows={2}
            placeholder="Ô Zeca, o pagode onde é que é? Andei descalço, carroça e trem, procurando por Xerém, pra te ver, pra te abraçar, pra beber e batucar!"
          />

          <TextArea
            label="Carnavalesco"
            rows={1}
            placeholder="Digite o nome do carnavalesco responsável pelo enredo"
          />

          <TextArea
            label="Autor(es) do Enredo"
            rows={1}
            placeholder="Digite o nome do(s) autor(es) do enredo"
          />

          <TextArea
            label="Elaborador(es) do roteiro do desfile"
            rows={1}
            placeholder="Digite o nome do(s) elaboradores do roteiro do desfile"
          />

          <div className="flex flex-row justify-end mr-6">
            <Button
              title="Adicionar Referências Biblíográficas +"
              textColor="#1465bb"
              background="#FFFFFF"
              width="50px"
              height="10px"
            />
          </div>
        </AccordionLayout>

        <AccordionLayout title="Histórico do Enredo">
          <TextArea
            label="Histórico"
            rows={5}
            placeholder="Aqui você diz sobre suas inspirações e um pouco mais sobre a contrução desta obra ..."
          />
        </AccordionLayout>

        <AccordionLayout title="Justificativa do Enredo">
          <TextArea
            label="Justificativa"
            rows={5}
            placeholder="Justificativa do Enredo"
          />

          <TextArea
            label="Editor"
            rows={1}
            placeholder="Digite o nome do editor"
          />

          <TextArea
            label="Pesquisador"
            rows={1}
            placeholder="Digite o nome do pesquisador"
          />
        </AccordionLayout>

        <AccordionLayout title="Roteiro">
          <TextArea
            label="Roteiro"
            rows={5}
            placeholder="Aqui você descreve o roteiro do seu desfile ..."
          />
        </AccordionLayout>
      </div>
    </div>
  )
}

export default Enredo
