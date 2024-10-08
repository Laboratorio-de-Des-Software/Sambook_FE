import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import firebase from '../../Config/firebase'
import './ListaFantasias.css'
import 'firebase/firestore'
import 'firebase/storage'
import Swal from 'sweetalert2'

interface Fantasia {
  id: string
  fantasia: string
  rep: string
  ala: string
  responsavel: string
  obs: string
  ordem: number
  imagemUrl: string
}

function ListaFantasias() {
  const [fantasias, setFantasias] = useState<Fantasia[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('fantasias')
      .doc(id)
      .delete()
      .then(() => {
        setExcluido(id)
        setFantasias((prevFantasias) =>
          prevFantasias.filter((fantasia) => fantasia.id !== id)
        )
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
    const fetchFantasias = async () => {
      const storage = firebase.storage()
      const storageRef = storage.ref()
      const fantasiasCollection = await firebase
        .firestore()
        .collection('fantasias')
        .orderBy('ordem')
        .get()
      const listaFan: Fantasia[] = []
      const getImageUrl = async (imageName: string) => {
        try {
          const imageUrl = await storageRef
            .child(`fantasias/${imageName}`)
            .getDownloadURL()
          return imageUrl
        } catch (error) {
          console.error('Erro ao obter URL da imagem:', error)
        }
      }
      for (const doc of fantasiasCollection.docs) {
        const fantasiaData = doc.data()
        const imageUrl = fantasiaData.imagemUrl

        if (fantasiaData.fantasia.toLowerCase().includes(busca.toLowerCase())) {
          listaFan.push({
            id: doc.id, // Adicionando o ID do livro
            fantasia: fantasiaData.fantasia,
            rep: fantasiaData.rep,
            ala: fantasiaData.ala,
            responsavel: fantasiaData.responsavel,
            obs: fantasiaData.obs,
            ordem: fantasiaData.ordem,
            imagemUrl: imageUrl
          })
        }
      }
      setFantasias(listaFan)
    }
    fetchFantasias()
  }, [busca, excluido])

  const handleDragEnd = async (e: DropResult) => {
    if (!e.destination) return
    let tempData = Array.from(fantasias)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedFan = tempData.map((fantasia, index) => ({
      ...fantasia,
      ordem: index + 1
    }))

    setFantasias(updatedFan)

    const batch = firebase.firestore().batch()
    updatedFan.forEach((fantasia) => {
      const docRef = firebase
        .firestore()
        .collection('fantasias')
        .doc(fantasia.id)
      batch.update(docRef, { ordem: fantasia.ordem })
    })
    await batch.commit()
  }

  function detalhes(id: string) {
    firebase
      .firestore()
      .collection('fantasias')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const fantasiaData = docData as Fantasia
            Swal.fire({
              title: 'Detalhes da Fantasia',
              html: `
              <div style="max-height: 400px; overflow-y: auto;">
                <p><strong>Nome da Fantasia: </strong> ${fantasiaData.fantasia}</p>
                <p><strong>O que Representa: </strong> ${fantasiaData.rep}</p>
                <p><strong>Nome da Ala: </strong> ${fantasiaData.ala}</p>
                <p><strong>Responsável pela Ala: </strong> ${fantasiaData.responsavel}</p>
                <p><strong>Observações: </strong> ${fantasiaData.obs}</p>
                <div style="display: flex; justify-content: center;">
                  <img src="${fantasiaData.imagemUrl}" alt="Imagem da Fantasia" 
                  style="max-width: 100%; height: auto; max-height: 300px; align-self: center;">
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
            Swal.fire({
              title: 'Erro',
              text: 'Detalhes da fantasia não encontrados.',
              icon: 'error'
            })
          }
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes da fantasia:', error)
        // Se houver um erro ao buscar os detalhes da fantasia, exiba uma mensagem de erro
        Swal.fire({
          title: 'Erro',
          text: 'Ocorreu um erro ao buscar os detalhes da fantasia. Por favor, tente novamente mais tarde.',
          icon: 'error'
        })
      })
  }

  return (
    <div>
      <h1 className="block mt-2 text-sm font-medium text-black">
        Dados Sobre As Fantasias de Alas
      </h1>
      <div className="row">
        <div className="col-4">
          <Link
            to="/conteudo/novafantasia"
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
              placeholder="Pesquisar Nome da Fantasia"
              aria-describedby="button-addon2"
            />
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fantasias">
          {(provided) => (
            <div
              className="row row-cols-1 row-cols-md-3 g-4 mt-6"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {fantasias.map((fantasia, index) => (
                <Draggable
                  key={fantasia.id}
                  draggableId={fantasia.id}
                  index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="col-md-4">
                      <div className="card h-100">
                        <img
                          src={fantasia.imagemUrl}
                          className="card-img-top"
                          alt="Imagem da Fantasia"
                          /*style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '300px'
                          }}*/
                        />
                        <div className="card-body">
                          <h1 className="card-title">{fantasia.fantasia}</h1>
                          <p className="card-text mb-4">
                            Clique em <i className="fas fa-file-alt"></i> e
                            saiba mais.
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Link
                              to={`/conteudo/editarfantasia/${fantasia.id}`}>
                              <i className="fas fa-edit icone-acao"></i>
                            </Link>
                            <button
                              onClick={() => confirmDeleteUser(fantasia.id)}>
                              <i className="red far fa-trash-alt icone-acao"></i>
                            </button>
                            <button onClick={() => detalhes(fantasia.id)}>
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

export default ListaFantasias
