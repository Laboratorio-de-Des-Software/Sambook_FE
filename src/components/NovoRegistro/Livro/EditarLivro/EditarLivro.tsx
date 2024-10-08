import React, { useState, useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import './EditarLivro.css'
import firebase from '../../../Config/firebase'
import 'firebase/firestore'

interface Livro {
  id: string
  livro: string
  autor: string
  editora: string
  ano: string
  paginas: string
}

const EditarLivro: React.FC = () => {
  const [livro, setLivro] = useState<string>('')
  const [autor, setAutor] = useState<string>('')
  const [editora, setEditora] = useState<string>('')
  const [ano, setAno] = useState<string>('')
  const [paginas, setPaginas] = useState<string>('')
  const [mensagem, setMensagem] = useState<string>('')
  const [sucesso, setSucesso] = useState<string>('N')
  const db = firebase.firestore()

  let { id } = useParams<{ id: string }>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultado = await firebase
          .firestore()
          .collection('livros')
          .doc(id)
          .get()
        const data = resultado.data() as Livro
        setLivro(data.livro)
        setAutor(data.autor)
        setEditora(data.editora)
        setAno(data.ano)
        setPaginas(data.paginas)
      } catch (error) {
        console.error('Erro ao buscar livro:', error)
      }
    }
    fetchData()
  }, [id])

  const AlterarLivro = async () => {
    try {
      if (livro.length === 0) {
        setMensagem('Informe o título do livro')
      } else if (autor.length === 0) {
        setMensagem('Informe o autor')
      } else if (editora.length === 0) {
        setMensagem('Informe a editora')
      } else if (isNaN(parseInt(ano))) {
        setMensagem('Informe um ano válido')
      } else if (ano.length === 0) {
        setMensagem('Informe o ano de publicação')
      } else if (paginas.length === 0) {
        setMensagem('Informe quantas páginas foram consultadas')
      } else {
        await db.collection('livros').doc(id).update({
          livro: livro,
          autor: autor,
          editora: editora,
          ano: ano,
          paginas: paginas
        })
        setMensagem('')
        setSucesso('S')
      }
    } catch (error) {
      console.error('Erro ao atualizar livro:', error)
      setMensagem(String(error))
      setSucesso('N')
    }
  }

  return (
    <div className="centralizado">
      <div className="container-fluid titulo">
        <div className="offset-lg-2 col-lg-6">
          <h1 className="display-4 centralizado">Editar Livro</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="livro" className="form-label">
                Título do Livro
              </label>
              <input
                onChange={(e) => setLivro(e.target.value)}
                value={livro}
                type="text"
                className="form-control"
                id="livro"
                aria-describedby="livroHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="autor" className="form-label">
                Autor
              </label>
              <input
                onChange={(e) => setAutor(e.target.value)}
                value={autor}
                type="text"
                className="form-control"
                id="autor"
                aria-describedby="autorHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editora" className="form-label">
                Editora
              </label>
              <input
                onChange={(e) => setEditora(e.target.value)}
                value={editora}
                type="text"
                className="form-control"
                id="editora"
                aria-describedby="editoraHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ano" className="form-label">
                Ano de Edição
              </label>
              <input
                onChange={(e) => setAno(e.target.value)}
                value={ano}
                type="text"
                className="form-control"
                id="ano"
                aria-describedby="anoHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="paginas" className="form-label">
                Páginas Consultadas
              </label>
              <input
                onChange={(e) => setPaginas(e.target.value)}
                value={paginas}
                type="text"
                className="form-control"
                id="paginas"
                aria-describedby="paginasHelp"
              />
            </div>
            <div className="text-center">
              <Link
                to="/conteudo/enredo"
                className="black btn btn-dark btn-acao">
                Cancelar
              </Link>
              <button
                onClick={AlterarLivro}
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
                to="/conteudo/enredo"
                state={{ section: 'fichaTecnica' }}
              />
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarLivro
