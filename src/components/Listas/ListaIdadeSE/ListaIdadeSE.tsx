import React, { useState, useEffect } from 'react'
import firebase from '../../Config/firebase'
import './ListaIdadeSE.css'
import 'firebase/firestore'
import Swal from 'sweetalert2'

interface Idades {
  id: string // Alterado para incluir o ID do livro
  nomeIdoso: string
  nomeJovem: string
  idadeIdoso: number
  idadeJovem: number
}

function ListaIdadeSE() {
  const [idades, setIdades] = useState<Idades[]>([])
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('compositor_idade')
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

  const fetchIdades = async () => {
    const idadesCollection = await firebase
      .firestore()
      .collection('compositor_idade')
      .get()
    const listaId: Idades[] = []
    idadesCollection.forEach((doc) => {
      const idadeData = doc.data()
      listaId.push({
        id: doc.id,
        nomeIdoso: idadeData.nomeIdoso,
        nomeJovem: idadeData.nomeJovem,
        idadeIdoso: idadeData.idadeIdoso,
        idadeJovem: idadeData.idadeJovem
      })
    })
    setIdades(listaId)
  }

  useEffect(() => {
    fetchIdades()
  }, [excluido])

  const adicionarCompositores = () => {
    if (idades.length > 0) {
      Swal.fire({
        title: 'Aviso',
        text: 'Já existe um registro de compositores. Não é possível adicionar mais.',
        icon: 'error',
        confirmButtonColor: '#000000',
        confirmButtonText: 'OK'
      })
      return
    }
    Swal.fire({
      title: 'Adicionar Compositor',
      html: `
      <div style="max-height: 500px; overflow-y: auto; text-align: left">
        <p style=" margin-bottom: -20px"><strong style="margin-left: 225px">Nome do Compositor Mais Velho: </strong><span style="color:red">*</span></p>
        <input id="nomeIdoso" class="swal2-input" style="margin-left: 235px" placeholder="Nome do Idoso">
        <p style=" margin-top: 25px"><strong style="margin-left: 225px">Idade do Compositor Mais Velho: </strong><span style="color:red">*</span></p>
        <input id="idadeIdoso" style=" margin-top:2px; margin-left: 235px" type="number" class="swal2-input" placeholder="Idade do Idoso">
        <p style=" margin-top: 25px"><strong style="margin-left: 225px">Nome do Compositor Mais Novo: </strong><span style="color:red">*</span></p>
        <input id="nomeJovem" style=" margin-top:2px; margin-left: 235px" class="swal2-input" placeholder="Nome do Jovem">
        <p style=" margin-top: 25px"><strong style="margin-left: 225px">Idade do Compositor Mais Novo: </strong><span style="color:red">*</span></p>
        <input id="idadeJovem" style=" margin-top:2px; margin-left: 235px" type="number" class="swal2-input" placeholder="Idade do Jovem">
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
        const nomeIdosoInput = document.getElementById(
          'nomeIdoso'
        ) as HTMLInputElement
        const idadeIdosoInput = document.getElementById(
          'idadeIdoso'
        ) as HTMLInputElement
        const nomeJovemInput = document.getElementById(
          'nomeJovem'
        ) as HTMLInputElement
        const idadeJovemInput = document.getElementById(
          'idadeJovem'
        ) as HTMLInputElement

        const nomeIdoso = nomeIdosoInput.value
        const idadeIdoso = parseInt(idadeIdosoInput.value)
        const nomeJovem = nomeJovemInput.value
        const idadeJovem = parseInt(idadeJovemInput.value)

        if (!nomeIdoso || !idadeIdoso || !nomeJovem || !idadeJovem) {
          if (!nomeIdoso) {
            nomeIdosoInput.classList.add('borda')
          } else {
            nomeIdosoInput.classList.remove('borda')
          }

          if (!idadeIdoso) {
            idadeIdosoInput.classList.add('borda')
          } else {
            idadeIdosoInput.classList.remove('borda')
          }

          if (!nomeJovem) {
            nomeJovemInput.classList.add('borda')
          } else {
            nomeJovemInput.classList.remove('borda')
          }

          if (!idadeJovem) {
            idadeJovemInput.classList.add('borda')
          } else {
            idadeJovemInput.classList.remove('borda')
          }

          Swal.showValidationMessage('Por favor, preencha todos os campos.')
          return false
        }
        if (isNaN(idadeIdoso) || isNaN(idadeJovem)) {
          Swal.showValidationMessage('Por favor, insira uma idade válida.')
          return false
        }

        if (idadeIdoso < idadeJovem) {
          Swal.showValidationMessage(
            'A idade do idoso precisa ser maior do que a do jovem.'
          )
          return false
        }
        if (idadeJovem < 18) {
          Swal.showValidationMessage(
            'A idade do jovem precisa ser maior ou igual a 18 anos.'
          )
          return false
        }

        return { nomeIdoso, idadeIdoso, nomeJovem, idadeJovem }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { nomeIdoso, idadeIdoso, nomeJovem, idadeJovem } = result.value
        firebase
          .firestore()
          .collection('compositor_idade')
          .add({
            nomeIdoso,
            idadeIdoso,
            nomeJovem,
            idadeJovem
          })
          .then(() => {
            fetchIdades()
          })
          .catch((error) => {
            console.error('Erro ao adicionar compositor:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editarIdoso(id: string) {
    firebase
      .firestore()
      .collection('compositor_idade')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const idadeData = docData as Idades
            Swal.fire({
              title: 'Editar Compositor Mais Idoso',
              html: `
              <div  style="text-align: left">
                <p style=" margin-bottom: -20px"><strong style="margin-left: 100px">Nome: </strong><span style="color:red">*</span></p>
                <input id="nomeIdoso" type="text" style="margin-left: 100px" class="swal2-input" value="${idadeData.nomeIdoso}">
                <p style=" margin-top: 20px"><strong style="margin-left: 100px">Idade: </strong><span style="color:red">*</span></p>
                <input id="idadeIdoso" type="number" class="swal2-input" style=" margin-top:2px; margin-left: 100px" value="${idadeData.idadeIdoso}">
                </div>
              `,
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#000000',
              confirmButtonText: 'Salvar',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              reverseButtons: true,
              preConfirm: () => {
                const nomeIdosoInput = document.getElementById(
                  'nomeIdoso'
                ) as HTMLInputElement
                const idadeIdosoInput = document.getElementById(
                  'idadeIdoso'
                ) as HTMLInputElement

                const nomeIdoso = nomeIdosoInput.value
                const idadeIdoso = parseInt(idadeIdosoInput.value)
                if (!nomeIdoso || !idadeIdoso) {
                  if (!nomeIdoso) {
                    nomeIdosoInput.classList.add('borda')
                  } else {
                    nomeIdosoInput.classList.remove('borda')
                  }

                  if (!idadeIdoso) {
                    idadeIdosoInput.classList.add('borda')
                  } else {
                    idadeIdosoInput.classList.remove('borda')
                  }
                  Swal.showValidationMessage(
                    'Por favor, preencha todos os campos.'
                  )
                  return false
                }
                if (isNaN(idadeIdoso)) {
                  Swal.showValidationMessage(
                    'Por favor, insira uma idade válida.'
                  )
                  return false
                }
                return { nomeIdoso, idadeIdoso }
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const { nomeIdoso, idadeIdoso } = result.value
                firebase
                  .firestore()
                  .collection('compositor_idade')
                  .doc(id)
                  .update({
                    nomeIdoso,
                    idadeIdoso
                  })
                  .then(() => {
                    console.log('Dados do compositor atualizados com sucesso!')
                    fetchIdades()
                  })
                  .catch((error) => {
                    console.error(
                      'Erro ao atualizar os dados do compositor:',
                      error
                    )
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
        console.error('Erro ao buscar detalhes do autor:', error)
        Swal.fire({
          title: 'Erro',
          text: 'Ocorreu um erro ao buscar os detalhes do autor. Por favor, tente novamente mais tarde.',
          icon: 'error'
        })
      })
  }

  function editarJovem(id: string) {
    firebase
      .firestore()
      .collection('compositor_idade')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const idadeData = docData as Idades
            Swal.fire({
              title: 'Editar Compositor Mais Jovem',
              html: `
              <div  style="text-align: left">
                <p style=" margin-bottom: -20px"><strong style="margin-left: 100px">Nome: </strong><span style="color:red">*</span></p>
                <input id="nomeJovem" type="text" style="margin-left: 100px" class="swal2-input" value="${idadeData.nomeJovem}">
                <p style=" margin-top: 20px"><strong style="margin-left: 100px">Idade: </strong><span style="color:red">*</span></p>
                <input id="idadeJovem" type="number" class="swal2-input" style=" margin-top:2px; margin-left: 100px" value="${idadeData.idadeJovem}">
                </div>
              `,
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#000000',
              confirmButtonText: 'Salvar',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              reverseButtons: true,
              preConfirm: () => {
                const nomeJovemInput = document.getElementById(
                  'nomeJovem'
                ) as HTMLInputElement
                const idadeJovemInput = document.getElementById(
                  'idadeJovem'
                ) as HTMLInputElement

                const nomeJovem = nomeJovemInput.value
                const idadeJovem = parseInt(idadeJovemInput.value)
                if (!nomeJovem || !idadeJovem) {
                  if (!nomeJovem) {
                    nomeJovemInput.classList.add('borda')
                  } else {
                    nomeJovemInput.classList.remove('borda')
                  }

                  if (!idadeJovem) {
                    idadeJovemInput.classList.add('borda')
                  } else {
                    idadeJovemInput.classList.remove('borda')
                  }
                  Swal.showValidationMessage(
                    'Por favor, preencha todos os campos.'
                  )
                  return false
                }
                if (isNaN(idadeJovem)) {
                  Swal.showValidationMessage(
                    'Por favor, insira uma idade válida.'
                  )
                  return false
                }
                if (idadeJovem < 18) {
                  Swal.showValidationMessage(
                    'A idade do jovem precisa ser maior ou igual a 18 anos.'
                  )
                  return false
                }
                return { nomeJovem, idadeJovem }
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const { nomeJovem, idadeJovem } = result.value
                firebase
                  .firestore()
                  .collection('compositor_idade')
                  .doc(id)
                  .update({
                    nomeJovem,
                    idadeJovem
                  })
                  .then(() => {
                    console.log('Dados do compositor atualizados com sucesso!')
                    fetchIdades()
                  })
                  .catch((error) => {
                    console.error(
                      'Erro ao atualizar os dados do compositor:',
                      error
                    )
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
        console.error('Erro ao buscar detalhes do autor:', error)
        Swal.fire({
          title: 'Erro',
          text: 'Ocorreu um erro ao buscar os detalhes do autor. Por favor, tente novamente mais tarde.',
          icon: 'error'
        })
      })
  }

  return (
    <div>
      <h1 className="block mt-2 mb-2 text-sm font-medium text-black">
        Ala dos Compositores
      </h1>
      <button
        onClick={adicionarCompositores}
        className="black btn btn-dark"
        id="basic-addon1"
        type="button">
        <i className="fas fa-plus"></i>
      </button>
      {idades.map((idade) => (
        <React.Fragment key={idade.id}>
          <button
            onClick={() => confirmDeleteUser(idade.id)}
            className="fundo ml-2 btn btn-danger"
            id="basic-addon1"
            type="button">
            <i className="far fa-trash-alt"></i>
          </button>
        </React.Fragment>
      ))}
      <table className="table table-hover table-bordered mt-3 text-center">
        <thead>
          <tr>
            <th scope="col" style={{ width: '24%' }}>
              Compositores
            </th>
            <th scope="col">Nome</th>
            <th scope="col">Idade</th>
            <th scope="col" className="col-acao"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="col">Compositor Mais Idoso</th>
            {idades.map((idade) => (
              <React.Fragment key={idade.id}>
                <td>{idade.nomeIdoso}</td>
                <td>{idade.idadeIdoso}</td>
                <td>
                  <button onClick={() => editarIdoso(idade.id)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </React.Fragment>
            ))}
          </tr>
          <tr>
            <th scope="col">Compositor Mais Jovem</th>
            {idades.map((idade) => (
              <React.Fragment key={idade.id}>
                <td>{idade.nomeJovem}</td>
                <td>{idade.idadeJovem}</td>
                <td>
                  <button onClick={() => editarJovem(idade.id)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </React.Fragment>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ListaIdadeSE
