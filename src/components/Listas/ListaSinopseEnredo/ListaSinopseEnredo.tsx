import React, { useState, useEffect } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import firebase from '../../Config/firebase'
import 'firebase/firestore'
import Swal from 'sweetalert2'

interface Autores {
  id: string
  nome: string
  ordem: number
}

function ListaSinopseEnredo() {
  const [autores, setAutores] = useState<Autores[]>([])
  const [texto, setTexto] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('autores_sinopse')
      .doc(id)
      .delete()
      .then(() => {
        setExcluido(id)
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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  const fetchAutores = async () => {
    const autoresCollection = await firebase
      .firestore()
      .collection('autores_sinopse')
      .orderBy('ordem')
      .get()
    const listaAu: Autores[] = []
    autoresCollection.forEach((doc) => {
      const autorData = doc.data()
      listaAu.push({
        id: doc.id,
        nome: autorData.nome,
        ordem: autorData.ordem
      })
    })
    setAutores(listaAu)
  }

  useEffect(() => {
    fetchAutores()
  }, [excluido, texto])

  const adicionarAutor = () => {
    if (texto.trim() !== '') {
      firebase
        .firestore()
        .collection('autores_sinopse')
        .add({
          nome: texto,
          ordem: 0 // A ordem será atualizada após a adição
        })
        .then(async (docRef) => {
          const totalAutores = await firebase
            .firestore()
            .collection('autores_sinopse')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalAutores + 1
          await docRef.update({ ordem })

          const autoresSnapshot = await firebase
            .firestore()
            .collection('autores_sinopse')
            .orderBy('ordem')
            .get()
          const batch = firebase.firestore().batch()
          autoresSnapshot.docs.forEach((autorDoc, index) => {
            batch.update(autorDoc.ref, { ordem: index + 1 })
          })
          await batch.commit()
          limparCampoTexto()
          console.log('Autor adicionado com sucesso!')
        })
        .catch((error) => {
          console.error('Erro ao adicionar autor:', error)
        })
    }
  }

  const handleDragEnd = async (e: DropResult) => {
    if (!e.destination) return
    let tempData = Array.from(autores)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedAutores = tempData.map((autor, index) => ({
      ...autor,
      ordem: index + 1
    }))

    setAutores(updatedAutores)

    const batch = firebase.firestore().batch()
    updatedAutores.forEach((autor) => {
      const docRef = firebase
        .firestore()
        .collection('autores_sinopse')
        .doc(autor.id)
      batch.update(docRef, { ordem: autor.ordem })
    })
    await batch.commit()
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('autores_sinopse')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const autorData = docData as Autores
            Swal.fire({
              title: 'Editar Autor',
              html: `
              <div style="max-height: 500px; overflow-y: auto; text-align: left">
              <p style=" margin-bottom: -20px"><strong style="margin-left: 250px">Nome: </strong><span style="color:red">*</span></p>
              <input id="nomeAutor" type="text" style="margin-left: 240px" class="swal2-input" value="${autorData.nome}">
              </div>
            `,
              icon: 'info',
              confirmButtonColor: '#000000',
              confirmButtonText: 'Salvar',
              showCancelButton: true,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              reverseButtons: true,
              customClass: 'swal-wide',
              preConfirm: () => {
                const novoNomeSieInput = document.getElementById(
                  'nomeAutor'
                ) as HTMLInputElement
                const novoNome = novoNomeSieInput.value

                if (!novoNome) {
                  novoNomeSieInput.classList.add('borda')
                  Swal.showValidationMessage('Por favor, preencha o nome.')
                  return false
                }
                novoNomeSieInput.classList.remove('borda')

                return novoNome
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const novoNome = result.value
                firebase
                  .firestore()
                  .collection('autores_sinopse')
                  .doc(id)
                  .update({
                    nome: novoNome
                  })
                  .then(() => {
                    console.log('Nome do autor atualizado com sucesso!')
                    fetchAutores()
                  })
                  .catch((error) => {
                    console.error('Erro ao atualizar o nome do autor:', error)
                  })
              }
            })
          } else {
            Swal.fire({
              title: 'Erro',
              text: 'Detalhes do autor não encontrados.',
              icon: 'error'
            })
          }
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes do autor:', error)
        Swal.fire({
          title: 'Erro',
          text: 'Ocorreu um erro ao buscar os detalhes do autor. Por favor, tente novamente mais tarde.',
          icon: 'error'
        })
      })
  }

  const limparCampoTexto = () => {
    setTexto('')
  }

  return (
    <div>
      <h1 className="block mt-4 text-sm font-medium text-black">
        Autor(es) da Sinopse do Enredo
      </h1>
      <div className="row">
        <div className="col-md-6 mt-3">
          <div className="input-group mb-3">
            <input
              onChange={(e) => setTexto(e.target.value)}
              value={texto}
              type="text"
              className="form-control"
              placeholder="Digite o nome do autor"
              aria-describedby="button-addon2"
            />
            <button
              onClick={adicionarAutor}
              className="black btn btn-dark"
              id="basic-addon1"
              type="button">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="autor">
          {(provider) => (
            <tbody ref={provider.innerRef} {...provider.droppableProps}>
              {autores.map((autor, index) => (
                <Draggable
                  key={autor.nome}
                  draggableId={autor.nome}
                  index={index}>
                  {(provider) => (
                    <div>
                      <ul
                        className="list-group list-group-horizontal lista-autores"
                        {...provider.draggableProps}
                        ref={provider.innerRef}>
                        <li
                          className="list-group-item"
                          {...provider.dragHandleProps}>
                          =
                        </li>
                        <li className="list-group-item lista-autores">
                          {autor.nome}
                        </li>
                        <li
                          className="list-group-item"
                          style={{ width: '120px' }}>
                          <button onClick={() => editar(autor.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button onClick={() => confirmDeleteUser(autor.id)}>
                            <i className="red far fa-trash-alt icone-acao"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </Draggable>
              ))}
              {provider.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default ListaSinopseEnredo
