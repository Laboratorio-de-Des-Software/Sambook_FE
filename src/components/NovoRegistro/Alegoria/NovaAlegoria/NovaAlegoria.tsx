import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './NovaAlegoria.css'
import firebase from '../../../Config/firebase'
import { Dropdown } from 'react-bootstrap'

interface Alegoria {
  id?: string
  alegoria: string
  rep: string
  obs: string
  imagemUrl?: string
  tipo: string
}

function NovaAlegoria() {
  const [alegoria, setAlegoria] = useState<string>('')
  const [rep, setRep] = useState<string>('')
  const [imagemUrl, setImagemUrl] = useState<string>('')
  const [tipo, setTipo] = useState('')
  const [obs, setObs] = useState('')
  const [mensagem, setMensagem] = useState<string>('')
  const [sucesso, setSucesso] = useState('N')
  const db = firebase.firestore()

  const cadastrarAlegoria = () => {
    if (tipo.length === 0) {
      setMensagem('Selecione o tipo de alegoria')
    } else if (alegoria.length === 0) {
      setMensagem('Informe o nome da alegoria')
    } else if (imagemUrl.length === 0) {
      setMensagem('Informe a imagem da alegoria')
    } else if (rep.length === 0) {
      setMensagem('Informe o que a alegoria representa')
    } else {
      const NovaAlegoria: Alegoria = {
        alegoria: alegoria,
        rep: rep,
        imagemUrl: imagemUrl,
        tipo: tipo,
        obs: obs
      }

      db.collection('alegorias')
        .add(NovaAlegoria)
        .then(async (docRef) => {
          const totalAlegorias = await db
            .collection('alegorias')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalAlegorias + 1
          await docRef.update({ ordem })

          const alegoriasSnapshot = await db
            .collection('alegorias')
            .orderBy('ordem')
            .get()
          const batch = db.batch()
          alegoriasSnapshot.docs.forEach((alegoriaDoc, index) => {
            batch.update(alegoriaDoc.ref, { ordem: index + 1 })
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(`alegorias/${file.name}`)
        await fileRef.put(file)
        const imageUrl = await fileRef.getDownloadURL()
        setImagemUrl(imageUrl)
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error)
      }
    }
  }

  return (
    <div className="centralizado">
      <div className="container-fluid titulo">
        <div className="offset-lg-2 col-lg-6">
          <h1 className="display-4 centralizado">Registrar Alegoria</h1>
          <form>
            <Dropdown className="mt-4">
              <Dropdown.Toggle
                className="toggle"
                variant="secondary"
                id="dropdown-basic">
                {tipo || 'Selecione o tipo de Alegoria *'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setTipo('Carro Alegórico')}>
                  Carro Alegórico
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTipo('Tripé')}>
                  Tripé
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="mt-3 mb-3">
              <label htmlFor="alegoria" className="form-label">
                Nome da Alegoria<span className="asterisk"> *</span>
              </label>
              <input
                onChange={(e) => setAlegoria(e.target.value)}
                value={alegoria}
                type="text"
                className="form-control"
                id="alegoria"
                aria-describedby="alegoriaHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="imagem" className="form-label">
                Nova Imagem da Alegoria<span className="asterisk"> *</span>
              </label>
              <input
                onChange={handleFileUpload}
                type="file"
                className="form-control"
                id="imagem"
                accept="image/*"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="rep" className="form-label">
                O que Representa:<span className="asterisk"> *</span>
              </label>
              <textarea
                onChange={(e) => setRep(e.target.value)}
                value={rep}
                className="form-control"
                id="rep"
                rows={8}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="obs" className="form-label">
                Observações:
              </label>
              <textarea
                onChange={(e) => setObs(e.target.value)}
                value={obs}
                className="form-control"
                id="obs"
                rows={5}
                style={{ resize: 'vertical' }}
              />
            </div>
            {mensagem.length > 0 ? (
              <div className="alert alert-danger mt-2" role="alert">
                {mensagem}
              </div>
            ) : null}
            {sucesso === 'S' ? (
              <Navigate
                to="/conteudo/alegoria"
                state={{ section: 'fichaTecnica' }}
              />
            ) : null}
            <div className="text-center">
              <Link
                to="/conteudo/alegoria"
                className="black btn btn-dark btn-acao">
                Cancelar
              </Link>
              <button
                onClick={cadastrarAlegoria}
                type="button"
                className="black btn btn-dark btn-acao">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NovaAlegoria
