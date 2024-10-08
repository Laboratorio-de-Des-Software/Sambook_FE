import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import firebase from '../../Config/firebase'
import Button from '../../Button'
import TextAreaEditor from '../../TextAreaEditor'
import ListaResponsavel from '../../Listas/ListaComFrente/ListaResponsavel/ListaResponsavel'
import ListaDiretorComF from '../../Listas/ListaComFrente/ListaDiretorComF'
import ListaComponentes from '../../Listas/ListaComFrente/ListaComponentes/ListaComponentes'
import Swal from 'sweetalert2'

export const FichaTecnica = () => {
  const { handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ListaResponsavel />

      <ListaDiretorComF />

      <ListaComponentes />

      <div className="flex flex-row justify-end mr-6 mt-5" />
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
          .collection('info_comFrente')
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
          .collection('info_comFrente')
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
          .collection('info_comFrente')
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
