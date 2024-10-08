import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import firebase from '../../Config/firebase'
import Button from '../../Button'
import TextArea from '../../TextArea'
import TextAreaEditor from '../../TextAreaEditor'
import ListaAutoresSE from '../../Listas/ListaAutoresSE'
import ListaIdadeSE from '../../Listas/ListaIdadeSE'
import Swal from 'sweetalert2'

export const FichaTecnica = () => {
  const { register, handleSubmit } = useForm()
  const [presidente, setPresidente] = useState('')
  const [componentes, setComponentes] = useState('')

  useEffect(() => {
    // Função para buscar o título do enredo no Firestore
    const fetchFicha = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('fichaTec_sambaenredo')
          .get()
        if (!snapshot.empty) {
          // Se existir um documento na coleção, obtenha o primeiro documento
          const firstDocument = snapshot.docs[0].data()
          // Defina o título do enredo no estado
          setPresidente(firstDocument.presidente)
          setComponentes(firstDocument.componentes)
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }

    // Chame a função de busca quando o componente for montado
    fetchFicha()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      const fichaRef = firebase.firestore().collection('fichaTec_sambaenredo')

      // Verifica se já existe um documento na coleção
      const snapshot = await fichaRef.get()
      if (!snapshot.empty) {
        // Se já existe, atualiza o documento existente com o novo título
        const docId = snapshot.docs[0].id
        await fichaRef.doc(docId).update({
          presidente: data.presidente,
          componentes: data.componentes
        })
      } else {
        // Se não existe, cria um novo documento com o título
        await fichaRef.add({
          presidente: data.presidente,
          componentes: data.componentes
        })
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error)
    }
  }

  function exibirMensagem() {
    Swal.fire({
      title: 'Sucesso',
      text: 'Dados salvos com sucesso!',
      confirmButtonColor: '#000000',
      icon: 'success'
    })
  }

  const handleFichaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'presidente') {
      setPresidente(value)
    } else if (name === 'componentes') {
      setComponentes(value)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ListaAutoresSE></ListaAutoresSE>

      <TextArea
        register={register('presidente')}
        name="presidente"
        label="Presidente da Ala dos Compositores"
        rows={1}
        placeholder="Digite o nome do presidente da ala dos compositores"
        value={presidente}
        onChange={handleFichaChange}
      />

      <TextArea
        register={register('componentes')}
        name="componentes"
        label="Total de Componentes da Ala dos Compositores"
        rows={1}
        placeholder="Digite o total de componentes da ala dos compositores"
        value={componentes}
        onChange={handleFichaChange}
      />

      <ListaIdadeSE></ListaIdadeSE>

      <div className="flex flex-row justify-end mr-6 mt-5">
        <Button
          title="Salvar"
          textColor="#030303"
          background="#D9D9D9"
          width="40px"
          height="20px"
          onClick={exibirMensagem}
        />
      </div>
    </form>
  )
}

export const OutrasInfo = () => {
  const { register, handleSubmit } = useForm()
  const [info, setInfo] = useState('')
  const [infoId, setInfoId] = useState<string | null>(null)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('info_sambaenredo')
          .get()
        if (!snapshot.empty) {
          // Se existir um documento na coleção, obtenha o primeiro documento
          const firstDocument = snapshot.docs[0]
          setInfoId(firstDocument.id)
          setInfo(firstDocument.data().texto)
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }
    fetchInfo()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      if (infoId) {
        await firebase
          .firestore()
          .collection('info_sambaenredo')
          .doc(infoId)
          .update({
            texto: info
          })
        Swal.fire({
          title: 'Sucesso',
          text: 'Dados salvos com sucesso!',
          confirmButtonColor: '#000000',
          icon: 'success'
        })
      } else {
        const docRef = await firebase
          .firestore()
          .collection('info_sambaenredo')
          .add({
            texto: info
          })
        setInfoId(docRef.id)
        Swal.fire({
          title: 'Sucesso',
          text: 'Dados salvos com sucesso!',
          confirmButtonColor: '#000000',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error)
    }
  }

  const handleInfoChange = (content: string) => {
    setInfo(content)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextAreaEditor
        label="Informações Extras"
        register={register('info')}
        rows={5}
        placeholder="Adicione outras informações julgadas necessárias"
        value={info || ''}
        onChange={handleInfoChange}
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
