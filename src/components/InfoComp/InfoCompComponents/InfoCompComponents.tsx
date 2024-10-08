import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import firebase from '../../Config/firebase'
import Button from '../../Button'
import TextArea from '../../TextArea'
import TextAreaEditor from '../../TextAreaEditor'
import ListaComponentesBaiana from '../../Listas/ListaInfoComp/ListaComponentesInfoC/ComponentesBaiana/ListaComponentesBaiana'
import ListaComponentesCrianca from '../../Listas/ListaInfoComp/ListaComponentesInfoC/ComponentesCrianca/ListaComponentesCrianca'
import ListaComponentesVelhaG from '../../Listas/ListaInfoComp/ListaComponentesInfoC/ComponentesVelhaG/ListaComponentesVelhaG'
import ListaDiretoresInfoC from '../../Listas/ListaInfoComp/ListaDiretoresInfoC/OutrosDiretores'
import ListaPessoasNotaveisIC from '../../Listas/ListaInfoComp/ListaPessoasNotaveisInfoC/ListaPessoasNotaveisIC'
import ListaResponsavelBaiana from '../../Listas/ListaInfoComp/ListaResponsavelInfoC/ResponsavelBaiana/ListaResponsavelBaiana'
import ListaResponsavelCrianca from '../../Listas/ListaInfoComp/ListaResponsavelInfoC/ResponsavelCrianca/ListaResponsavelCrianca'
import ListaResponsavelVG from '../../Listas/ListaInfoComp/ListaResponsavelInfoC/ResponsavelVelhaG/ListaResponsavelVG'
import ListaDiretorGeralInfoC from '../../Listas/ListaInfoComp/ListaDiretoresInfoC/DiretorGeral/ListaDiretorGeralInfoC'
import Swal from 'sweetalert2'

export const FichaTecnica = () => {
  const { register, handleSubmit } = useForm()
  const [vice, setVice] = useState('')

  useEffect(() => {
    const fetchFicha = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('fichaTec_InfoComp')
          .get()
        if (!snapshot.empty) {
          const firstDocument = snapshot.docs[0].data()
          setVice(firstDocument.nome)
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }
    fetchFicha()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      const fichaRef = firebase.firestore().collection('fichaTec_InfoComp')
      const snapshot = await fichaRef.get()
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id
        await fichaRef.doc(docId).update({
          nome: data.vice
        })
      } else {
        // Se não existe, cria um novo documento com o título
        await fichaRef.add({
          nome: data.vice
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setVice(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        register={register('vice')}
        label="Vice-Presidente de Carnaval"
        rows={1}
        placeholder="Digite o nome do vice-presidente de Carnaval"
        value={vice}
        onChange={handleChange}
      />

      <ListaDiretorGeralInfoC />

      <ListaDiretoresInfoC />

      <ListaResponsavelCrianca />

      <ListaComponentesCrianca />

      <ListaResponsavelBaiana />

      <ListaComponentesBaiana />

      <ListaResponsavelVG />

      <ListaComponentesVelhaG />

      <ListaPessoasNotaveisIC />

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
          .collection('info_InfoComp')
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
          .collection('info_InfoComp')
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
          .collection('info_InfoComp')
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
