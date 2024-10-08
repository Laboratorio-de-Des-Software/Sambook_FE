import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import firebase from '../../Config/firebase'
import Button from '../../Button'
import TextArea from '../../TextArea'
import ListaDiretoresBateria from '../../Listas/ListaDiretoresBateria/OutrosDiretores'
import ListaComponentesGrupo from '../../Listas/ListaComponentesGrupo/ListaComponentesGrupo'
import TextAreaEditor from '../../TextAreaEditor'
import ListaDiretorB from '../../Listas/ListaDiretoresBateria/DiretorGeral/ListaDiretor'
import Swal from 'sweetalert2'

export const FichaTecnica = () => {
  const { register, handleSubmit } = useForm()
  const [componentes, setComponentes] = useState('')

  useEffect(() => {
    const fetchFicha = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('fichaTec_bateria')
          .get()
        if (!snapshot.empty) {
          const firstDocument = snapshot.docs[0].data()
          setComponentes(firstDocument.componentes)
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }
    fetchFicha()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      const fichaRef = firebase.firestore().collection('fichaTec_bateria')

      const snapshot = await fichaRef.get()
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id
        await fichaRef.doc(docId).update({
          componentes: data.componentes
        })
      } else {
        await fichaRef.add({
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
    if (name === 'componentes') {
      setComponentes(value)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ListaDiretorB />

      <ListaDiretoresBateria />

      <TextArea
        register={register('componentes')}
        name="componentes"
        label="Total de Componentes da Bateria"
        rows={1}
        placeholder="Digite o total de componentes da Bateria"
        value={componentes}
        onChange={handleFichaChange}
      />

      <ListaComponentesGrupo />

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
          .collection('info_bateria')
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
          .collection('info_bateria')
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
          .collection('info_bateria')
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
