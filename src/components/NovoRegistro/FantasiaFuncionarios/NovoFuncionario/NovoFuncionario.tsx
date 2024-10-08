import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './NovoFuncionario.css'
import firebase from '../../../Config/firebase'

interface Funcionario {
  nome: string
  funcao: string
}

function NovoFuncionario() {
  const [nome, setNome] = useState<string>('')
  const [funcao, setFuncao] = useState<string>('')
  const [mensagem, setMensagem] = useState<string>('')
  const [sucesso, setSucesso] = useState('N')
  const db = firebase.firestore()

  const cadastrarFuncionario = () => {
    if (nome.length === 0) {
      setMensagem('Informe o nome do funcinario')
    } else if (funcao.length === 0) {
      setMensagem('Informe sua respectiva função')
    } else {
      const novoFuncionario: Funcionario = {
        nome: nome,
        funcao: funcao
      }

      db.collection('outros_profissionais_fantasia')
        .add(novoFuncionario)
        .then(async (docRef) => {
          const totalFunc = await db
            .collection('outros_profissionais_fantasia')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalFunc + 1
          await docRef.update({ ordem })

          const FuncSnapshot = await db
            .collection('outros_profissionais_fantasia')
            .orderBy('ordem')
            .get()
          const batch = db.batch()
          FuncSnapshot.docs.forEach((FuncDoc, index) => {
            batch.update(FuncDoc.ref, { ordem: index + 1 })
          })
          await batch.commit()
          setMensagem('')
          setSucesso('S')
        })
        .catch((erro) => {
          setMensagem(erro)
          setSucesso('N')
        })
    }
  }

  return (
    <div className="centralizado">
      <div className="container-fluid titulo">
        <div className="offset-lg-2 col-lg-6">
          <h1 className="display-4 centralizado">Registrar Funcionário</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="funcionario" className="form-label">
                Nome
              </label>
              <input
                onChange={(e) => setNome(e.target.value)}
                type="text"
                className="form-control"
                id="nome"
                aria-describedby="nomeHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="funcao" className="form-label">
                Respectiva Função
              </label>
              <input
                onChange={(e) => setFuncao(e.target.value)}
                type="text"
                className="form-control"
                id="funcao"
                aria-describedby="funcaoHelp"
              />
            </div>
            <div className="text-center">
              <Link
                to="/conteudo/fantasia"
                className="black btn btn-dark btn-acao">
                Cancelar
              </Link>
              <button
                onClick={cadastrarFuncionario}
                type="button"
                className="black btn btn-dark btn-acao">
                Salvar
              </button>
            </div>
            {mensagem.length > 0 ? (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            ) : null}
            {sucesso === 'S' ? (
              <Navigate
                to="/conteudo/fantasia"
                state={{ section: 'fichaTecnica' }}
              />
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}

export default NovoFuncionario
