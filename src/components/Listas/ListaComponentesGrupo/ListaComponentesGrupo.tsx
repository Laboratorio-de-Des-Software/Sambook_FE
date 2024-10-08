import React, { useState, useEffect } from 'react'
import firebase from '../../Config/firebase'
import 'firebase/firestore'
import Swal from 'sweetalert2'
import './ListaComponentesGrupo.css'

interface Instrumentos {
  id: string
  marcacao1: string
  marcacao2: string
  marcacao3: string
  reco: string
  ganza: string
  caixa: string
  tarol: string
  tamborim: string
  tantan: string
  repinique: string
  prato: string
  agogo: string
  cuica: string
  pandeiro: string
  chocalho: string
}

function ListaComponentesGrupo() {
  const [instrumentos, setInstrumentos] = useState<Instrumentos[]>([])
  const [excluido, setExcluido] = useState<string>('')

  function deleteUser(id: string) {
    firebase
      .firestore()
      .collection('componentes_grupo')
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

  const fetchInstrumentos = async () => {
    const instrumentosCollection = await firebase
      .firestore()
      .collection('componentes_grupo')
      .get()
    const listaIn: Instrumentos[] = []
    instrumentosCollection.forEach((doc) => {
      const instData = doc.data()
      listaIn.push({
        id: doc.id,
        marcacao1: instData.marcacao1,
        marcacao2: instData.marcacao2,
        marcacao3: instData.marcacao3,
        reco: instData.reco,
        ganza: instData.ganza,
        caixa: instData.caixa,
        tarol: instData.tarol,
        tamborim: instData.tamborim,
        tantan: instData.tantan,
        repinique: instData.repinique,
        prato: instData.prato,
        agogo: instData.agogo,
        cuica: instData.cuica,
        pandeiro: instData.pandeiro,
        chocalho: instData.chocalho
      })
    })
    setInstrumentos(listaIn)
  }

  useEffect(() => {
    fetchInstrumentos()
  }, [excluido])

  const adicionarInstrumentos = () => {
    if (instrumentos.length > 0) {
      Swal.fire({
        title: 'Aviso',
        text: 'Já existe um registro de instrumentos. Não é possível adicionar mais.',
        icon: 'error',
        confirmButtonColor: '#000000',
        confirmButtonText: 'OK'
      })
      return
    }
    Swal.fire({
      title: 'Adicionar Instrumentos',
      html: `
      <div style="max-height: 500px; overflow-y: auto;">
      <table class="table">
      <tr>
        <td><strong>1ª Marcação :</strong><span style="color:red">*</span><input id="marcacao1" class="swal2-input" placeholder="1ª Marcação"></td>
        <td><strong>2ª Marcação :</strong><span style="color:red">*</span><input id="marcacao2" class="swal2-input" placeholder="2ª Marcação"></td>
      </tr>
      <tr>
        <td><strong>3ª Marcação :</strong><span style="color:red">*</span><input id="marcacao3" class="swal2-input" placeholder="3ª Marcação"></td>
        <td><strong>Reco-Reco:</strong><span style="color:red">*</span><input id="reco" class="swal2-input" placeholder="Reco-Reco"></td>
      </tr>
      <tr>
        <td><strong>Ganzá :</strong><span style="color:red">*</span><input id="ganza" class="swal2-input" placeholder="Ganzá"></td>
        <td><strong>Caixa :</strong><span style="color:red">*</span><input id="caixa" class="swal2-input" placeholder="Caixa"></td>
      </tr>
      <tr>
        <td><strong>Tarol :</strong><span style="color:red">*</span><input id="tarol" class="swal2-input" placeholder="Tarol"></td>
        <td><strong>Tamborim :</strong><span style="color:red">*</span><input id="tamborim" class="swal2-input" placeholder="Tamborim"></td>
      </tr>
      <tr>
        <td><strong>Tan-tan :</strong><span style="color:red">*</span><input id="tantan" class="swal2-input" placeholder="Tan-tan"></td>
        <td><strong>Repinique :</strong><span style="color:red">*</span><input id="repinique" class="swal2-input" placeholder="Repinique"></td>
      </tr>
      <tr>
        <td><strong>Prato :</strong><span style="color:red">*</span><input id="prato" class="swal2-input" placeholder="Prato"></td>
        <td><strong>Agogô :</strong><span style="color:red">*</span><input id="agogo" class="swal2-input" placeholder="Agogô"></td>
      </tr>
      <tr>
        <td><strong>Cuíca :</strong><span style="color:red">*</span><input id="cuica" class="swal2-input" placeholder="Cuíca"></td>
        <td><strong>Pandeiro :</strong><span style="color:red">*</span><input id="pandeiro" class="swal2-input" placeholder="Pandeiro"></td>
      </tr>
      <tr>
        <td><strong>Chocalho :</strong><span style="color:red">*</span><input id="chocalho" class="swal2-input" placeholder="Chocalho"></td>
      </tr>
    </table>
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
        // Obter os valores dos campos
        const marcacao1Input = document.getElementById(
          'marcacao1'
        ) as HTMLInputElement
        const marcacao2Input = document.getElementById(
          'marcacao2'
        ) as HTMLInputElement
        const marcacao3Input = document.getElementById(
          'marcacao3'
        ) as HTMLInputElement
        const recoInput = document.getElementById('reco') as HTMLInputElement
        const ganzaInput = document.getElementById('ganza') as HTMLInputElement
        const caixaInput = document.getElementById('caixa') as HTMLInputElement
        const tarolInput = document.getElementById('tarol') as HTMLInputElement
        const tamborimInput = document.getElementById(
          'tamborim'
        ) as HTMLInputElement
        const tantanInput = document.getElementById(
          'tantan'
        ) as HTMLInputElement
        const repiniqueInput = document.getElementById(
          'repinique'
        ) as HTMLInputElement
        const pratoInput = document.getElementById('prato') as HTMLInputElement
        const agogoInput = document.getElementById('agogo') as HTMLInputElement
        const cuicaInput = document.getElementById('cuica') as HTMLInputElement
        const pandeiroInput = document.getElementById(
          'pandeiro'
        ) as HTMLInputElement
        const chocalhoInput = document.getElementById(
          'chocalho'
        ) as HTMLInputElement

        if (
          !marcacao1Input.value ||
          !marcacao2Input.value ||
          !marcacao3Input.value ||
          !recoInput.value ||
          !ganzaInput.value ||
          !caixaInput.value ||
          !tarolInput.value ||
          !tamborimInput.value ||
          !tantanInput.value ||
          !repiniqueInput.value ||
          !pratoInput.value ||
          !agogoInput.value ||
          !cuicaInput.value ||
          !pandeiroInput.value ||
          !chocalhoInput.value
        ) {
          if (!marcacao1Input.value) {
            marcacao1Input.classList.add('borda')
          } else {
            marcacao1Input.classList.remove('borda')
          }
          if (!marcacao2Input.value) {
            marcacao2Input.classList.add('borda')
          } else {
            marcacao2Input.classList.remove('borda')
          }
          if (!marcacao3Input.value) {
            marcacao3Input.classList.add('borda')
          } else {
            marcacao3Input.classList.remove('borda')
          }
          if (!recoInput.value) {
            recoInput.classList.add('borda')
          } else {
            recoInput.classList.remove('borda')
          }
          if (!ganzaInput.value) {
            ganzaInput.classList.add('borda')
          } else {
            ganzaInput.classList.remove('borda')
          }
          if (!caixaInput.value) {
            caixaInput.classList.add('borda')
          } else {
            caixaInput.classList.remove('borda')
          }
          if (!tarolInput.value) {
            tarolInput.classList.add('borda')
          } else {
            tarolInput.classList.remove('borda')
          }
          if (!tamborimInput.value) {
            tamborimInput.classList.add('borda')
          } else {
            tamborimInput.classList.remove('borda')
          }
          if (!tantanInput.value) {
            tantanInput.classList.add('borda')
          } else {
            tantanInput.classList.remove('borda')
          }
          if (!repiniqueInput.value) {
            repiniqueInput.classList.add('borda')
          } else {
            repiniqueInput.classList.remove('borda')
          }
          if (!pratoInput.value) {
            pratoInput.classList.add('borda')
          } else {
            pratoInput.classList.remove('borda')
          }
          if (!agogoInput.value) {
            agogoInput.classList.add('borda')
          } else {
            agogoInput.classList.remove('borda')
          }
          if (!cuicaInput.value) {
            cuicaInput.classList.add('borda')
          } else {
            cuicaInput.classList.remove('borda')
          }
          if (!pandeiroInput.value) {
            pandeiroInput.classList.add('borda')
          } else {
            pandeiroInput.classList.remove('borda')
          }
          if (!chocalhoInput.value) {
            chocalhoInput.classList.add('borda')
          } else {
            chocalhoInput.classList.remove('borda')
          }
          // Exibir mensagem de erro
          Swal.showValidationMessage('Por favor, preencha todos os campos.')
        }
        // Se todos os campos estiverem preenchidos, retornar os valores
        return {
          marcacao1: marcacao1Input.value,
          marcacao2: marcacao2Input.value,
          marcacao3: marcacao3Input.value,
          reco: recoInput.value,
          ganza: ganzaInput.value,
          caixa: caixaInput.value,
          tarol: tarolInput.value,
          tamborim: tamborimInput.value,
          tantan: tantanInput.value,
          repinique: repiniqueInput.value,
          prato: pratoInput.value,
          agogo: agogoInput.value,
          cuica: cuicaInput.value,
          pandeiro: pandeiroInput.value,
          chocalho: chocalhoInput.value
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const {
          marcacao1,
          marcacao2,
          marcacao3,
          reco,
          ganza,
          caixa,
          tarol,
          tamborim,
          tantan,
          repinique,
          prato,
          agogo,
          cuica,
          pandeiro,
          chocalho
        } = result.value
        firebase
          .firestore()
          .collection('componentes_grupo')
          .add({
            marcacao1,
            marcacao2,
            marcacao3,
            reco,
            ganza,
            caixa,
            tarol,
            tamborim,
            tantan,
            repinique,
            prato,
            agogo,
            cuica,
            pandeiro,
            chocalho
          })
          .then(() => {
            fetchInstrumentos()
          })
          .catch((error) => {
            console.error('Erro ao adicionar compositor:', error)
            Swal.fire('Erro!', 'error')
          })
      }
    })
  }

  function editar(id: string) {
    firebase
      .firestore()
      .collection('componentes_grupo')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const docData = doc.data()
          if (docData) {
            const instrumentoData = docData as Instrumentos
            Swal.fire({
              title: 'Editar Instrumentos',
              html: `
              <div style="max-height: 500px; overflow-y: auto;">
             <table class="table swal2-table">
              <tr>
              <td><strong>1ª Marcação:</strong><span style="color:red">*</span><input id="marcacao1" class="swal2-input" type="text" value="${instrumentoData.marcacao1}"></td>
              <td><strong>2ª Marcação:</strong><span style="color:red">*</span><input id="marcacao2" class="swal2-input" type="text" value="${instrumentoData.marcacao2}"></td>
              </tr>
              <tr>
                <td><strong>3ª Marcação:</strong><span style="color:red">*</span><input id="marcacao3" class="swal2-input" type="text" value="${instrumentoData.marcacao3}"></td>
                <td><strong>Reco-Reco:</strong><span style="color:red">*</span><input id="reco" class="swal2-input" type="text" value="${instrumentoData.reco}"></td>
            </tr>
            <tr>
                <td><strong>Ganzá:</strong><span style="color:red">*</span><input id="ganza" class="swal2-input" type="text" value="${instrumentoData.ganza}"></td>
                <td><strong>Caixa:</strong><span style="color:red">*</span><input id="caixa" class="swal2-input" type="text" value="${instrumentoData.caixa}"></td>
            </tr>
            <tr>
                <td><strong>Tarol:</strong><span style="color:red">*</span><input id="tarol" class="swal2-input" type="text" value="${instrumentoData.tarol}"></td>
                <td><strong>Tamborim:</strong><span style="color:red">*</span><input id="tamborim" class="swal2-input" type="text" value="${instrumentoData.tamborim}"></td>
            </tr>
            <tr>
                <td><strong>Tan-tan:</strong><span style="color:red">*</span><input id="tantan" class="swal2-input" type="text" value="${instrumentoData.tantan}"></td>
                <td><strong>Repinique:</strong><span style="color:red">*</span><input id="repinique" class="swal2-input" type="text" value="${instrumentoData.repinique}"></td>
            </tr>
            <tr>
                <td><strong>Prato:</strong><span style="color:red">*</span><input id="prato" class="swal2-input" type="text" value="${instrumentoData.prato}"></td>
                <td><strong>Agogô:</strong><span style="color:red">*</span><input id="agogo" class="swal2-input" type="text" value="${instrumentoData.agogo}"></td>
            </tr>
            <tr>
                <td><strong>Cuíca:</strong><span style="color:red">*</span><input id="cuica" class="swal2-input" type="text" value="${instrumentoData.cuica}"></td>
                <td><strong>Pandeiro:</strong><span style="color:red">*</span><input id="pandeiro" class="swal2-input" type="text" value="${instrumentoData.pandeiro}"></td>
            </tr>
            <tr style="display: flex; justify-content: center;">
                <td><strong>Chocalho:</strong><span style="color:red">*</span><input id="chocalho" class="swal2-input" type="text" value="${instrumentoData.chocalho}"></td>
            </tr>
            </table>
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
                const marcacao1Input = document.getElementById(
                  'marcacao1'
                ) as HTMLInputElement
                const marcacao2Input = document.getElementById(
                  'marcacao2'
                ) as HTMLInputElement
                const marcacao3Input = document.getElementById(
                  'marcacao3'
                ) as HTMLInputElement
                const recoInput = document.getElementById(
                  'reco'
                ) as HTMLInputElement
                const ganzaInput = document.getElementById(
                  'ganza'
                ) as HTMLInputElement
                const caixaInput = document.getElementById(
                  'caixa'
                ) as HTMLInputElement
                const tarolInput = document.getElementById(
                  'tarol'
                ) as HTMLInputElement
                const tamborimInput = document.getElementById(
                  'tamborim'
                ) as HTMLInputElement
                const tantanInput = document.getElementById(
                  'tantan'
                ) as HTMLInputElement
                const repiniqueInput = document.getElementById(
                  'repinique'
                ) as HTMLInputElement
                const pratoInput = document.getElementById(
                  'prato'
                ) as HTMLInputElement
                const agogoInput = document.getElementById(
                  'agogo'
                ) as HTMLInputElement
                const cuicaInput = document.getElementById(
                  'cuica'
                ) as HTMLInputElement
                const pandeiroInput = document.getElementById(
                  'pandeiro'
                ) as HTMLInputElement
                const chocalhoInput = document.getElementById(
                  'chocalho'
                ) as HTMLInputElement

                if (
                  !marcacao1Input.value ||
                  !marcacao2Input.value ||
                  !marcacao3Input.value ||
                  !recoInput.value ||
                  !ganzaInput.value ||
                  !caixaInput.value ||
                  !tarolInput.value ||
                  !tamborimInput.value ||
                  !tantanInput.value ||
                  !repiniqueInput.value ||
                  !pratoInput.value ||
                  !agogoInput.value ||
                  !cuicaInput.value ||
                  !pandeiroInput.value ||
                  !chocalhoInput.value
                ) {
                  if (!marcacao1Input.value) {
                    marcacao1Input.classList.add('borda')
                  } else {
                    marcacao1Input.classList.remove('borda')
                  }
                  if (!marcacao2Input.value) {
                    marcacao2Input.classList.add('borda')
                  } else {
                    marcacao2Input.classList.remove('borda')
                  }
                  if (!marcacao3Input.value) {
                    marcacao3Input.classList.add('borda')
                  } else {
                    marcacao3Input.classList.remove('borda')
                  }
                  if (!recoInput.value) {
                    recoInput.classList.add('borda')
                  } else {
                    recoInput.classList.remove('borda')
                  }
                  if (!ganzaInput.value) {
                    ganzaInput.classList.add('borda')
                  } else {
                    ganzaInput.classList.remove('borda')
                  }
                  if (!caixaInput.value) {
                    caixaInput.classList.add('borda')
                  } else {
                    caixaInput.classList.remove('borda')
                  }
                  if (!tarolInput.value) {
                    tarolInput.classList.add('borda')
                  } else {
                    tarolInput.classList.remove('borda')
                  }
                  if (!tamborimInput.value) {
                    tamborimInput.classList.add('borda')
                  } else {
                    tamborimInput.classList.remove('borda')
                  }
                  if (!tantanInput.value) {
                    tantanInput.classList.add('borda')
                  } else {
                    tantanInput.classList.remove('borda')
                  }
                  if (!repiniqueInput.value) {
                    repiniqueInput.classList.add('borda')
                  } else {
                    repiniqueInput.classList.remove('borda')
                  }
                  if (!pratoInput.value) {
                    pratoInput.classList.add('borda')
                  } else {
                    pratoInput.classList.remove('borda')
                  }
                  if (!agogoInput.value) {
                    agogoInput.classList.add('borda')
                  } else {
                    agogoInput.classList.remove('borda')
                  }
                  if (!cuicaInput.value) {
                    cuicaInput.classList.add('borda')
                  } else {
                    cuicaInput.classList.remove('borda')
                  }
                  if (!pandeiroInput.value) {
                    pandeiroInput.classList.add('borda')
                  } else {
                    pandeiroInput.classList.remove('borda')
                  }
                  if (!chocalhoInput.value) {
                    chocalhoInput.classList.add('borda')
                  } else {
                    chocalhoInput.classList.remove('borda')
                  }
                  // Exibir mensagem de erro
                  Swal.showValidationMessage(
                    'Por favor, preencha todos os campos.'
                  )
                }
                // Se todos os campos estiverem preenchidos, retornar os valores
                return {
                  marcacao1: marcacao1Input.value,
                  marcacao2: marcacao2Input.value,
                  marcacao3: marcacao3Input.value,
                  reco: recoInput.value,
                  ganza: ganzaInput.value,
                  caixa: caixaInput.value,
                  tarol: tarolInput.value,
                  tamborim: tamborimInput.value,
                  tantan: tantanInput.value,
                  repinique: repiniqueInput.value,
                  prato: pratoInput.value,
                  agogo: agogoInput.value,
                  cuica: cuicaInput.value,
                  pandeiro: pandeiroInput.value,
                  chocalho: chocalhoInput.value
                }
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const newData = result.value
                firebase
                  .firestore()
                  .collection('componentes_grupo')
                  .doc(id)
                  .update(newData)
                  .then(() => {
                    console.log('Nome do autor atualizado com sucesso!')
                    fetchInstrumentos()
                  })
                  .catch((error) => {
                    console.error('Erro ao atualizar o nome do autor:', error)
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
        Número de Componentes por Grupo de Instrumentos
      </h1>
      <button
        onClick={adicionarInstrumentos}
        className="black btn btn-dark"
        id="basic-addon1"
        type="button">
        <i className="fas fa-plus"></i>
      </button>
      {instrumentos.map((instrumento) => (
        <React.Fragment key={instrumento.id}>
          <button
            onClick={() => editar(instrumento.id)}
            className="black btn btn-dark mr-1 ml-3"
            style={{ width: '3.5%' }}
            id="basic-addon1"
            type="button">
            <i className="white fas fa-edit"></i>
          </button>
          <button
            onClick={() => confirmDeleteUser(instrumento.id)}
            className="fundo ml-2 btn btn-danger"
            id="basic-addon1"
            type="button">
            <i className="far fa-trash-alt"></i>
          </button>
        </React.Fragment>
      ))}
      <table className="table table-bordered mt-3 text-center">
        <thead>
          <tr>
            <th scope="col" className="tamanho">
              1ª Marcação
            </th>
            <th scope="col" className="tamanho">
              2ª Marcação
            </th>
            <th scope="col" className="tamanho">
              3ª Marcação
            </th>
            <th scope="col" className="tamanho">
              Reco-Reco
            </th>
            <th scope="col" className="tamanho">
              Ganza
            </th>
          </tr>
        </thead>
        <tbody>
          {instrumentos.map((instrumento, index) => (
            <tr key={instrumento.id}>
              <td>{instrumento.marcacao1}</td>
              <td>{instrumento.marcacao2}</td>
              <td>{instrumento.marcacao3}</td>
              <td>{instrumento.reco}</td>
              <td>{instrumento.ganza}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="table table-bordered mt-3 text-center">
        <thead>
          <tr>
            <th scope="col" className="tamanho">
              Caixa
            </th>
            <th scope="col" className="tamanho">
              Tarol
            </th>
            <th scope="col" className="tamanho">
              Tamborim
            </th>
            <th scope="col" className="tamanho">
              Tan-Tan
            </th>
            <th scope="col" className="tamanho">
              Repinique
            </th>
          </tr>
        </thead>
        <tbody>
          {instrumentos.map((instrumento, index) => (
            <tr key={instrumento.id}>
              <td>{instrumento.caixa}</td>
              <td>{instrumento.tarol}</td>
              <td>{instrumento.tamborim}</td>
              <td>{instrumento.tantan}</td>
              <td>{instrumento.repinique}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="table table-bordered mt-3 text-center">
        <thead>
          <tr>
            <th className="tamanho" scope="col">
              Prato
            </th>
            <th className="tamanho" scope="col">
              Agogô
            </th>
            <th className="tamanho" scope="col">
              Cuíca
            </th>
            <th className="tamanho" scope="col">
              Pandeiro
            </th>
            <th className="tamanho" scope="col">
              Chocalho
            </th>
          </tr>
        </thead>
        <tbody>
          {instrumentos.map((instrumento, index) => (
            <tr key={instrumento.id}>
              <td>{instrumento.prato}</td>
              <td>{instrumento.agogo}</td>
              <td>{instrumento.cuica}</td>
              <td>{instrumento.pandeiro}</td>
              <td>{instrumento.chocalho}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaComponentesGrupo
