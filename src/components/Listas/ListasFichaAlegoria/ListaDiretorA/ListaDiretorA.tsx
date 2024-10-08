import React, { useState, useEffect } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import firebase from '../../../Config/firebase'
import 'firebase/firestore'
import Swal from 'sweetalert2'

interface Diretores {
  id: string
  nome: string
  ordem: number
}

function ListaDiretorA() {
  const [diretores, setDiretores] = useState<Diretores[]>([])
  const [texto, setTexto] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('diretor_alegoria')
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

  const fetchDiretores = async () => {
    const diretoresCollection = await firebase
      .firestore()
      .collection('diretor_alegoria')
      .orderBy('ordem')
      .get()
    const listaDi: Diretores[] = []
    diretoresCollection.forEach((doc) => {
      const diretorData = doc.data()
      listaDi.push({
        id: doc.id,
        nome: diretorData.nome,
        ordem: diretorData.ordem
      })
    })
    setDiretores(listaDi)
  }

  useEffect(() => {
    fetchDiretores()
  }, [excluido, texto])

  const adicionarElemento = () => {
    if (texto.trim() !== '') {
      firebase
        .firestore()
        .collection('diretor_alegoria')
        .add({
          nome: texto,
          ordem: 0
        })
        .then(async (docRef) => {
          const totalDiretores = await firebase
            .firestore()
            .collection('diretor_alegoria')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalDiretores + 1
          await docRef.update({ ordem })

          const diretoresSnapshot = await firebase
            .firestore()
            .collection('diretor_alegoria')
            .orderBy('ordem')
            .get()
          const batch = firebase.firestore().batch()
          diretoresSnapshot.docs.forEach((diretorDoc, index) => {
            batch.update(diretorDoc.ref, { ordem: index + 1 })
          })
          await batch.commit()
          limparCampoTexto()
          console.log('Diretor adicionado com sucesso!')
        })
        .catch((error) => {
          console.error('Erro ao adicionar diretor:', error)
        })
    }
  }

  const handleDragEnd = async (e: DropResult) => {
    if (!e.destination) return
    let tempData = Array.from(diretores)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedDiretores = tempData.map((diretor, index) => ({
      ...diretor,
      ordem: index + 1
    }))

    setDiretores(updatedDiretores)

    const batch = firebase.firestore().batch()
    updatedDiretores.forEach((diretor) => {
      const docRef = firebase
        .firestore()
        .collection('diretor_alegoria')
        .doc(diretor.id)
      batch.update(docRef, { ordem: diretor.ordem })
    })
    await batch.commit()
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('diretor_alegoria')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const diretorData = docData as Diretores
            Swal.fire({
              title: 'Editar Diretor',
              html: `
              <div style="max-height: 500px; overflow-y: auto;">
              <p style=" margin-bottom: -20px; text-align: left"><strong style="margin-left: 250px">Nome: </strong><span style="color:red">*</span></p>
              <input id="nomeDiretor" type="text" class="swal2-input" value="${diretorData.nome}">
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
                const novoNomeInput = document.getElementById(
                  'nomeDiretor'
                ) as HTMLInputElement
                const novoNome = novoNomeInput.value

                if (!novoNome) {
                  if (!novoNome) {
                    novoNomeInput.classList.add('borda')
                  } else {
                    novoNomeInput.classList.remove('borda')
                  }
                  Swal.showValidationMessage('Por favor, preencha o nome.')
                  return false
                }
                return { novoNome }
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const { novoNome } = result.value
                firebase
                  .firestore()
                  .collection('diretor_alegoria')
                  .doc(id)
                  .update({
                    nome: novoNome
                  })
                  .then(() => {
                    console.log('Nome atualizado com sucesso!')
                    fetchDiretores()
                  })
                  .catch((error) => {
                    console.error('Erro ao atualizar o nome:', error)
                  })
              }
            })
          } else {
            Swal.fire({
              title: 'Erro',
              text: 'Detalhes não encontrados.',
              icon: 'error'
            })
          }
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes:', error)
        Swal.fire({
          title: 'Erro',
          text: 'Ocorreu um erro ao buscar os detalhes. Por favor, tente novamente mais tarde.',
          icon: 'error'
        })
      })
  }

  const limparCampoTexto = () => {
    setTexto('')
  }

  return (
    <div>
      <h1 className="block mt-2 text-sm font-medium text-black">
        Diretor Responsável pelo Barracão
      </h1>
      <div className="row">
        <div className="col-md-6 mt-3">
          <div className="input-group mb-3">
            <input
              onChange={(e) => setTexto(e.target.value)}
              value={texto}
              type="text"
              className="form-control"
              placeholder="Digite o nome do diretor"
              aria-describedby="button-addon2"
            />
            <button
              onClick={adicionarElemento}
              className="black btn btn-dark"
              id="basic-addon1"
              type="button">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="diretores">
          {(provider) => (
            <tbody ref={provider.innerRef} {...provider.droppableProps}>
              {diretores.map((diretor, index) => (
                <Draggable
                  key={diretor.nome}
                  draggableId={diretor.nome}
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
                          {diretor.nome}
                        </li>
                        <li
                          className="list-group-item"
                          style={{ width: '120px' }}>
                          <button onClick={() => editar(diretor.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button onClick={() => confirmDeleteUser(diretor.id)}>
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

export default ListaDiretorA
