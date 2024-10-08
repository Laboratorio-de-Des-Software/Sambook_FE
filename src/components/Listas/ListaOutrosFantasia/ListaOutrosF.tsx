import React, { useState, useEffect } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import firebase from '../../Config/firebase'
import './ListaOutrosF.css'
import 'firebase/firestore'
import Swal from 'sweetalert2'

interface Funcionario {
  id: string
  nome: string
  funcao: string
  ordem: number
}

function ListaOutrosF() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('outros_profissionais_fantasia')
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

  const fetchFunc = async () => {
    const funcCollection = await firebase
      .firestore()
      .collection('outros_profissionais_fantasia')
      .orderBy('ordem')
      .get()
    const listaF: Funcionario[] = []
    funcCollection.forEach((doc) => {
      const funcData = doc.data()
      if (funcData.nome.toLowerCase().includes(busca.toLowerCase())) {
        listaF.push({
          id: doc.id,
          nome: funcData.nome,
          funcao: funcData.funcao,
          ordem: funcData.ordem
        })
      }
    })
    setFuncionarios(listaF)
  }

  useEffect(() => {
    fetchFunc()
  }, [busca, excluido])

  const adicionarItem = () => {
    Swal.fire({
      title: 'Adicionar Funcionário',
      html: `
      <div style="text-align: left">
        <p style=" margin-bottom: -15px; margin-top: 20px"><strong style="margin-left: 250px">Nome do Funcionário: </strong><span style="color:red">*</span></p>
        <input id="nome" class="swal2-input" style="margin-left: 240px" placeholder="Digite o nome">
        <p style=" margin-top: 20px"><strong style="margin-left: 250px"> Respectiva função: </strong><span style="color:red">*</span></p>
        <input id="funcao" class="swal2-input" style=" margin-top:2px; margin-left: 240px" placeholder="Digite o nome">
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
        const nomeInput = document.getElementById('nome') as HTMLInputElement
        const funcaoInput = document.getElementById(
          'funcao'
        ) as HTMLInputElement
        if (!nomeInput.value || !funcaoInput.value) {
          if (!nomeInput.value) {
            nomeInput.classList.add('borda')
          } else {
            nomeInput.classList.remove('borda')
          }

          if (!funcaoInput.value) {
            funcaoInput.classList.add('borda')
          } else {
            funcaoInput.classList.remove('borda')
          }

          Swal.showValidationMessage('Por favor, preencha todos os campos.')
          return false // Indicando que a validação falhou
        }

        const ordem = funcionarios.length + 1
        return {
          nome: nomeInput.value,
          funcao: funcaoInput.value,
          ordem: ordem
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { nome, funcao, ordem } = result.value
        firebase
          .firestore()
          .collection('outros_profissionais_fantasia')
          .add({
            nome,
            funcao,
            ordem
          })
          .then(() => {
            fetchFunc()
          })
          .catch((error) => {
            console.error('Erro ao adicionar funcionário:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('outros_profissionais_fantasia')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const funcData = docData as Funcionario
            Swal.fire({
              title: 'Editar Funcionário',
              html: `
              <div style="text-align: left">
              <p style=" margin-bottom: -15px; margin-top: 20px"><strong style="margin-left: 250px">Nome do Funcionário: </strong><span style="color:red">*</span></p>
              <input id="nome" style="margin-left: 240px" class="swal2-input" value="${funcData.nome}">
              <p style=" margin-top: 20px"><strong style="margin-left: 250px"> Respectiva função: </strong><span style="color:red">*</span></p>
              <input id="funcao" style=" margin-top:2px; margin-left: 240px" class="swal2-input" value="${funcData.funcao}">
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
                const nomeInput = document.getElementById(
                  'nome'
                ) as HTMLInputElement
                const funcaoInput = document.getElementById(
                  'funcao'
                ) as HTMLInputElement
                let emptyFields = []

                if (!nomeInput.value) {
                  emptyFields.push('Nome do Funcionário:')
                  nomeInput.classList.add('borda')
                } else {
                  nomeInput.classList.remove('borda')
                }

                if (!funcaoInput.value) {
                  emptyFields.push('Respectiva função:')
                  funcaoInput.classList.add('borda')
                } else {
                  funcaoInput.classList.remove('borda')
                }

                if (emptyFields.length > 0) {
                  Swal.showValidationMessage(
                    'Por favor, preencha todos os campos.'
                  )
                  return false // Impede o fechamento do modal se houver campos vazios
                } else {
                  const nome = nomeInput.value
                  const funcao = funcaoInput.value
                  return { nome, funcao } // Retorna os valores preenchidos
                }
              },
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                const { nome, funcao } = result.value
                firebase
                  .firestore()
                  .collection('outros_profissionais_fantasia')
                  .doc(id)
                  .update({
                    nome,
                    funcao
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
    let tempData = Array.from(funcionarios)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedFunc = tempData.map((funcionario, index) => ({
      ...funcionario,
      ordem: index + 1
    }))

    setFuncionarios(updatedFunc)

    const batch = firebase.firestore().batch()
    updatedFunc.forEach((funcionario) => {
      const docRef = firebase
        .firestore()
        .collection('outros_profissionais_fantasia')
        .doc(funcionario.id)
      batch.update(docRef, { ordem: funcionario.ordem })
    })
    await batch.commit()
  }

  return (
    <div>
      <h1 className="block mt-2 text-sm font-medium text-black">
        Outros Funcionários e suas Respectivas Funções
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
              placeholder="Pesquisar Nome do Funcionário"
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
              <th scope="col">Nome</th>
              <th scope="col">Respectiva Função</th>
              <th scope="col" className="col-acao"></th>
            </tr>
          </thead>
          <Droppable droppableId="nome">
            {(provider) => (
              <tbody ref={provider.innerRef} {...provider.droppableProps}>
                {funcionarios.map((funcionario, index) => (
                  <Draggable
                    key={funcionario.nome}
                    draggableId={funcionario.nome}
                    index={index}>
                    {(provider) => (
                      <tr {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
                        <td>{funcionario.nome}</td>
                        <td>{funcionario.funcao}</td>
                        <td>
                          <button onClick={() => editar(funcionario.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(funcionario.id)}>
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

export default ListaOutrosF
