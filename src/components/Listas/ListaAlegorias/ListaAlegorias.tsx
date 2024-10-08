import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import firebase from '../../Config/firebase'
import 'firebase/firestore'
import 'firebase/storage'
import './ListaAlegorias.css'
import Swal from 'sweetalert2'

interface Alegoria {
  id: string
  alegoria: string
  rep: string
  tipo: string
  obs: string
  imagemUrl: string
  ordem: number
}

function ListaAlegorias() {
  const [alegorias, setAlegorias] = useState<Alegoria[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('alegorias')
      .doc(id)
      .delete()
      .then(() => {
        setExcluido(id)
        setAlegorias((prevAlegorias) =>
          prevAlegorias.filter((alegoria) => alegoria.id !== id)
        )
      })
      .catch((error) => {
        console.error('Erro ao deletar a alegoria:', error)
      })
  }

  function confirmDeleteUser(id: string) {
    Swal.fire({
      title: 'Deseja mesmo deletar?',
      text: 'Não será possível recuperar após exclusão',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, desejo deletar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id)
        setExcluido(id)
      }
    })
  }

  useEffect(() => {
    const fetchAlegorias = async () => {
      const storage = firebase.storage()
      const storageRef = storage.ref()
      const alegoriasCollection = await firebase
        .firestore()
        .collection('alegorias')
        .orderBy('ordem')
        .get()
      const listaAle: Alegoria[] = []
      const getImageUrl = async (imageName: string) => {
        try {
          const imageUrl = await storageRef
            .child(`alegorias/${imageName}`)
            .getDownloadURL()
          return imageUrl
        } catch (error) {
          console.error('Erro ao obter URL da imagem:', error)
        }
      }
      for (const doc of alegoriasCollection.docs) {
        const alegoriaData = doc.data()
        const imageUrl = alegoriaData.imagemUrl

        if (alegoriaData.alegoria.toLowerCase().includes(busca.toLowerCase())) {
          listaAle.push({
            id: doc.id,
            alegoria: alegoriaData.alegoria,
            rep: alegoriaData.rep,
            tipo: alegoriaData.tipo,
            obs: alegoriaData.obs,
            ordem: alegoriaData.ordem,
            imagemUrl: imageUrl
          })
        }
      }
      setAlegorias(listaAle)
    }
    fetchAlegorias()
  }, [busca, excluido])

  const handleDragEnd = async (e: DropResult) => {
    if (!e.destination) return
    let tempData = Array.from(alegorias)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedAle = tempData.map((alegoria, index) => ({
      ...alegoria,
      ordem: index + 1
    }))

    setAlegorias(updatedAle)

    const batch = firebase.firestore().batch()
    updatedAle.forEach((alegoria) => {
      const docRef = firebase
        .firestore()
        .collection('alegorias')
        .doc(alegoria.id)
      batch.update(docRef, { ordem: alegoria.ordem })
    })
    await batch.commit()
  }

  function detalhes(id: string) {
    firebase
      .firestore()
      .collection('alegorias')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const alegoriaData = docData as Alegoria
            Swal.fire({
              title: 'Detalhes da Alegoria',
              html: `
              <div style="max-height: 400px; overflow-y: auto;">
                <p><strong>Tipo da Alegoria: </strong> ${alegoriaData.tipo}</p>
                <p><strong>Nome da Alegoria: </strong> ${alegoriaData.alegoria}</p>
                <p><strong>O que Representa: </strong> ${alegoriaData.rep}</p>
                <p><strong>Observações: </strong> ${alegoriaData.obs}</p>
                <div style="display: flex; justify-content: center;">
                  <img src="${alegoriaData.imagemUrl}" alt="Imagem da Alegoria" style="max-width: 100%; height: auto; max-height: 300px; align-self: center;">
                </div>
              </div>
            `,
              icon: 'info',
              confirmButtonColor: '#000000',
              confirmButtonText: 'Voltar para a página inicial',
              reverseButtons: true,
              customClass: 'swal-wide'
            }).then()
          } else {
            // Se não encontrar os detalhes da fantasia, exibe uma mensagem de erro
            Swal.fire({
              title: 'Erro',
              text: 'Detalhes da alegorias não encontrados.',
              icon: 'error'
            })
          }
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes da alegoria:', error)
        // Se houver um erro ao buscar os detalhes da fantasia, exiba uma mensagem de erro
        Swal.fire({
          title: 'Erro',
          text: 'Ocorreu um erro ao buscar os detalhes da alegoria. Por favor, tente novamente mais tarde.',
          icon: 'error'
        })
      })
  }

  return (
    <div>
      <h1 className="block mt-2 text-sm font-medium text-black">
        Dados Sobre as Alegorias
      </h1>
      <div className="row">
        <div className="col-4">
          <Link
            to="/conteudo/novaalegoria"
            className="black btn btn-dark mt-3"
            type="button">
            <i className="fas fa-plus mr-3"></i>
            Adicionar
          </Link>
        </div>
        <div className="col-md-8 mt-3">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              <i className="fas fa-search"></i>
            </span>
            <input
              onChange={(e) => setBusca(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Pesquisar Nome da Alegoria"
              aria-describedby="button-addon2"
            />
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="alegorias">
          {(provided) => (
            <div
              className="row row-cols-1 row-cols-md-3 g-4 mt-6"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {alegorias.map((alegoria, index) => (
                <Draggable
                  key={alegoria.id}
                  draggableId={alegoria.id}
                  index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="col-md-4">
                      <div className="card h-100">
                        <img
                          src={alegoria.imagemUrl}
                          className="card-img-top"
                          alt="Imagem da Alegoria"
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '300px'
                          }}
                        />
                        <div className="card-body">
                          <h1 className="card-title">{alegoria.alegoria}</h1>
                          <p className="card-text mb-4">
                            Clique em <i className="fas fa-file-alt"></i> e
                            saiba mais.
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Link
                              to={`/conteudo/editaralegoria/${alegoria.id}`}>
                              <i className="fas fa-edit icone-acao"></i>
                            </Link>
                            <button
                              onClick={() => confirmDeleteUser(alegoria.id)}>
                              <i className="red far fa-trash-alt icone-acao"></i>
                            </button>
                            <button onClick={() => detalhes(alegoria.id)}>
                              <i className="fas fa-file-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default ListaAlegorias
