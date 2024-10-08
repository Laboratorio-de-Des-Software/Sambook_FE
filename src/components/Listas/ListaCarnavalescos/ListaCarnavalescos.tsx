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

interface Carnavalescos {
  id: string
  nome: string
  ordem: number
}

function ListaCarnavalescos() {
  const [carnavalescos, setCarnavalescos] = useState<Carnavalescos[]>([])
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState(false)
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('carnavalescos_enredo')
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
      }
    })
  }

  const fetchCarnavalescos = async () => {
    const carnavalescosCollection = await firebase
      .firestore()
      .collection('carnavalescos_enredo')
      .orderBy('ordem')
      .get()
    const listaCa: Carnavalescos[] = []
    carnavalescosCollection.forEach((doc) => {
      const carnavalescoData = doc.data()
      listaCa.push({
        id: doc.id,
        nome: carnavalescoData.nome,
        ordem: carnavalescoData.ordem
      })
    })
    setCarnavalescos(listaCa)
  }

  useEffect(() => {
    fetchCarnavalescos()
  }, [excluido, texto])

  const adicionar = () => {
    if (texto.trim() === '') {
      setErro(true) // Define o estado de erro como verdadeiro se o campo estiver vazio
      console.log('Erro definido como verdadeiro')
    } else {
      setErro(false) // Define o estado de erro como falso se o campo não estiver vazio
      console.log('Erro definido como falso')
      firebase
        .firestore()
        .collection('carnavalescos_enredo')
        .add({
          nome: texto,
          ordem: 0
        })
        .then(async (docRef) => {
          const totalCarnavalescos = await firebase
            .firestore()
            .collection('carnavalescos_enredo')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalCarnavalescos + 1
          await docRef.update({ ordem })

          const carnavalescosSnapshot = await firebase
            .firestore()
            .collection('carnavalescos_enredo')
            .orderBy('ordem')
            .get()
          const batch = firebase.firestore().batch()
          carnavalescosSnapshot.docs.forEach((carnavalescoDoc, index) => {
            batch.update(carnavalescoDoc.ref, { ordem: index + 1 })
          })
          await batch.commit()
          limparCampoTexto()
          console.log('Carnavalesco adicionado com sucesso!')
        })
        .catch((error) => {
          console.error('Erro ao adicionar carnavalesco:', error)
        })
    }
  }

  const handleDragEnd = async (e: DropResult) => {
    if (!e.destination) return
    let tempData = Array.from(carnavalescos)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedCarnavalescos = tempData.map((carnavalesco, index) => ({
      ...carnavalesco,
      ordem: index + 1
    }))

    setCarnavalescos(updatedCarnavalescos)

    const batch = firebase.firestore().batch()
    updatedCarnavalescos.forEach((carnavalesco) => {
      const docRef = firebase
        .firestore()
        .collection('carnavalescos_enredo')
        .doc(carnavalesco.id)
      batch.update(docRef, { ordem: carnavalesco.ordem })
    })
    await batch.commit()
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('carnavalescos_enredo')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const carnavalescoData = docData as Carnavalescos
            Swal.fire({
              title: 'Editar Carnavalesco',
              html: `
              <div style="max-height: 500px; overflow-y: auto; text-align: left">
              <p style=" margin-bottom: -20px"><strong style="margin-left: 250px">Nome: </strong><span style="color:red">*</span></p>
              <input id="nomeCarnavalesco" type="text" style="margin-left: 240px" class="swal2-input" value="${carnavalescoData.nome}">
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
                const novoNomeAutInput = document.getElementById(
                  'nomeCarnavalesco'
                ) as HTMLInputElement
                const novoNome = novoNomeAutInput.value

                if (!novoNome) {
                  novoNomeAutInput.classList.add('borda')
                  Swal.showValidationMessage('Por favor, preencha o nome.')
                  return false
                }
                novoNomeAutInput.classList.remove('borda')

                return novoNome
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const novoNome = result.value
                firebase
                  .firestore()
                  .collection('carnavalescos_enredo')
                  .doc(id)
                  .update({
                    nome: novoNome
                  })
                  .then(() => {
                    console.log('Nome do carnavalesco atualizado com sucesso!')
                    fetchCarnavalescos()
                  })
                  .catch((error) => {
                    console.error('Erro ao atualizar o nome:', error)
                  })
              }
            })
          } else {
            Swal.fire({
              title: 'Erro',
              text: 'Detalhes do carnavalesco não encontrados.',
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
        Carnavalescos
      </h1>
      <div className="row">
        <div className="col-md-6 mt-3">
          <div className={`input-group mb-3 ${erro ? 'input-error' : ''}`}>
            <input
              onChange={(e) => setTexto(e.target.value)}
              value={texto}
              type="text"
              className="form-control"
              placeholder="Digite o nome do carnavalesco"
              aria-describedby="button-addon2"
            />
            <button
              onClick={adicionar}
              className="black btn btn-dark"
              id="basic-addon1"
              type="button">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="carnavalesco">
          {(provider) => (
            <tbody ref={provider.innerRef} {...provider.droppableProps}>
              {carnavalescos.map((carnavalesco, index) => (
                <Draggable
                  key={carnavalesco.nome}
                  draggableId={carnavalesco.nome}
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
                          {carnavalesco.nome}
                        </li>
                        <li
                          className="list-group-item"
                          style={{ width: '120px' }}>
                          <button onClick={() => editar(carnavalesco.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(carnavalesco.id)}>
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

export default ListaCarnavalescos
