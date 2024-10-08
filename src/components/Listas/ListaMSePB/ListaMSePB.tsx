import React, { useState, useEffect } from 'react'
import firebase from '../../Config/firebase'
import 'firebase/firestore'
import Swal from 'sweetalert2'

interface Pessoa {
  id: string
  cargo: string
  nome: string
  idade: number
}

const opcoesCargo = [
  '1º Mestre-Sala',
  '1ª Porta-Bandeira',
  '2º Mestre-Sala',
  '2ª Porta-Bandeira',
  '3º Mestre-Sala',
  '3ª Porta-Bandeira'
]

function ListaMSePB() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [busca, setBusca] = useState<string>('')
  const [excluido, setExcluido] = useState<string>('')
  const [cargosUtilizados, setCargosUtilizados] = useState<string[]>([])

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('mestreS_portaB')
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

  const fetchPessoas = async () => {
    const pessoasCollection = await firebase
      .firestore()
      .collection('mestreS_portaB')
      .get()
    const listaPe: Pessoa[] = []
    const utilizados: string[] = []
    pessoasCollection.forEach((doc) => {
      const pessoasData = doc.data()
      if (pessoasData.nome.toLowerCase().includes(busca.toLowerCase())) {
        listaPe.push({
          id: doc.id,
          cargo: pessoasData.cargo,
          nome: pessoasData.nome,
          idade: pessoasData.idade
        })
        utilizados.push(pessoasData.cargo)
      }
    })
    const ordemCargos = [
      '1º Mestre-Sala',
      '1ª Porta-Bandeira',
      '2º Mestre-Sala',
      '2ª Porta-Bandeira',
      '3º Mestre-Sala',
      '3ª Porta-Bandeira'
    ]
    listaPe.sort((a, b) => {
      return ordemCargos.indexOf(a.cargo) - ordemCargos.indexOf(b.cargo)
    })

    setPessoas(listaPe)
    setCargosUtilizados(utilizados)
  }

  useEffect(() => {
    fetchPessoas()
  }, [busca, excluido])

  const adicionarElemento = () => {
    Swal.fire({
      title: 'Mestre-Sala e Porta-Bandeira',
      html: `
      <div style="max-height: 500px; overflow-y: auto; text-align: left">
      <p style=" margin-bottom: 2px"><strong style="margin-left: 200px">Título do Dançarino(a): </strong><span style="color:red">*</span></p>
      <select id="cargo" class="swal2-select" style="margin-top:2px; margin-left: 200px; border: 1px solid darkgray;">
            <option value="selecione">Selecione uma opção</option>
            ${opcoesCargo
              .filter((cargo) => !cargosUtilizados.includes(cargo))
              .map((cargo) => `<option value="${cargo}">${cargo}</option>`)}
          </select>
          <p style="margin-top: 20px"><strong style="margin-left: 210px">Nome: </strong><span style="color:red">*</span></p>
        <input id="nome" class="swal2-input" style="margin-top:2px; margin-left: 200px; width: 375px" placeholder="Digite o nome">
        <p style="margin-top: 20px"><strong style="margin-left: 210px">Idade: </strong><span style="color:red">*</span></p>
        <input id="idade" class="swal2-input"  style="margin-top:2px; margin-left: 200px; width: 375px" placeholder="Digite a idade">
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
        const cargo = (document.getElementById('cargo') as HTMLInputElement)
          .value
        const nomeInput = document.getElementById('nome') as HTMLInputElement
        const idadeInput = document.getElementById('idade') as HTMLInputElement

        const nome = nomeInput.value
        const idade = parseInt(idadeInput.value)

        if (!nome) {
          nomeInput.classList.add('borda')
        } else {
          nomeInput.classList.remove('borda')
        }

        if (!idade) {
          idadeInput.classList.add('borda')
        } else {
          idadeInput.classList.remove('borda')
        }

        if (!cargo || cargo === 'selecione') {
          Swal.showValidationMessage('Por favor, selecione um título.')
          return false
        }
        if (!nome) {
          Swal.showValidationMessage('Por favor, preencha o nome.')
          return false
        }

        if (isNaN(idade)) {
          Swal.showValidationMessage('Por favor, insira uma idade válida.')
          return false
        }
        idadeInput.classList.remove('borda')

        return { nome, cargo, idade }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { nome, cargo, idade } = result.value
        firebase
          .firestore()
          .collection('mestreS_portaB')
          .add({
            nome,
            cargo,
            idade
          })
          .then(() => {
            fetchPessoas()
          })
          .catch((error) => {
            console.error('Erro ao adicionar:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('mestreS_portaB')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const pessoasData = docData as Pessoa
            const opcoesDisponiveis = opcoesCargo.filter(
              (cargo) =>
                !cargosUtilizados.includes(cargo) || cargo === pessoasData.cargo
            )
            Swal.fire({
              title: 'Editar',
              html: `
              <div style="max-height: 500px; overflow-y: auto; text-align: left">
              <p style=" margin-bottom: 2px"><strong style="margin-left: 210px">Título do Dançarino(a): </strong><span style="color:red">*</span></p>
              <select id="cargo" class="swal2-select" style="margin-top:2px; margin-left: 200px; border: 1px solid darkgray;">
              ${opcoesDisponiveis
                .map(
                  (cargo) =>
                    `<option value="${cargo}" ${
                      cargo === pessoasData.cargo ? 'selected' : ''
                    }>${cargo}</option>`
                )
                .join('')}
            </select>
            <div  style="text-align: left">
                <p style="margin-top: 20px"><strong style="margin-left: 210px">Nome: </strong><span style="color:red">*</span></p>
                <input id="nome" type="text" class="swal2-input" style=" margin-top:2px; margin-left: 200px; width: 375px" value="${
                  pessoasData.nome
                }">
            <p style=" margin-top: 20px"><strong style="margin-left: 210px">Idade: </strong><span style="color:red">*</span></p>
            <input id="idade" type="number" class="swal2-input" style=" margin-top:2px; margin-left: 200px; width: 375px" value="${
              pessoasData.idade
            }">
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
                const cargo = (
                  document.getElementById('cargo') as HTMLInputElement
                ).value
                const nomeInput = document.getElementById(
                  'nome'
                ) as HTMLInputElement
                const idadeInput = document.getElementById(
                  'idade'
                ) as HTMLInputElement

                const nome = nomeInput.value
                const idade = parseInt(idadeInput.value)

                if (!nome) {
                  nomeInput.classList.add('borda')
                } else {
                  nomeInput.classList.remove('borda')
                }

                if (!idade) {
                  idadeInput.classList.add('borda')
                } else {
                  idadeInput.classList.remove('borda')
                }

                if (!cargo) {
                  Swal.showValidationMessage(
                    'Por favor, preencha o título do dançarino.'
                  )
                  return false
                }
                if (!nome) {
                  Swal.showValidationMessage('Por favor, preencha o nome.')
                  return false
                }
                if (isNaN(idade)) {
                  Swal.showValidationMessage(
                    'Por favor, insira uma idade válida.'
                  )
                  return false
                }
                idadeInput.classList.remove('borda')

                return { nome, cargo, idade }
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const { nome, cargo, idade } = result.value
                firebase
                  .firestore()
                  .collection('mestreS_portaB')
                  .doc(id)
                  .update({
                    nome,
                    cargo,
                    idade
                  })
                  .then(() => {
                    console.log('Dados atualizados com sucesso!')
                    fetchPessoas()
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

  return (
    <div>
      <h1 className="block mt-4 text-sm font-medium text-black">
        Mestre-Sala e Porta-Bandeira
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
              placeholder="Pesquisar Nome do Dançarino(a)"
              aria-describedby="button-addon2"
            />
          </div>
        </div>
      </div>
      <table className="table table-hover table-bordered mt-3 text-center">
        <thead>
          <tr>
            <th scope="col">Título do Dançarino(a)</th>
            <th scope="col">Nome</th>
            <th scope="col">Idade</th>
            <th scope="col" className="col-acao"></th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <tr key={pessoa.id}>
              <td>{pessoa.cargo}</td>
              <td>{pessoa.nome}</td>
              <td>{pessoa.idade}</td>
              <td>
                <button onClick={() => editar(pessoa.id)}>
                  <i className="fas fa-edit icone-acao"></i>
                </button>
                <button onClick={() => confirmDeleteUser(pessoa.id)}>
                  <i className="red far fa-trash-alt icone-acao"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaMSePB
