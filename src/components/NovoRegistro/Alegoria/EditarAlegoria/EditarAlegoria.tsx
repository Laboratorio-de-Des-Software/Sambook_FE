import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './EditarAlegoria.css'
import firebase from '../../../Config/firebase'
import 'firebase/firestore'
import { Dropdown } from 'react-bootstrap'

interface Alegoria {
  id?: string
  alegoria: string
  rep: string
  obs: string
  imagemUrl?: string
  tipo: string
}

const EditarAlegoria: React.FC = () => {
  const [alegoria, setAlegoria] = useState<string>('')
  const [rep, setRep] = useState<string>('')
  const [novaImagem, setNovaImagem] = useState<File | null>(null)
  const [imagemExistenteUrl, setImagemExistenteUrl] = useState<string>('')
  const [tipo, setTipo] = useState('')
  const [obs, setObs] = useState('')
  const [mensagem, setMensagem] = useState<string>('')
  const [sucesso, setSucesso] = useState<boolean>(false)
  const db = firebase.firestore()

  const navigate = useNavigate()

  const handleNovaImagemUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNovaImagem(file)
    }
  }

  let { id } = useParams<{ id: string }>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultado = await firebase
          .firestore()
          .collection('alegorias')
          .doc(id)
          .get()
        const data = resultado.data() as Alegoria
        setAlegoria(data.alegoria)
        setRep(data.rep)
        setTipo(data.tipo)
        if (data.imagemUrl) {
          setImagemExistenteUrl(data.imagemUrl)
        }
      } catch (error) {
        console.error('Erro ao buscar alegoria:', error)
      }
    }
    fetchData()
  }, [id])

  const AlterarAlegoria = async () => {
    try {
      if (alegoria.length === 0) {
        setMensagem('Informe o nome da alegoria')
      } else if (rep.length === 0) {
        setMensagem('Informe o que a alegoria representa')
      } else if (imagemExistenteUrl.length === 0) {
        setMensagem('Informe a imagem da alegoria')
      } else if (tipo.length === 0) {
        setMensagem('Selecione o tipo de alegoria')
      } else {
        await db.collection('alegorias').doc(id).update({
          alegoria: alegoria,
          rep: rep,
          tipo: tipo,
          obs: obs
        })
        setMensagem('')
        setSucesso(true)
        navigate('/conteudo/alegoria')
      }
      if (novaImagem) {
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(`alegorias/${novaImagem.name}`)
        await fileRef.put(novaImagem)
        const novaImagemUrl = await fileRef.getDownloadURL()
        // Atualize a URL da imagem no Firestore
        await db
          .collection('alegorias')
          .doc(id)
          .update({ imagemUrl: novaImagemUrl })
        setNovaImagem(null)
        navigate('/conteudo/alegoria')
      }
    } catch (error) {
      console.error('Erro ao atualizar alegorias:', error)
      setMensagem(String(error))
      setSucesso(false)
    }
  }

  return (
    <div className="centralizado">
      <div className="container-fluid titulo">
        <div className="offset-lg-2 col-lg-6">
          <h1 className="display-4 centralizado">Editar Alegoria</h1>
          <form>
            <Dropdown className="mt-4">
              <Dropdown.Toggle
                className="toggle mb-3"
                variant="secondary"
                id="dropdown-basic">
                {tipo || 'Selecione o tipo de Alegoria'}
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
            <div className="mb-3">
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
                Imagem da Alegoria<span className="asterisk"> *</span>
              </label>
              <input
                onChange={handleNovaImagemUpload}
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
                Obervações
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
            {sucesso ? <div></div> : null}
            <div className="text-center">
              <Link
                to="/conteudo/alegoria"
                className="black btn btn-dark btn-acao">
                Cancelar
              </Link>
              <button
                onClick={AlterarAlegoria}
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

export default EditarAlegoria
