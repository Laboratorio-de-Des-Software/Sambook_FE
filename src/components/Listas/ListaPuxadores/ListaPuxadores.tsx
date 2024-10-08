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
interface Puxador {
  id: string
  nome: string
  categoria: string
  ordem: number
}

function ListaPuxadores() {
  const [puxadores, setPuxadores] = useState<Puxador[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('puxadores')
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

  const fecthPuxadores = async () => {
    const puxadoresCollection = await firebase
      .firestore()
      .collection('puxadores')
      .orderBy('ordem')
      .get()
    const listaPu: Puxador[] = []
    puxadoresCollection.forEach((doc) => {
      const puxadorData = doc.data()
      if (puxadorData.nome.toLowerCase().includes(busca.toLowerCase())) {
        listaPu.push({
          id: doc.id, // Adicionando o ID do livro
          nome: puxadorData.nome,
          categoria: puxadorData.categoria,
          ordem: puxadorData.ordem
        })
      }
    })
    setPuxadores(listaPu)
  }

  useEffect(() => {
    fecthPuxadores()
  }, [busca, excluido])

  const adicionarElemento = () => {
    Swal.fire({
      title: 'Adicionar Puxador de Samba-Enredo',
      html: `
      <div style="text-align: left">
        <p style=" margin-bottom: -20px" ><strong style="margin-left: 210px">Nome: </strong><span style="color:red">*</span></p>
        <input id="nome" class="swal2-input" style="width: 370px !important; margin-left: 200px" placeholder="Digite o nome">
        <p style="margin-top: 20px"><strong style="margin-left: 210px">Categoria: </strong><span style="color:red">*</span></p>
         <select id="categoria" class="swal2-select" style="margin-top:2px; margin-left: 200px; border: 1px solid darkgray;">
         <option value="selecione">Selecione uma opção</option>
         <option value="Interprete Oficial">Intérprete Oficial</option>
         <option value="Interprete Auxiliar">Intérprete Auxiliar</option>
       </select>
    
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
        const categoriaInput = document.getElementById(
          'categoria'
        ) as HTMLInputElement
        const nome = nomeInput.value
        const categoria = categoriaInput.value

        if (!nome) {
          nomeInput.classList.add('borda')
          Swal.showValidationMessage('Por favor, preencha o nome.')
          return false
        }
        nomeInput.classList.remove('borda')

        if (!categoria || categoria === 'selecione') {
          categoriaInput.classList.add('borda')
          Swal.showValidationMessage('Por favor, selecione uma categoria.')
          return false
        }
        categoriaInput.classList.remove('borda')
        const ordem = puxadores.length + 1
        return { nome, categoria, ordem }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { nome, categoria, ordem } = result.value
        firebase
          .firestore()
          .collection('puxadores')
          .add({
            nome,
            categoria,
            ordem
          })
          .then(() => {
            fecthPuxadores()
          })
          .catch((error) => {
            console.error('Erro ao adicionar intérprete:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('puxadores')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const puxadoresData = docData as Puxador
            Swal.fire({
              title: 'Editar Puxador de Samba-Enredo',
              html: `
              <div style="text-align: left">
              <p style=" margin-bottom: -20px" ><strong style="margin-left: 210px">Nome: </strong><span style="color:red">*</span></p>
              <input id="nome" class="swal2-input" style="width: 370px !important; margin-left: 200px" value="${
                puxadoresData.nome
              }"required>
              <p style=" margin-top: 20px"><strong style="margin-left: 210px">Categoria: </strong><span style="color:red">*</span></p>
              <select id="categoria" class="swal2-select" style="margin-top:2px; margin-left: 200px; border: 1px solid darkgray;">
              <option value="Interprete Oficial" ${
                puxadoresData.categoria === 'Interprete Oficial'
                  ? 'selected'
                  : ''
              }>Intérprete Oficial</option>
              <option value="Interprete Auxiliar" ${
                puxadoresData.categoria === 'Interprete Auxiliar'
                  ? 'selected'
                  : ''
              }>Intérprete Auxiliar</option>
            </select>
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
                const categoriaInput = document.getElementById(
                  'categoria'
                ) as HTMLInputElement
                const categoria = categoriaInput.value
                const nome = nomeInput.value

                if (!nome) {
                  nomeInput.classList.add('borda')
                  Swal.showValidationMessage('Por favor, preencha o nome.')
                  return false
                }
                nomeInput.classList.remove('borda')

                if (!categoria) {
                  categoriaInput.classList.add('borda')
                  Swal.showValidationMessage('Por favor, preencha a categoria.')
                  return false
                } else {
                  categoriaInput.classList.remove('borda')
                }
                return { nome, categoria }
              },
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                const { nome, categoria } = result.value
                firebase
                  .firestore()
                  .collection('puxadores')
                  .doc(id)
                  .update({
                    nome,
                    categoria
                  })
                  .then(() => {
                    console.log('Dados atualizados com sucesso!')
                    fecthPuxadores()
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
    let tempData = Array.from(puxadores)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedPuxadores = tempData.map((puxador, index) => ({
      ...puxador,
      ordem: index + 1
    }))

    setPuxadores(updatedPuxadores)

    const batch = firebase.firestore().batch()
    updatedPuxadores.forEach((puxador) => {
      const docRef = firebase
        .firestore()
        .collection('puxadores')
        .doc(puxador.id)
      batch.update(docRef, { ordem: puxador.ordem })
    })
    await batch.commit()
  }

  return (
    <div>
      <h1 className="block mt-4 text-sm font-medium text-black">
        Puxador(es) do Samba-Enredo
      </h1>
      <div className="row">
        <div className="col-4">
          <button
            onClick={adicionarElemento}
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
              placeholder="Pesquisar Nome do Intérprete"
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
              <th scope="col">Categoria</th>
              <th scope="col" className="col-acao"></th>
            </tr>
          </thead>
          <Droppable droppableId="nome">
            {(provider) => (
              <tbody ref={provider.innerRef} {...provider.droppableProps}>
                {puxadores.map((puxador, index) => (
                  <Draggable
                    key={puxador.nome}
                    draggableId={puxador.nome}
                    index={index}>
                    {(provider) => (
                      <tr {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
                        <td>{puxador.nome}</td>
                        <td>{puxador.categoria}</td>
                        <td>
                          <button onClick={() => editar(puxador.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button onClick={() => confirmDeleteUser(puxador.id)}>
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

export default ListaPuxadores
