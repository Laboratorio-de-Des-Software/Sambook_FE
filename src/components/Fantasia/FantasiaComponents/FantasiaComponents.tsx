import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import firebase from '../../Config/firebase'
import Button from '../../Button'
import TextArea from '../../TextArea'
import TextAreaEditor from '../../TextAreaEditor'
import ListaOutrosF from '../../Listas/ListaOutrosFantasia/ListaOutrosF'
import ListaFantasias from '../../Listas/ListaFantasias/ListaFantasias'
import ListaCriadores from '../../Listas/ListaFichaFantasia/ListaCriadores/ListaCriadores'
import ListaDiretorF from '../../Listas/ListaFichaFantasia/ListaDiretorF/ListaDiretorF'
import ListaCostureiro from '../../Listas/ListaFichaFantasia/ListaCostureiro/ListaCostureiro'
import ListaChapeleiro from '../../Listas/ListaFichaFantasia/ListaChapeleiro/ListaChapeleiro'
import ListaAderecista from '../../Listas/ListaFichaFantasia/ListaAderecista/ListaAderecista'
import ListaSapateiro from '../../Listas/ListaFichaFantasia/ListaSapateiro/ListaSapateiro'
import Swal from 'sweetalert2'

export const FichaTecnica = () => {
  const { register, handleSubmit } = useForm()
  const [ficha, setFicha] = useState('')
  const [fichaId, setFichaId] = useState<string | null>(null)

  useEffect(() => {
    const fetchFicha = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('fichaTec_fantasia')
          .get()
        if (!snapshot.empty) {
          const firstDocument = snapshot.docs[0]
          setFichaId(firstDocument.id)
          setFicha(firstDocument.data().texto)
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }
    fetchFicha()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      if (fichaId) {
        await firebase
          .firestore()
          .collection('fichaTec_fantasia')
          .doc(fichaId)
          .update({
            texto: ficha
          })
      } else {
        const docRef = await firebase
          .firestore()
          .collection('fichaTec_fantasia')
          .add({
            texto: ficha
          })
        setFichaId(docRef.id)
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFicha(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ListaCriadores />

      <TextArea
        register={register('local')}
        label="Local do Atelier"
        rows={2}
        placeholder="Digite o endereço do Atelier"
        value={ficha}
        onChange={handleChange}
      />

      <ListaDiretorF />

      <ListaCostureiro />

      <ListaChapeleiro />

      <ListaAderecista />

      <ListaSapateiro />

      <ListaOutrosF></ListaOutrosF>

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

export const Fantasias = () => {
  const { handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ListaFantasias></ListaFantasias>
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
          .collection('info_fantasia')
          .get()
        if (!snapshot.empty) {
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
          .collection('info_fantasia')
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
          .collection('info_fantasia')
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
