import React, { useState, useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import './EditarFuncionario.css'
import firebase from '../../../Config/firebase'
import 'firebase/firestore'

interface Funcionario {
  id: string
  nome: string
  funcao: string
}

const EditarFuncionario: React.FC = () => {
  const [nome, setNome] = useState<string>('')
  const [funcao, setFuncao] = useState<string>('')
  const [mensagem, setMensagem] = useState<string>('')
  const [sucesso, setSucesso] = useState<string>('N')
  const db = firebase.firestore()

  let { id } = useParams<{ id: string }>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultado = await firebase
          .firestore()
          .collection('outros_profissionais_fantasia')
          .doc(id)
          .get()
        const data = resultado.data() as Funcionario
        setNome(data.nome)
        setFuncao(data.funcao)
      } catch (error) {
        console.error('Erro ao buscar funcionário:', error)
      }
    }
    fetchData()
  }, [id])

  const AlterarFuncionario = async () => {
    try {
      if (nome.length === 0) {
        setMensagem('Informe o nome do funcionário')
      } else if (funcao.length === 0) {
        setMensagem('Informe sua respectiva função')
      } else {
        await db.collection('outros_profissionais_fantasia').doc(id).update({
          nome: nome,
          funcao: funcao
        })
        setMensagem('')
        setSucesso('S')
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      setMensagem(String(error))
      setSucesso('N')
    }
  }

  return (
    <div className="centralizado">
      <div className="container-fluid titulo">
        <div className="offset-lg-2 col-lg-6">
          <h1 className="display-4 centralizado">Editar Funcionário</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome
              </label>
              <input
                onChange={(e) => setNome(e.target.value)}
                value={nome}
                type="text"
                className="form-control"
                id="nome"
                aria-describedby="nomeHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="funcao" className="form-label">
                Função
              </label>
              <input
                onChange={(e) => setFuncao(e.target.value)}
                value={funcao}
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
                onClick={AlterarFuncionario}
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

export default EditarFuncionario
