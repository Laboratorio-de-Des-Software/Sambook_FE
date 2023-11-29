import { useForm } from 'react-hook-form'
import Button from '../../Button'
import TextArea from '../../TextArea'

export const FichaTecnica = () => {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        register={register('enredo')}
        label="Enredo"
        rows={2}
        placeholder="Ô Zeca, o pagode onde é que é? Andei descalço, carroça e trem, procurando por Xerém, pra te ver, pra te abraçar, pra beber e batucar!"
      />

      <TextArea
        register={register('carnavalesco')}
        label="Carnavalesco"
        rows={1}
        placeholder="Digite o nome do carnavalesco responsável pelo enredo"
      />

      <TextArea
        register={register('autor')}
        label="Autor(es) do Enredo"
        rows={1}
        placeholder="Digite o nome do(s) autor(es) do enredo"
      />

      <TextArea
        register={register('elaborador')}
        label="Elaborador(es) do roteiro do desfile"
        rows={1}
        placeholder="Digite o nome do(s) elaboradores do roteiro do desfile"
      />

      <div className="flex flex-row justify-end mr-6 mt-5">
        <Button
          title="Salvar"
          textColor="#030303"
          background="#D9D9D9"
          width="40px"
          height="20px"
        />
      </div>
    </form>
  )
}

export const Historico = () => {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        label="Histórico"
        register={register('historico')}
        rows={5}
        placeholder="Aqui você diz sobre suas inspirações e um pouco mais sobre a contrução desta obra ..."
      />
      <div className="flex flex-row justify-end mr-6 mt-5">
        <Button
          title="Salvar"
          textColor="#030303"
          background="#D9D9D9"
          width="40px"
          height="20px"
        />
      </div>
    </form>
  )
}

export const Justificativa = () => {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        label="Justificativa"
        register={register('justificativa')}
        rows={5}
        placeholder="Justificativa do Enredo"
      />
      <TextArea
        label="Editor"
        register={register('editor')}
        rows={1}
        placeholder="Digite o nome do editor"
      />
      <TextArea
        label="Pesquisador"
        register={register('pesquisador')}
        rows={1}
        placeholder="Digite o nome do pesquisador"
      />
      <div className="flex flex-row justify-end mr-6 mt-5">
        <Button
          title="Salvar"
          textColor="#030303"
          background="#D9D9D9"
          width="40px"
          height="20px"
        />
      </div>
    </form>
  )
}

export const Roteiro = () => {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        label="Roteiro"
        register={register('roteiro')}
        rows={5}
        placeholder="Aqui você descreve o roteiro do seu desfile ..."
      />
      <div className="flex flex-row justify-end mr-6 mt-5">
        <Button
          title="Salvar"
          textColor="#030303"
          background="#D9D9D9"
          width="40px"
          height="20px"
        />
      </div>
    </form>
  )
}
