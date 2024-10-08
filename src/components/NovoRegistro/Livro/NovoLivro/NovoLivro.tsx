import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './NovoLivro.css'
import firebase from '../../../Config/firebase'

interface Livro {
  livro: string
  autor: string
  editora: string
  ano: number
  paginas: string
}

function NovoLivro() {
  const [livro, setLivro] = useState<string>('')
  const [autor, setAutor] = useState<string>('')
  const [editora, setEditora] = useState<string>('')
  const [ano, setAno] = useState<string>('')
  const [paginas, setPaginas] = useState<string>('')
  const [mensagem, setMensagem] = useState<string>('')
  const [sucesso, setSucesso] = useState('N')
  const db = firebase.firestore()

  const cadastrarLivro = () => {
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
      const novoLivro: Livro = {
        livro: livro,
        autor: autor,
        editora: editora,
        ano: parseInt(ano),
        paginas: paginas
      }

      db.collection('livros')
        .add(novoLivro)
        .then(async (docRef) => {
          const totalLivros = await db
            .collection('livros')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalLivros + 1
          await docRef.update({ ordem })

          const livrosSnapshot = await db
            .collection('livros')
            .orderBy('ordem')
            .get()
          const batch = db.batch()
          livrosSnapshot.docs.forEach((livroDoc, index) => {
            batch.update(livroDoc.ref, { ordem: index + 1 })
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
          <h1 className="display-4 centralizado">Registrar Livro</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="livro" className="form-label">
                Título do Livro
              </label>
              <input
                onChange={(e) => setLivro(e.target.value)}
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
                onClick={cadastrarLivro}
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

export default NovoLivro
