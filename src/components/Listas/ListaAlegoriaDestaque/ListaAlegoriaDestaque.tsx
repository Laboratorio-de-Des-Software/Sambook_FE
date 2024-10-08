import React, { useState, useEffect } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import firebase from '../../Config/firebase'
import './ListaAlegoriaDestaque.css'
import 'firebase/firestore'
import Swal from 'sweetalert2'

interface AlegoriaD {
  id: string
  alegoria: string
  nome: string
  profissao: string
  ordem: number
}

function ListaAlegoriaD() {
  const [destaques, setDestaques] = useState<AlegoriaD[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('destaque_alegoria')
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
    const destCollection = await firebase
      .firestore()
      .collection('destaque_alegoria')
      .orderBy('ordem')
      .get()
    const listaD: AlegoriaD[] = []
    destCollection.forEach((doc) => {
      const destData = doc.data()
      if (destData.nome.toLowerCase().includes(busca.toLowerCase())) {
        listaD.push({
          id: doc.id,
          alegoria: destData.alegoria,
          nome: destData.nome,
          profissao: destData.profissao,
          ordem: destData.ordem
        })
      }
    })
    setDestaques(listaD)
  }

  useEffect(() => {
    fetchFunc()
  }, [busca, excluido])

  const adicionarItem = () => {
    Swal.fire({
      title: 'Adicionar Destaque',
      html: `
      <div style="text-align: left">
        <p style=" margin-bottom: -20px"><strong style="margin-left: 250px">Alegoria/Tripé: </strong><span style="color:red">*</span></p>
        <input id="alegoria" class="swal2-input" style="margin-left: 240px" placeholder="Digite a Alegoria/Tripé">
        <p style=" margin-top: 20px"><strong style="margin-left: 250px">Nome do Destaque: </strong><span style="color:red">*</span></p>
        <input id="nome" style=" margin-top:2px; margin-left: 240px" class="swal2-input" placeholder="Digite o nome">
        <p style=" margin-top: 20px"><strong style="margin-left: 250px">Respectiva Profissão: </strong><span style="color:red">*</span></p>
        <input id="profissao" style=" margin-top:2px; margin-left: 240px" class="swal2-input" placeholder="Digite a profissão">
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
        const alegoriaInput = document.getElementById(
          'alegoria'
        ) as HTMLInputElement
        const nomeInput = document.getElementById('nome') as HTMLInputElement
        const profissaoInput = document.getElementById(
          'profissao'
        ) as HTMLInputElement

        if (!alegoriaInput.value || !nomeInput.value || !profissaoInput.value) {
          if (!alegoriaInput.value) {
            alegoriaInput.classList.add('borda')
          } else {
            alegoriaInput.classList.remove('borda')
          }
          if (!nomeInput.value) {
            nomeInput.classList.add('borda')
          } else {
            nomeInput.classList.remove('borda')
          }
          if (!profissaoInput.value) {
            profissaoInput.classList.add('borda')
          } else {
            profissaoInput.classList.remove('borda')
          }

          Swal.showValidationMessage(
            'Por favor, preencha todos os campos obrigatórios.'
          )
          return false
        }
        const ordem = destaques.length + 1
        return {
          alegoria: alegoriaInput.value,
          nome: nomeInput.value,
          profissao: profissaoInput.value,
          ordem: ordem
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { alegoria, nome, profissao, ordem } = result.value
        firebase
          .firestore()
          .collection('destaque_alegoria')
          .add({
            alegoria,
            nome,
            profissao,
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

  function editar(id: string) {
    firebase
      .firestore()
      .collection('destaque_alegoria')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const destData = docData as AlegoriaD
            Swal.fire({
              title: 'Editar Destaque',
              html: `
              <div style="text-align: left">
              <p style=" margin-bottom: -20px"><strong style="margin-left: 250px">Alegoria/Tripé: </strong><span style="color:red">*</span></p>
              <input id="alegoria" class="swal2-input" style="margin-left: 240px" value="${destData.alegoria}">
              <p style=" margin-top: 20px"><strong style="margin-left: 250px">Nome do Destaque: </strong><span style="color:red">*</span></p>
              <input id="nome" style=" margin-top:2px; margin-left: 240px" class="swal2-input" value="${destData.nome}">
              <p style=" margin-top: 20px"><strong style="margin-left: 250px">Respectiva Profissão: </strong><span style="color:red">*</span></p>
              <input id="profissao" style=" margin-top:2px; margin-left: 240px" class="swal2-input" value="${destData.profissao}">
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
                const alegoriaInput = document.getElementById(
                  'alegoria'
                ) as HTMLInputElement
                const nomeInput = document.getElementById(
                  'nome'
                ) as HTMLInputElement
                const profissaoInput = document.getElementById(
                  'profissao'
                ) as HTMLInputElement

                let emptyFields = []
                if (!alegoriaInput.value) {
                  emptyFields.push('Alegoria/Tripé:')
                  alegoriaInput.classList.add('borda')
                } else {
                  alegoriaInput.classList.remove('borda')
                }

                if (!nomeInput.value) {
                  emptyFields.push('Nome do Destaque:')
                  nomeInput.classList.add('borda')
                } else {
                  nomeInput.classList.remove('borda')
                }

                if (!profissaoInput.value) {
                  emptyFields.push('Respectiva Profissão:')
                  profissaoInput.classList.add('borda')
                } else {
                  profissaoInput.classList.remove('borda')
                }

                if (emptyFields.length > 0) {
                  Swal.showValidationMessage(
                    'Por favor, preencha todos os campos obrigatórios.'
                  )
                }

                const ordem = destaques.length + 1
                return {
                  alegoria: alegoriaInput.value,
                  nome: nomeInput.value,
                  profissao: profissaoInput.value,
                  ordem: ordem
                }
              },
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                const { alegoria, nome, profissao } = result.value
                firebase
                  .firestore()
                  .collection('destaque_alegoria')
                  .doc(id)
                  .update({
                    alegoria,
                    nome,
                    profissao
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
    let tempData = Array.from(destaques)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedDest = tempData.map((destaque, index) => ({
      ...destaque,
      ordem: index + 1
    }))

    setDestaques(updatedDest)

    const batch = firebase.firestore().batch()
    updatedDest.forEach((destaque) => {
      const docRef = firebase
        .firestore()
        .collection('destaque_alegoria')
        .doc(destaque.id)
      batch.update(docRef, { ordem: destaque.ordem })
    })
    await batch.commit()
  }

  return (
    <div>
      <h1 className="block mt-2 text-sm font-medium text-black">
        Representação de Alegoria
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
              placeholder="Pesquisar Nome da Alegoria"
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
              <th scope="col">Alegoria/Tripé</th>
              <th scope="col">Nomes dos Principais Destaques</th>
              <th scope="col">Respectivas Profissões</th>
              <th scope="col" className="col-acao"></th>
            </tr>
          </thead>
          <Droppable droppableId="alegoria">
            {(provider) => (
              <tbody ref={provider.innerRef} {...provider.droppableProps}>
                {destaques.map((destaque, index) => (
                  <Draggable
                    key={destaque.alegoria}
                    draggableId={destaque.alegoria}
                    index={index}>
                    {(provider) => (
                      <tr {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
                        <td>{destaque.alegoria}</td>
                        <td>{destaque.nome}</td>
                        <td>{destaque.profissao}</td>
                        <td>
                          <button onClick={() => editar(destaque.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(destaque.id)}>
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

export default ListaAlegoriaD
