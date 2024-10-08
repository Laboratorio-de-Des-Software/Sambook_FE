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

interface Passistas {
  id: string
  nome: string
  ordem: number
}

function ListaPassistasM() {
  const [passistas, setPassistas] = useState<Passistas[]>([])
  const [texto, setTexto] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('principais_passistasM')
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

  const fetchPassistas = async () => {
    const passistasCollection = await firebase
      .firestore()
      .collection('principais_passistasM')
      .orderBy('ordem')
      .get()
    const listaPa: Passistas[] = []
    passistasCollection.forEach((doc) => {
      const passistaData = doc.data()
      listaPa.push({
        id: doc.id,
        nome: passistaData.nome,
        ordem: passistaData.ordem
      })
    })
    setPassistas(listaPa)
  }

  useEffect(() => {
    fetchPassistas()
  }, [excluido, texto])

  const adicionarElemento = () => {
    if (texto.trim() !== '') {
      firebase
        .firestore()
        .collection('principais_passistasM')
        .add({
          nome: texto,
          ordem: 0
        })
        .then(async (docRef) => {
          const totalPassistas = await firebase
            .firestore()
            .collection('principais_passistasM')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalPassistas + 1
          await docRef.update({ ordem })

          const passistasSnapshot = await firebase
            .firestore()
            .collection('principais_passistasM')
            .orderBy('ordem')
            .get()
          const batch = firebase.firestore().batch()
          passistasSnapshot.docs.forEach((passistaDoc, index) => {
            batch.update(passistaDoc.ref, { ordem: index + 1 })
          })
          await batch.commit()
          limparCampoTexto()
          console.log('Passista adicionado com sucesso!')
        })
        .catch((error) => {
          console.error('Erro ao adicionar passista:', error)
        })
    }
  }

  const handleDragEnd = async (e: DropResult) => {
    if (!e.destination) return
    let tempData = Array.from(passistas)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedPassistas = tempData.map((passista, index) => ({
      ...passista,
      ordem: index + 1
    }))

    setPassistas(updatedPassistas)

    const batch = firebase.firestore().batch()
    updatedPassistas.forEach((passista) => {
      const docRef = firebase
        .firestore()
        .collection('principais_passistasM')
        .doc(passista.id)
      batch.update(docRef, { ordem: passista.ordem })
    })
    await batch.commit()
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('principais_passistasM')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const passistaData = docData as Passistas
            Swal.fire({
              title: 'Editar o Passista',
              html: `
              <div style="max-height: 500px; overflow-y: auto;">
              <p style=" margin-bottom: -20px; text-align: left"><strong style="margin-left: 250px">Nome: </strong><span style="color:red">*</span></p>
              <input id="nomePassista" type="text" class="swal2-input" value="${passistaData.nome}">
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
                  'nomePassista'
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
                  .collection('principais_passistasM')
                  .doc(id)
                  .update({
                    nome: novoNome
                  })
                  .then(() => {
                    console.log('Nome atualizado com sucesso!')
                    fetchPassistas()
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
      <h1 className="block mt-4 text-sm font-medium text-black">
        Principais Passistas Masculinos
      </h1>
      <div className="row">
        <div className="col-md-6 mt-3">
          <div className="input-group mb-3">
            <input
              onChange={(e) => setTexto(e.target.value)}
              value={texto}
              type="text"
              className="form-control"
              placeholder="Digite o nome do passista"
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
        <Droppable droppableId="passista">
          {(provider) => (
            <tbody ref={provider.innerRef} {...provider.droppableProps}>
              {passistas.map((passista, index) => (
                <Draggable
                  key={passista.nome}
                  draggableId={passista.nome}
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
                          {passista.nome}
                        </li>
                        <li
                          className="list-group-item"
                          style={{ width: '120px' }}>
                          <button onClick={() => editar(passista.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(passista.id)}>
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

export default ListaPassistasM
