import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './NovaFantasia.css'
import firebase from '../../../Config/firebase'

interface Fantasia {
  id?: string
  fantasia: string
  rep: string
  ala: string
  responsavel: string
  obs: string
  imagemUrl?: string
}

function NovaFantasia() {
  const [fantasia, setFantasia] = useState<string>('')
  const [rep, setRep] = useState<string>('')
  const [ala, setAla] = useState<string>('')
  const [responsavel, setResponsavel] = useState<string>('')
  const [obs, setObs] = useState<string>('')
  const [imagemUrl, setImagemUrl] = useState<string>('')
  const [mensagem, setMensagem] = useState<string>('')
  const [sucesso, setSucesso] = useState<string>('N')
  const db = firebase.firestore()

  const cadastrarFantasia = () => {
    if (fantasia.length === 0) {
      setMensagem('Informe o nome da fantasia')
    } else if (rep.length === 0) {
      setMensagem('Informe o que a fantasia representa')
    } else if (ala.length === 0) {
      setMensagem('Informe a ala da fantasia')
    } else if (responsavel.length === 0) {
      setMensagem('Informe o responsável pela Ala')
    } else {
      const novaFantasia: Fantasia = {
        fantasia: fantasia,
        rep: rep,
        ala: ala,
        responsavel: responsavel,
        obs: obs,
        imagemUrl: imagemUrl
      }

      db.collection('fantasias')
        .add(novaFantasia)
        .then(async (docRef) => {
          const totalFantasias = await db
            .collection('fantasias')
            .get()
            .then((snapshot) => snapshot.size)
          const ordem = totalFantasias + 1
          await docRef.update({ ordem })

          const fantasiasSnapshot = await db
            .collection('fantasias')
            .orderBy('ordem')
            .get()
          const batch = db.batch()
          fantasiasSnapshot.docs.forEach((fantasiaDoc, index) => {
            batch.update(fantasiaDoc.ref, { ordem: index + 1 })
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
        const fileRef = storageRef.child(`fantasias/${file.name}`)
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
          <h1 className="display-4 centralizado mb-4">Registrar Fantasia</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="fantasia" className="form-label">
                Nome da Fantasia<span className="asterisk"> *</span>
              </label>
              <input
                onChange={(e) => setFantasia(e.target.value)}
                type="text"
                className="form-control"
                id="livro"
                aria-describedby="livroHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="imagem" className="form-label">
                Imagem da Fantasia<span className="asterisk"> *</span>
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
                O que Representa<span className="asterisk"> *</span>
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
              <label htmlFor="ala" className="form-label">
                Nome da Ala<span className="asterisk"> *</span>
              </label>
              <input
                onChange={(e) => setAla(e.target.value)}
                type="text"
                className="form-control"
                id="ala"
                aria-describedby="alaHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ano" className="form-label">
                Responsável pela Ala<span className="asterisk"> *</span>
              </label>
              <input
                onChange={(e) => setResponsavel(e.target.value)}
                type="text"
                className="form-control"
                id="responsavel"
                aria-describedby="responsavelHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="rep" className="form-label">
                Obervações
              </label>
              <textarea
                onChange={(e) => setObs(e.target.value)}
                value={obs}
                className="form-control"
                id="obs"
                rows={5}
                placeholder="Campo opcional"
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
                to="/conteudo/fantasia"
                state={{ section: 'fichaTecnica' }}
              />
            ) : null}
            <div className="text-center">
              <Link
                to="/conteudo/fantasia"
                className="black btn btn-dark btn-acao">
                Cancelar
              </Link>
              <button
                onClick={cadastrarFantasia}
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

export default NovaFantasia
