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

interface PessoasN {
  id: string
  nome: string
  descricao: string
  ordem: number
}

function ListaPessoasNotaveisIC() {
  const [notaveis, setNotaveis] = useState<PessoasN[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('pessoas_notaveis')
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

  const fetchFunc = async () => {
    const notaCollection = await firebase
      .firestore()
      .collection('pessoas_notaveis')
      .orderBy('ordem')
      .get()
    const listaN: PessoasN[] = []
    notaCollection.forEach((doc) => {
      const notaData = doc.data()
      if (notaData.nome.toLowerCase().includes(busca.toLowerCase())) {
        listaN.push({
          id: doc.id,
          nome: notaData.nome,
          descricao: notaData.descricao,
          ordem: notaData.ordem
        })
      }
    })
    setNotaveis(listaN)
  }

  useEffect(() => {
    fetchFunc()
  }, [busca, excluido])

  const adicionarItem = () => {
    Swal.fire({
      title: 'Adicionar Pessoas Notaveis que desfilaram',
      html: `
      <div style="text-align: left">
        <p style=" margin-bottom: -20px"><strong style="margin-left: 250px">Nome: </strong><span style="color:red">*</span></p>
        <input id="nome" class="swal2-input" style="margin-left: 240px" placeholder="Digite o nome">
        <p style=" margin-top: 20px"><strong style="margin-left: 250px">Descrição: </strong><span style="color:red">*</span></p>
        <input id="descricao" style=" margin-top:2px; margin-left: 240px" class="swal2-input" placeholder="Digite a descrição">
        </div>
      `,
      confirmButtonColor: '#000000',
      confirmButtonText: 'Salvar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: 'swal-wide',
      preConfirm: () => {
        const nomePessoaInput = document.getElementById(
          'nome'
        ) as HTMLInputElement
        const descricaoInput = document.getElementById(
          'descricao'
        ) as HTMLInputElement

        if (!nomePessoaInput.value || !descricaoInput.value) {
          if (!nomePessoaInput.value) {
            nomePessoaInput.classList.add('borda')
          } else {
            nomePessoaInput.classList.remove('borda')
          }
          if (!descricaoInput.value) {
            descricaoInput.classList.add('borda')
          } else {
            descricaoInput.classList.remove('borda')
          }

          Swal.showValidationMessage('Por favor, preencha todos os campos.')
          return false
        }
        const ordem = notaveis.length + 1
        return {
          nome: nomePessoaInput.value,
          descricao: descricaoInput.value,
          ordem: ordem
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { nome, descricao, ordem } = result.value
        firebase
          .firestore()
          .collection('pessoas_notaveis')
          .add({
            nome,
            descricao,
            ordem
          })
          .then(() => {
            fetchFunc()
          })
          .catch((error) => {
            console.error('Erro ao adicionar destaque:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editarPessoasN(id: string) {
    firebase
      .firestore()
      .collection('pessoas_notaveis')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const notaData = docData as PessoasN
            Swal.fire({
              title: 'Editar Pessoas Notáveis',
              html: `
              <div style="text-align: left">
              <p style=" margin-bottom: -20px"><strong style="margin-left: 250px">Nome: </strong><span style="color:red">*</span></p>
              <input id="nome" class="swal2-input" style="margin-left: 240px" value="${notaData.nome}">
              <p style=" margin-top: 20px"><strong style="margin-left: 250px">Descrição: </strong><span style="color:red">*</span></p>
              <input id="descricao" style=" margin-top:2px; margin-left: 240px" class="swal2-input" value="${notaData.descricao}">
              </div>
              `,
              confirmButtonColor: '#000000',
              confirmButtonText: 'Salvar',
              showCancelButton: true,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              reverseButtons: true,
              customClass: 'swal-wide',
              preConfirm: () => {
                const nomePessoaInput = document.getElementById(
                  'nome'
                ) as HTMLInputElement
                const descricaoInput = document.getElementById(
                  'descricao'
                ) as HTMLInputElement

                let emptyFields = []
                if (!nomePessoaInput.value) {
                  emptyFields.push('Nomes:')
                  nomePessoaInput.classList.add('borda')
                } else {
                  nomePessoaInput.classList.remove('borda')
                }

                if (!descricaoInput.value) {
                  emptyFields.push('Descrição:')
                  descricaoInput.classList.add('borda')
                } else {
                  descricaoInput.classList.remove('borda')
                }

                if (emptyFields.length > 0) {
                  Swal.showValidationMessage(
                    'Por favor, preencha todos os campos obrigatórios.'
                  )
                }
                const ordem = notaveis.length + 1
                return {
                  nome: nomePessoaInput.value,
                  descricao: descricaoInput.value,
                  ordem: ordem
                }
              },
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                const { nome, descricao } = result.value
                firebase
                  .firestore()
                  .collection('pessoas_notaveis')
                  .doc(id)
                  .update({
                    nome,
                    descricao
                  })
                  .then(() => {
                    console.log('Dados atualizados com sucesso!')
                    fetchFunc()
                  })
                  .catch((error) => {
                    console.error('Erro ao atualizar dados:', error)
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
        console.error('Erro ao buscar detalhes:', error)
        Swal.fire({
          title: 'Erro',
          text: 'Ocorreu um erro ao buscar os detalhes. Por favor, tente novamente mais tarde.',
          icon: 'error'
        })
      })
  }

  const handleDragEnd = async (e: DropResult) => {
    if (!e.destination) return
    let tempData = Array.from(notaveis)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedNota = tempData.map((notaveis, index) => ({
      ...notaveis,
      ordem: index + 1
    }))

    setNotaveis(updatedNota)

    const batch = firebase.firestore().batch()
    updatedNota.forEach((notaveis) => {
      const docRef = firebase
        .firestore()
        .collection('pessoas_notaveis')
        .doc(notaveis.id)
      batch.update(docRef, { ordem: notaveis.ordem })
    })
    await batch.commit()
  }

  return (
    <div>
      <h1 className="block mt-2 text-sm font-medium text-black">
        Pessoas Notáveis que desfilam na Agremiação (Artistas, Esportistas,etc.)
      </h1>
      <div className="row">
        <div className="col-4">
          <button
            onClick={adicionarItem}
            className="black btn btn-dark mt-2"
            id="basic-addon1"
            type="button">
            <i className="fas fa-plus"></i>
          </button>
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
              placeholder="Pesquisar Nome das Pessoas que Desfilaram"
              aria-describedby="button-addon2"
            />
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <table className="table table-hover table-bordered mt-3 text-center">
          <thead>
            <tr>
              <th />
              <th scope="col">Nomes</th>
              <th scope="col">Descrições</th>
              <th scope="col" className="col-acao"></th>
            </tr>
          </thead>
          <Droppable droppableId="pessoas_notaveis">
            {(provider) => (
              <tbody ref={provider.innerRef} {...provider.droppableProps}>
                {notaveis.map((notaveis, index) => (
                  <Draggable
                    key={notaveis.nome}
                    draggableId={notaveis.nome}
                    index={index}>
                    {(provider) => (
                      <tr {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
                        <td>{notaveis.nome}</td>
                        <td>{notaveis.descricao}</td>
                        <td>
                          <button onClick={() => editarPessoasN(notaveis.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(notaveis.id)}>
                            <i className="red far fa-trash-alt icone-acao"></i>
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provider.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
    </div>
  )
}

export default ListaPessoasNotaveisIC
