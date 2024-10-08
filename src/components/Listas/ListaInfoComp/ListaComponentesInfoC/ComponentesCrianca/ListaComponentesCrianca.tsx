import React, { useState, useEffect } from 'react'
import firebase from '../../../../Config/firebase'
import 'firebase/firestore'
import Swal from 'sweetalert2'

interface Componentes {
  id: string
  total: number
  feminino: number
  masculino: number
}

function ListaComponentesCrianca() {
  const [componentes, setComponentes] = useState<Componentes[]>([])
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('componentes_comfrente')
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

  const fetchComponentes = async () => {
    const componentesCollection = await firebase
      .firestore()
      .collection('componentes_comfrente')
      .get()
    const listaCo: Componentes[] = []
    componentesCollection.forEach((doc) => {
      const compData = doc.data()
      listaCo.push({
        id: doc.id,
        total: compData.total,
        feminino: compData.feminino,
        masculino: compData.masculino
      })
    })
    setComponentes(listaCo)
  }

  useEffect(() => {
    fetchComponentes()
  }, [excluido])

  const adicionarComponentes = () => {
    if (componentes.length > 0) {
      Swal.fire({
        title: 'Aviso',
        text: 'Já existe um registro de componentes. Não é possível adicionar mais.',
        icon: 'error',
        confirmButtonColor: '#000000',
        confirmButtonText: 'OK'
      })
      return
    }
    Swal.fire({
      title: 'Adicionar Componente da Ala das Crianças',
      html: `
      <div style="max-height: 500px; overflow-y: auto;">
        <p style=" margin-bottom: -20px"><strong>Total de Componentes: </strong><span style="color:red">*</span></p>
        <input id="total" type="number" class="swal2-input" placeholder="Número total">
        <p style=" margin-top: 25px"><strong>Componentes Femininos: </strong><span style="color:red">*</span></p>
        <input id="feminino" style=" margin-top:2px;" type="number" class="swal2-input" placeholder="Número de Componentes Femininos">
        <p style=" margin-top: 25px"><strong>Componentes Masculinos: </strong><span style="color:red">*</span></p>
        <input id="masculino" style=" margin-top:2px;" type="number" class="swal2-input" placeholder="Número de Componentes Masculinos">
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
        const totalInput = document.getElementById('total') as HTMLInputElement
        const femininoInput = document.getElementById(
          'feminino'
        ) as HTMLInputElement
        const masculinoInput = document.getElementById(
          'masculino'
        ) as HTMLInputElement
        const total = parseInt(totalInput.value)
        const feminino = parseInt(femininoInput.value)
        const masculino = parseInt(masculinoInput.value)
        if (!total || !feminino || !masculino) {
          if (!total) {
            totalInput.classList.add('borda')
          } else {
            totalInput.classList.remove('borda')
          }
          if (!feminino) {
            femininoInput.classList.add('borda')
          } else {
            femininoInput.classList.remove('borda')
          }
          if (!masculino) {
            masculinoInput.classList.add('borda')
          } else {
            masculinoInput.classList.remove('borda')
          }
          Swal.showValidationMessage('Por favor, preencha todos os campos.')
          return false
        }
        if (isNaN(total) || isNaN(feminino) || isNaN(masculino)) {
          Swal.showValidationMessage('Por favor, insira um valor válido.')
          return false
        }
        if (total !== feminino + masculino) {
          Swal.showValidationMessage(
            'A soma dos componentes femininos e masculinos deve ser igual ao total de componentes.'
          )
          return false
        }
        return { total, feminino, masculino }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { total, feminino, masculino } = result.value
        firebase
          .firestore()
          .collection('componentes_comfrente')
          .add({
            total,
            feminino,
            masculino
          })
          .then(() => {
            fetchComponentes()
          })
          .catch((error) => {
            console.error('Erro ao adicionar componente:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('componentes_comfrente')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const componenteData = docData as Componentes
            Swal.fire({
              title: 'Editar Componentes',
              html: `
              <p style=" margin-bottom: -20px"><strong>Total de Componentes da Ala das Crianças: </strong><span style="color:red">*</span></p>
              <input id="total" type="number" class="swal2-input" value="${componenteData.total}">
              <p style=" margin-top: 25px; text-align: left"><strong style="margin-left: 90px">Componentes Femininos: </strong><span style="color:red">*</span></p>
              <input id="feminino" style=" margin-top:2px;" type="number" class="swal2-input" value="${componenteData.feminino}">
              <p style=" margin-top: 25px; text-align: left"><strong style="margin-left: 100px">Componentes Masculinos: </strong><span style="color:red">*</span></p>
              <input id="masculino" style=" margin-top:2px;" type="number" class="swal2-input" value="${componenteData.masculino}">
              `,
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#000000',
              confirmButtonText: 'Salvar',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              reverseButtons: true,
              preConfirm: () => {
                const totalInput = document.getElementById(
                  'total'
                ) as HTMLInputElement
                const femininoInput = document.getElementById(
                  'feminino'
                ) as HTMLInputElement
                const masculinoInput = document.getElementById(
                  'masculino'
                ) as HTMLInputElement
                const total = parseInt(totalInput.value)
                const feminino = parseInt(femininoInput.value)
                const masculino = parseInt(masculinoInput.value)
                if (!total || !feminino || !masculino) {
                  if (!total) {
                    totalInput.classList.add('borda')
                  } else {
                    totalInput.classList.remove('borda')
                  }
                  if (!feminino) {
                    femininoInput.classList.add('borda')
                  } else {
                    femininoInput.classList.remove('borda')
                  }
                  if (!masculino) {
                    masculinoInput.classList.add('borda')
                  } else {
                    masculinoInput.classList.remove('borda')
                  }
                  Swal.showValidationMessage(
                    'Por favor, preencha todos os campos.'
                  )
                  return false
                }
                if (total !== feminino + masculino) {
                  Swal.showValidationMessage(
                    'A soma dos componentes femininos e masculinos deve ser igual ao total de componentes.'
                  )
                  return false
                }
                return { total, feminino, masculino }
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const { total, feminino, masculino } = result.value
                firebase
                  .firestore()
                  .collection('componentes_comfrente')
                  .doc(id)
                  .update({
                    total,
                    feminino,
                    masculino
                  })
                  .then(() => {
                    console.log('Dados do compositor atualizados com sucesso!')
                    fetchComponentes()
                  })
                  .catch((error) => {
                    console.error('Erro ao atualizar os dados:', error)
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

  return (
    <div>
      <h1 className="block mt-2 mb-2 text-sm font-medium text-black">
        Componentes da Ala das Crianças
      </h1>
      <button
        onClick={adicionarComponentes}
        className="black btn btn-dark"
        id="basic-addon1"
        type="button">
        <i className="fas fa-plus"></i>
      </button>
      {componentes.map((componente) => (
        <React.Fragment key={componente.id}>
          <button
            onClick={() => confirmDeleteUser(componente.id)}
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
            <th scope="col">Total de Componentes da Ala das Crianças</th>
            <th scope="col">Componentes Femininos</th>
            <th scope="col">Componentes Masculinos</th>
            <th scope="col" className="col-acao"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {componentes.map((componente) => (
              <React.Fragment key={componente.id}>
                <td>{componente.total}</td>
                <td>{componente.feminino}</td>
                <td>{componente.masculino}</td>
                <td>
                  <button onClick={() => editar(componente.id)}>
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

export default ListaComponentesCrianca
