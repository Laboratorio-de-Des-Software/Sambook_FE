import React, { useState, useEffect } from 'react'
import 'react-router-dom'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import firebase from '../../Config/firebase'
import './ListaLivro.css'
import 'firebase/firestore'
import Swal from 'sweetalert2'

interface Livro {
  id: string
  livro: string
  autor: string
  editora: string
  ano: number
  paginas: string
  ordem: number
}

function ListaLivros() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('livros')
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

  const fetchLivros = async () => {
    const livrosCollection = await firebase
      .firestore()
      .collection('livros')
      .orderBy('ordem')
      .get()
    const listaLi: Livro[] = []
    livrosCollection.forEach((doc) => {
      const livroData = doc.data()
      if (livroData.livro.toLowerCase().includes(busca.toLowerCase())) {
        listaLi.push({
          id: doc.id,
          livro: livroData.livro,
          autor: livroData.autor,
          editora: livroData.editora,
          ano: livroData.ano,
          paginas: livroData.paginas,
          ordem: livroData.ordem
        })
      }
    })
    setLivros(listaLi)
  }

  useEffect(() => {
    fetchLivros()
  }, [excluido, busca])

  const adicionarLivro = () => {
    Swal.fire({
      title: 'Adicionar Livro',
      html: `
      <div  style="text-align: left">
      <p style=" margin-bottom: -20px"><strong id="livroTitle" style="margin-left: 250px" >Título do Livro: </strong><span style="color:red">*</span></p>
      <input id="livro" class="swal2-input" style="margin-left: 240px" placeholder="Digite o título">
      <p style="margin-top: 20px" ><strong id="autorTitle" style="margin-left: 250px" >Autor: </strong><span style="color:red">*</span></p>
      <input id="autor" style=" margin-top:2px; margin-left: 240px" class="swal2-input" style=" margin-bottom: -300px" placeholder="Digite o nome">
      <p style="margin-top: 20px"><strong id="editoraTitle" style="margin-left: 250px" >Editora: </strong><span style="color:red">*</span></p>
      <input id="editora" style=" margin-top:2px; margin-left: 240px" class="swal2-input" placeholder="Digite a editora">
      <p style="margin-top: 20px" ><strong id="anoTitle" style="margin-left: 250px" >Ano de Edição: </strong><span style="color:red">*</span></p>
      <input id="ano" style=" margin-top:2px; margin-left: 240px" class="swal2-input" placeholder="Digite o ano (YYYY)" pattern="d{4}" title="Por favor, insira um ano válido no formato YYYY">
      <p style="margin-top: 20px"><strong id="paginasTitle" style="margin-left: 250px" >Páginas Consultadas: </strong><span style="color:red">*</span></p>
      <input id="paginas" style=" margin-top:2px; margin-left: 240px" class="swal2-input"  placeholder="Digite as páginas">
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
        const livroInput = document.getElementById('livro') as HTMLInputElement
        const autorInput = document.getElementById('autor') as HTMLInputElement
        const editoraInput = document.getElementById(
          'editora'
        ) as HTMLInputElement
        const anoInput = document.getElementById('ano') as HTMLInputElement
        const paginasInput = document.getElementById(
          'paginas'
        ) as HTMLInputElement

        // Verificar se os campos obrigatórios estão preenchidos
        if (
          !livroInput.value ||
          !autorInput.value ||
          !editoraInput.value ||
          !anoInput.value ||
          !paginasInput.value
        ) {
          if (!livroInput.value) {
            livroInput.classList.add('borda')
          } else {
            livroInput.classList.remove('borda')
          }

          if (!autorInput.value) {
            autorInput.classList.add('borda')
          } else {
            autorInput.classList.remove('borda')
          }

          if (!editoraInput.value) {
            editoraInput.classList.add('borda')
          } else {
            editoraInput.classList.remove('borda')
          }

          if (!anoInput.value) {
            anoInput.classList.add('borda')
          } else {
            anoInput.classList.remove('borda')
          }

          if (!paginasInput.value) {
            paginasInput.classList.add('borda')
          } else {
            paginasInput.classList.remove('borda')
          }

          Swal.showValidationMessage('Por favor, preencha todos os campos.')
        }

        // Validar o ano
        const ano = parseInt(anoInput.value)
        if (isNaN(ano) || ano < 1000 || ano > new Date().getFullYear()) {
          Swal.showValidationMessage('Por favor, insira um ano válido.')
          return false
        }

        const ordem = livros.length + 1
        return {
          livro: livroInput.value,
          autor: autorInput.value,
          editora: editoraInput.value,
          ano: ano,
          paginas: paginasInput.value,
          ordem: ordem
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { livro, autor, editora, ano, paginas, ordem } = result.value
        firebase
          .firestore()
          .collection('livros')
          .add({
            livro,
            autor,
            editora,
            ano,
            paginas,
            ordem
          })
          .then(() => {
            fetchLivros()
          })
          .catch((error) => {
            console.error('Erro ao adicionar livro:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('livros')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const livroData = docData as Livro
            Swal.fire({
              title: 'Editar Livro',
              html: `
              <div  style="text-align: left">
              <p style=" margin-bottom: -20px"><strong id="livroTitle" style="margin-left: 250px" >Título do Livro: </strong><span style="color:red">*</span></p>
              <input id="livro" type="text" class="swal2-input" style="margin-left: 240px" value="${livroData.livro}" required>
              <p style=" margin-top: 20px"><strong style="margin-left: 250px">Autor: </strong><span style="color:red">*</span></p>
              <input id="autor" type="text" class="swal2-input" style=" margin-top:2px; margin-left: 240px" value="${livroData.autor}" required>
              <p style=" margin-top: 20px"><strong style="margin-left: 250px">Editora: </strong><span style="color:red">*</span></p>
              <input id="editora" type="text" class="swal2-input" style=" margin-top:2px; margin-left: 240px" value="${livroData.editora}" required>
              <p style=" margin-top: 20px"><strong style="margin-left: 250px">Ano de Edição: </strong><span style="color:red">*</span></p>
              <input id="ano" type="number" class="swal2-input" style=" margin-top:2px; margin-left: 240px" value="${livroData.ano}" required>
              <p style=" margin-top: 20px"><strong style="margin-left: 250px">Páginas Consultadas: </strong><span style="color:red">*</span></p>
              <input id="paginas" type="text" class="swal2-input" style=" margin-top:2px; margin-left: 240px" value="${livroData.paginas}" required>
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
                const livroInput = document.getElementById(
                  'livro'
                ) as HTMLInputElement
                const autorInput = document.getElementById(
                  'autor'
                ) as HTMLInputElement
                const editoraInput = document.getElementById(
                  'editora'
                ) as HTMLInputElement
                const anoInput = document.getElementById(
                  'ano'
                ) as HTMLInputElement
                const paginasInput = document.getElementById(
                  'paginas'
                ) as HTMLInputElement

                let emptyFields = []

                if (!livroInput.value) {
                  emptyFields.push('Título do Livro')
                  livroInput.classList.add('borda')
                } else {
                  livroInput.classList.remove('borda')
                }
                if (!autorInput.value) {
                  emptyFields.push('Autor')
                  autorInput.classList.add('borda')
                } else {
                  autorInput.classList.remove('borda')
                }
                if (!editoraInput.value) {
                  emptyFields.push('Editora')
                  editoraInput.classList.add('borda')
                } else {
                  editoraInput.classList.remove('borda')
                }
                if (!anoInput.value) {
                  emptyFields.push('Ano de Edição')
                  anoInput.classList.add('borda')
                } else {
                  anoInput.classList.remove('borda')
                }
                if (!paginasInput.value) {
                  emptyFields.push('Páginas Consultadas')
                  paginasInput.classList.add('borda')
                } else {
                  paginasInput.classList.remove('borda')
                }

                if (emptyFields.length > 0) {
                  Swal.showValidationMessage(
                    `Por favor, preencha os seguintes campos: ${emptyFields.join(
                      ', '
                    )}.`
                  )
                  return false
                }

                // Validar o ano
                const ano = parseInt(anoInput.value)
                if (
                  isNaN(ano) ||
                  ano < 1000 ||
                  ano > new Date().getFullYear()
                ) {
                  Swal.showValidationMessage('Por favor, insira um ano válido.')
                  return false
                }
                const ordem = livros.length + 1
                return {
                  livro: livroInput.value,
                  autor: autorInput.value,
                  editora: editoraInput.value,
                  ano: ano,
                  paginas: paginasInput.value,
                  ordem: ordem
                }
              },
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                const { livro, autor, editora, ano, paginas } = result.value
                firebase
                  .firestore()
                  .collection('livros')
                  .doc(id)
                  .update({
                    livro,
                    autor,
                    editora,
                    ano,
                    paginas
                  })
                  .then(() => {
                    console.log('Dados atualizados com sucesso!')
                    fetchLivros()
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
    let tempData = Array.from(livros)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedLivros = tempData.map((livro, index) => ({
      ...livro,
      ordem: index + 1
    }))

    setLivros(updatedLivros)

    const batch = firebase.firestore().batch()
    updatedLivros.forEach((livro) => {
      const docRef = firebase.firestore().collection('livros').doc(livro.id)
      batch.update(docRef, { ordem: livro.ordem })
    })
    await batch.commit()
  }

  return (
    <div>
      <h1 className="block mt-2 text-sm font-medium text-black">
        Lista de Livros
      </h1>
      <div className="row">
        <div className="col-4">
          <button
            onClick={adicionarLivro}
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
              placeholder="Pesquisar Título do Livro"
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
              <th scope="col">Título</th>
              <th scope="col">Autor</th>
              <th scope="col">Editora</th>
              <th scope="col">Ano de Edição</th>
              <th scope="col">Páginas Consultadas</th>
              <th scope="col" className="col-acao"></th>
            </tr>
          </thead>
          <Droppable droppableId="livro">
            {(provider) => (
              <tbody ref={provider.innerRef} {...provider.droppableProps}>
                {livros.map((livro, index) => (
                  <Draggable
                    key={livro.livro}
                    draggableId={livro.livro}
                    index={index}>
                    {(provider) => (
                      <tr {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
                        <td>{livro.livro}</td>
                        <td>{livro.autor}</td>
                        <td>{livro.editora}</td>
                        <td>{livro.ano}</td>
                        <td>{livro.paginas}</td>
                        <td>
                          <button onClick={() => editar(livro.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button onClick={() => confirmDeleteUser(livro.id)}>
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
export default ListaLivros
