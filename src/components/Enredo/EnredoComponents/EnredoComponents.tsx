import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import firebase from '../../Config/firebase'
import Button from '../../Button'
import TextArea from '../../TextArea'
import TextAreaEditor from '../../TextAreaEditor'
import ListaLivros from '../../Listas/ListaLivros/ListaLivros'
import ListaAutoresEnredo from '../../Listas/ListaAutoresEnredo'
import ListaSinopseEnredo from '../../Listas/ListaSinopseEnredo'
import ListaElaboradorEnredo from '../../Listas/ListaElaboradorEnredo'
import ListaCarnavalescos from '../../Listas/ListaCarnavalescos'
import Swal from 'sweetalert2'

export const FichaTecnica = () => {
  const { register, handleSubmit } = useForm()
  const [ficha, setFicha] = useState('')
  const [fichaId, setFichaId] = useState<string | null>(null)

  useEffect(() => {
    // Função para buscar o título do enredo no Firestore
    const fetchFicha = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('fichaTec_enredo')
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

    // Chame a função de busca quando o componente for montado
    fetchFicha()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      if (fichaId) {
        await firebase
          .firestore()
          .collection('fichaTec_enredo')
          .doc(fichaId)
          .update({
            texto: ficha
          })
      } else {
        const docRef = await firebase
          .firestore()
          .collection('fichaTec_enredo')
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

  const handleEnredoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFicha(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        register={register('enredo')}
        label="Título do Enredo"
        rows={2}
        placeholder="Digite o título do enredo"
        value={ficha}
        onChange={handleEnredoChange}
      />

      <ListaCarnavalescos />

      <ListaAutoresEnredo />

      <ListaSinopseEnredo />

      <ListaElaboradorEnredo />

      <ListaLivros />

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

export const Historico = () => {
  const { register, handleSubmit } = useForm()
  const [historico, setHistorico] = useState('')
  const [historicoId, setHistoricoId] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('historico_enredo')
          .get()
        if (!snapshot.empty) {
          const firstDocument = snapshot.docs[0]
          setHistoricoId(firstDocument.id)
          setHistorico(firstDocument.data().texto)
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }

    fetchHistorico()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      if (historicoId) {
        await firebase
          .firestore()
          .collection('historico_enredo')
          .doc(historicoId)
          .update({
            texto: historico
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
          .collection('historico_enredo')
          .add({
            texto: historico
          })
        setHistoricoId(docRef.id)
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

  const handleHistoricoChange = (content: string) => {
    setHistorico(content)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextAreaEditor
        label="Histórico"
        register={register('historico')}
        rows={5}
        placeholder="Aqui você diz sobre suas inspirações e um pouco mais sobre a contrução desta obra ..."
        value={historico || ''}
        onChange={handleHistoricoChange}
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
  const [justificativa, setJustificativa] = useState('')
  const [justificativaId, setJustificativaId] = useState<string | null>(null)

  useEffect(() => {
    const fetchJustificativa = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('justificativa_enredo')
          .get()
        if (!snapshot.empty) {
          const firstDocument = snapshot.docs[0]
          setJustificativaId(firstDocument.id)
          setJustificativa(firstDocument.data().texto)
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }

    // Chame a função de busca quando o componente for montado
    fetchJustificativa()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      if (justificativaId) {
        await firebase
          .firestore()
          .collection('justificativa_enredo')
          .doc(justificativaId)
          .update({
            texto: justificativa
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
          .collection('justificativa_enredo')
          .add({
            texto: justificativa
          })
        setJustificativaId(docRef.id)
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

  const handleJustChange = (content: string) => {
    setJustificativa(content)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextAreaEditor
        label="Justificativa"
        register={register('justificativa')}
        rows={5}
        placeholder="Justificativa do Enredo"
        value={justificativa || ''}
        onChange={handleJustChange}
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
  const [roteiro, setRoteiro] = useState('')
  const [roteiroId, setRoteiroId] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoteiro = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('roteiro_enredo')
          .get()
        if (!snapshot.empty) {
          const firstDocument = snapshot.docs[0]
          setRoteiroId(firstDocument.id)
          setRoteiro(firstDocument.data().texto)
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }
    fetchRoteiro()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      if (roteiroId) {
        await firebase
          .firestore()
          .collection('roteiro_enredo')
          .doc(roteiroId)
          .update({
            texto: roteiro
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
          .collection('roteiro_enredo')
          .add({
            texto: roteiro
          })
        setRoteiroId(docRef.id)
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

  const handleRotChange = (content: string) => {
    setRoteiro(content)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextAreaEditor
        label="Roteiro"
        register={register('roteiro')}
        rows={5}
        placeholder="Aqui você descreve o roteiro do seu desfile ..."
        value={roteiro || ''}
        onChange={handleRotChange}
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

export const OutrasInfo = () => {
  const { register, handleSubmit } = useForm()
  const [info, setInfo] = useState('')
  const [infoId, setInfoId] = useState<string | null>(null)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('info_enredo')
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
          .collection('info_enredo')
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
          .collection('info_enredo')
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
