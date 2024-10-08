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

interface Acompanhante {
  id: string
  nome: string
  cargo: string
  ordem: number
}

function ListaInstrumentistas() {
  const [acompanhantes, setAcompanhantes] = useState<Acompanhante[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('instrumentistas')
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

  const fetchAcompanhantes = async () => {
    const acompanhantesCollection = await firebase
      .firestore()
      .collection('instrumentistas')
      .orderBy('ordem')
      .get()
    const listaAc: Acompanhante[] = []
    acompanhantesCollection.forEach((doc) => {
      const acompanhanteData = doc.data()
      if (acompanhanteData.nome.toLowerCase().includes(busca.toLowerCase())) {
        listaAc.push({
          id: doc.id,
          nome: acompanhanteData.nome,
          cargo: acompanhanteData.cargo,
          ordem: acompanhanteData.ordem
        })
      }
    })
    setAcompanhantes(listaAc)
  }

  useEffect(() => {
    fetchAcompanhantes()
  }, [busca, excluido])

  const adicionarElemento = () => {
    const showInput = (event: Event) => {
      const select = event.target as HTMLSelectElement
      const outrosInput = document.getElementById('outrosInput')
      if (select.value === 'Outros' && outrosInput) {
        outrosInput.style.display = 'block'
      } else if (outrosInput) {
        outrosInput.style.display = 'none'
      }
    }

    Swal.fire({
      title: 'Instrumentistas Acompanhantes do Samba-Enredo',
      html: `
      <div style="text-align: left">
      <p style=" margin-bottom: -20px" ><strong style="margin-left: 210px">Nome: </strong><span style="color:red">*</span></p>
      <input id="nome" class="swal2-input" style="width: 370px !important; margin-left: 200px" placeholder="Digite o nome">
      <p style="margin-top: 20px"><strong style="margin-left: 210px">Cargo: </strong><span style="color:red">*</span></p>
      <select id="cargo" class="swal2-select" style="margin-top:2px; margin-left: 200px; border: 1px solid darkgray;">
            <option value="selecione">Selecione uma opção</option>
            <option value="Bandolim">Bandolim</option>
            <option value="Cantor">Cantor</option>
            <option value="Cavaco Solo">Cavaco Solo</option>
            <option value="Cavaquinho">Cavaquinho</option>
            <option value="Diretor Musical">Diretor Musical</option>
            <option value="Músico">Músico</option>
            <option value="Primeiro Cavaquinista">Primeiro Cavaquinista</option>
            <option value="Violão 6 Cordas">Violão 6 Cordas</option>
            <option value="Violão 7 Cordas">Violão 7 Cordas</option>
            <option value="Outros">Outros</option>
          </select>
        
        <div id="outrosInput" style="display: none;">
          <p style="margin-top: 20px"><strong style="margin-left: 210px">Outro: </strong><span style="color:red">*</span></p>
          <input id="outroCargo" class="swal2-input" style="margin-top:2px; margin-left: 200px; width: 375px" placeholder="Digite o outro cargo">
        </div>
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
        const cargoInput = document.getElementById('cargo') as HTMLSelectElement
        const nome = nomeInput.value
        const cargo = cargoInput.value

        let ordem
        if (!nome) {
          nomeInput.classList.add('borda')
          Swal.showValidationMessage('Por favor, preencha o nome.')
          return false
        }
        nomeInput.classList.remove('borda')

        if (!cargo || cargo === 'selecione') {
          Swal.showValidationMessage('Por favor, selecione um cargo.')
          return false
        }
        if (cargo === 'Outros') {
          const outroCargoInput = document.getElementById(
            'outroCargo'
          ) as HTMLInputElement
          const outroCargo = outroCargoInput.value
          if (!outroCargo) {
            outroCargoInput.classList.add('borda')
            Swal.showValidationMessage('Por favor, preencha o indicado.')
            return false
          } else {
            outroCargoInput.classList.remove('borda')
          }
          ordem = acompanhantes.length + 1
          return { nome, cargo: outroCargo, ordem }
        }
        ordem = acompanhantes.length + 1
        return { nome, cargo, ordem }
      },
      allowOutsideClick: () => !Swal.isLoading(),
      didOpen: () => {
        const select = document.getElementById('cargo') as HTMLSelectElement
        select.addEventListener('change', showInput)
      },
      willClose: () => {
        const select = document.getElementById('cargo') as HTMLSelectElement
        select.removeEventListener('change', showInput)
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { nome, cargo, ordem } = result.value
        firebase
          .firestore()
          .collection('instrumentistas')
          .add({
            nome,
            cargo,
            ordem
          })
          .then(() => {
            fetchAcompanhantes()
          })
          .catch((error) => {
            console.error('Erro ao adicionar intérprete:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editar(id: string) {
    const showInput = (event: Event) => {
      const select = event.target as HTMLSelectElement
      const outrosInput = document.getElementById('outrosInput')
      if (select.value === 'Outros' && outrosInput) {
        outrosInput.style.display = 'block'
      } else if (outrosInput) {
        outrosInput.style.display = 'none'
      }
    }
    firebase
      .firestore()
      .collection('instrumentistas')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const acompanhantesData = docData as Acompanhante
            Swal.fire({
              title: 'Editar Instrumentistas Acompanhantes',
              html: `
              <div style="text-align: left">
              
              <p style=" margin-bottom: -3px" ><strong style="margin-left: 210px">Nome: </strong><span style="color:red">*</span></p>
              <input id="nome" type="text" class="swal2-input" style="width: 370px !important; margin-top:2px; margin-left: 200px" value="${
                acompanhantesData.nome
              }">
              <p style="margin-top: 20px"><strong style="margin-left: 210px">Cargo: </strong><span style="color:red">*</span></p>
              <select id="cargo" class="swal2-select" style="margin-top:2px; margin-left: 200px; border: 1px solid black;">
              <option value="Bandolim" ${
                acompanhantesData.cargo === 'Bandolim' ? 'selected' : ''
              }>Bandolim</option>
              <option value="Cantor" ${
                acompanhantesData.cargo === 'Cantor' ? 'selected' : ''
              }>Cantor</option>
              <option value="Cavaco Solo" ${
                acompanhantesData.cargo === 'Cavaco Solo' ? 'selected' : ''
              }>Cavaco Solo</option>
              <option value="Cavaquinho" ${
                acompanhantesData.cargo === 'Cavaquinho' ? 'selected' : ''
              }>Cavaquinho</option>
              <option value="Diretor Musical" ${
                acompanhantesData.cargo === 'Diretor Musical' ? 'selected' : ''
              }>Diretor Musical</option>
              <option value="Músico" ${
                acompanhantesData.cargo === 'Músico' ? 'selected' : ''
              }>Músico</option>
              <option value="Primeiro Cavaquinista" ${
                acompanhantesData.cargo === 'Primeiro Cavaquinista'
                  ? 'selected'
                  : ''
              }>Primeiro Cavaquinista</option>
              <option value="Violão 6 Cordas" ${
                acompanhantesData.cargo === 'Violão 6 Cordas' ? 'selected' : ''
              }>Violão 6 Cordas</option>
              <option value="Violão 7 Cordas" ${
                acompanhantesData.cargo === 'Violão 7 Cordas' ? 'selected' : ''
              }>Violão 7 Cordas</option>
              <option value="Outros" ${
                ![
                  'Bandolim',
                  'Cantor',
                  'Cavaco Solo',
                  'Cavaquinho',
                  'Diretor Musical',
                  'Músico',
                  'Primeiro Cavaquinista',
                  'Violão 6 Cordas',
                  'Violão 7 Cordas'
                ].includes(acompanhantesData.cargo)
                  ? 'selected'
                  : ''
              }>Outros</option>
            </select>
            <div id="outrosInput" style="${
              acompanhantesData.cargo !== 'Bandolim' &&
              acompanhantesData.cargo !== 'Cantor' &&
              acompanhantesData.cargo !== 'Cavaco Solo' &&
              acompanhantesData.cargo !== 'Cavaquinho' &&
              acompanhantesData.cargo !== 'Diretor Musical' &&
              acompanhantesData.cargo !== 'Músico' &&
              acompanhantesData.cargo !== 'Primeiro Cavaquinista' &&
              acompanhantesData.cargo !== 'Violão 6 Cordas' &&
              acompanhantesData.cargo !== 'Violão 7 Cordas'
                ? 'display: block;'
                : 'display: none;'
            }">
              <p style="margin-top: 20px"><strong style="margin-left: 210px">Outro: </strong><span style="color:red">*</span></p>
              <input id="outroCargo" class="swal2-input" style="width: 370px; margin-top:2px; margin-left: 200px" value="${
                acompanhantesData.cargo
              }">
            </div>
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
                const cargoInput = document.getElementById(
                  'cargo'
                ) as HTMLSelectElement
                const nome = nomeInput.value
                const cargo = cargoInput.value

                if (!nome) {
                  nomeInput.classList.add('borda')
                  Swal.showValidationMessage('Por favor, preencha o nome.')
                  return false
                }
                nomeInput.classList.remove('borda')

                if (!cargo) {
                  Swal.showValidationMessage('Por favor, preencha o cargo.')
                  return false
                }
                if (cargo === 'Outros') {
                  const outroCargoInput = document.getElementById(
                    'outroCargo'
                  ) as HTMLInputElement
                  const outroCargo = outroCargoInput.value
                  if (!outroCargo) {
                    outroCargoInput.classList.add('borda')
                    Swal.showValidationMessage(
                      'Por favor, preencha o indicado.'
                    )
                    return false
                  } else {
                    outroCargoInput.classList.remove('borda')
                  }
                  return { nome, cargo: outroCargo }
                }
                return { nome, cargo }
              },
              allowOutsideClick: () => !Swal.isLoading(),
              didOpen: () => {
                const select = document.getElementById(
                  'cargo'
                ) as HTMLSelectElement
                select.addEventListener('change', showInput)
              },
              willClose: () => {
                const select = document.getElementById(
                  'cargo'
                ) as HTMLSelectElement
                select.removeEventListener('change', showInput)
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const { nome, cargo } = result.value
                firebase
                  .firestore()
                  .collection('instrumentistas')
                  .doc(id)
                  .update({
                    nome,
                    cargo
                  })
                  .then(() => {
                    console.log('Dados atualizados com sucesso!')
                    fetchAcompanhantes()
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
    let tempData = Array.from(acompanhantes)
    let [source_data] = tempData.splice(e.source.index, 1)
    tempData.splice(e.destination.index, 0, source_data)
    const updatedAcompanhantes = tempData.map((acompanhante, index) => ({
      ...acompanhante,
      ordem: index + 1
    }))

    setAcompanhantes(updatedAcompanhantes)

    const batch = firebase.firestore().batch()
    updatedAcompanhantes.forEach((acompanhante) => {
      const docRef = firebase
        .firestore()
        .collection('instrumentistas')
        .doc(acompanhante.id)
      batch.update(docRef, { ordem: acompanhante.ordem })
    })
    await batch.commit()
  }

  return (
    <div>
      <h1 className="block mt-4 text-sm font-medium text-black">
        Instrumentistas Acompanhantes do Samba-Enredo
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
              placeholder="Pesquisar Nome do Instrumentista"
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
              <th scope="col">Cargo</th>
              <th scope="col" className="col-acao"></th>
            </tr>
          </thead>
          <Droppable droppableId="nome">
            {(provider) => (
              <tbody ref={provider.innerRef} {...provider.droppableProps}>
                {acompanhantes.map((acompanhante, index) => (
                  <Draggable
                    key={acompanhante.nome}
                    draggableId={acompanhante.nome}
                    index={index}>
                    {(provider) => (
                      <tr {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
                        <td>{acompanhante.nome}</td>
                        <td>{acompanhante.cargo}</td>
                        <td>
                          <button onClick={() => editar(acompanhante.id)}>
                            <i className="fas fa-edit icone-acao"></i>
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(acompanhante.id)}>
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

export default ListaInstrumentistas
