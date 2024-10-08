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

interface Ficha {
  id: string
  nome: string
  ordem: number
}

function ListaPintor() {
  const [pessoa, setPessoa] = useState<Ficha[]>([])
  const [texto, setTexto] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('pintor_alegoria')
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

  const fetchPessoa = async () => {
    const pessoaCollection = await firebase
      .firestore()
      .collection('pintor_alegoria')
      .orderBy('ordem')
      .get()
    const lista: Ficha[] = []
    pessoaCollection.forEach((doc) => {
      const pessoaData = doc.data()
      lista.push({
        id: doc.id,
        nome: pessoaData.nome,
        ordem: pessoaData.ordem
      })
    })
    setPessoa(lista)
  }

  useEffect(() => {
    fetchPessoa()
  }, [excluido, texto])

  const adicionarElemento = () => {
    if (texto.trim() !== '') {
      firebase
        .firestore()
        .collection('pintor_alegoria')
        .add({
          nome: texto,
          ordem: 0
        })
        .then(async (docRef) => {
          const totalPessoas = await firebase
            .firestore()
            .collection('pintor_alegoria')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalPessoas + 1
          await docRef.update({ ordem })

          const pessoasSnapshot = await firebase
            .firestore()
            .collection('pintor_alegoria')
            .orderBy('ordem')
            .get()
          const batch = firebase.firestore().batch()
          pessoasSnapshot.docs.forEach((pessoaDoc, index) => {
            batch.update(pessoaDoc.ref, { ordem: index + 1 })
          })
          await batch.commit()
          limparCampoTexto()
          console.log('Pintor adicionado com sucesso!')
        })
        .catch((error) => {
          console.error('Erro ao adicionar pintor:', error)
        })
    }
  }

  const handleDragEnd = async (e: DropResult) => {
    if (!e.destination) return
    let tempData = Array.from(pessoa)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedPessoas = tempData.map((pessoa, index) => ({
      ...pessoa,
      ordem: index + 1
    }))

    setPessoa(updatedPessoas)

    const batch = firebase.firestore().batch()
    updatedPessoas.forEach((pessoa) => {
      const docRef = firebase
        .firestore()
        .collection('pintor_alegoria')
        .doc(pessoa.id)
      batch.update(docRef, { ordem: pessoa.ordem })
    })
    await batch.commit()
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('pintor_alegoria')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const pessoaData = docData as Ficha
            Swal.fire({
              title: 'Editar Pintor',
              html: `
              <div style="max-height: 500px; overflow-y: auto;">
              <p style=" margin-bottom: -20px; text-align: left"><strong style="margin-left: 250px">Nome: </strong><span style="color:red">*</span></p>
              <input id="nome" type="text" class="swal2-input" value="${pessoaData.nome}">
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
                  'nome'
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
                  .collection('pintor_alegoria')
                  .doc(id)
                  .update({
                    nome: novoNome
                  })
                  .then(() => {
                    console.log('Nome atualizado com sucesso!')
                    fetchPessoa()
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
        Pintor Chefe de Equipe
      </h1>
      <div className="row">
        <div className="col-md-6 mt-3">
          <div className="input-group mb-3">
            <input
              onChange={(e) => setTexto(e.target.value)}
              value={texto}
              type="text"
              className="form-control"
              placeholder="Digite o nome do pintor"
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
        <Droppable droppableId="pessoa">
          {(provider) => (
            <tbody ref={provider.innerRef} {...provider.droppableProps}>
              {pessoa.map((pessoa, index) => (
                <Draggable
                  key={pessoa.nome}
                  draggableId={pessoa.nome}
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
                          {pessoa.nome}
                        </li>
                        <li
                          className="list-group-item"
                          style={{ width: '120px' }}>
                          <button onClick={() => editar(pessoa.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button onClick={() => confirmDeleteUser(pessoa.id)}>
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

export default ListaPintor
