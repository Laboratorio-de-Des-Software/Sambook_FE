import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './EditarFantasia.css'
import firebase from '../../../Config/firebase'
import 'firebase/firestore'

interface Fantasia {
  id?: string
  fantasia: string
  rep: string
  ala: string
  responsavel: string
  obs: string
  imagemUrl?: string
}

const EditarFantasia: React.FC = () => {
  const [fantasia, setFantasia] = useState<string>('')
  const [rep, setRep] = useState<string>('')
  const [ala, setAla] = useState<string>('')
  const [responsavel, setResponsavel] = useState<string>('')
  const [obs, setObs] = useState<string>('')
  const [novaImagem, setNovaImagem] = useState<File | null>(null)
  const [imagemExistenteUrl, setImagemExistenteUrl] = useState<string>('')
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
          .collection('fantasias')
          .doc(id)
          .get()
        const data = resultado.data() as Fantasia
        setFantasia(data.fantasia)
        setRep(data.rep)
        setAla(data.ala)
        setResponsavel(data.responsavel)
        setObs(data.obs)
        if (data.imagemUrl) {
          setImagemExistenteUrl(data.imagemUrl)
        }
      } catch (error) {
        console.error('Erro ao buscar fantasia:', error)
      }
    }
    fetchData()
  }, [id])

  const AlterarFantasia = async () => {
    try {
      if (fantasia.length === 0) {
        setMensagem('Informe o nome da fantasia')
      } else if (imagemExistenteUrl.length === 0) {
        setMensagem('Informe a imagem da fantasia')
      } else if (rep.length === 0) {
        setMensagem('Informe o que a fantasia representa')
      } else if (ala.length === 0) {
        setMensagem('Informe a ala da fantasia')
      } else if (responsavel.length === 0) {
        setMensagem('Informe o responsável pela Ala')
      } else {
        await db.collection('fantasias').doc(id).update({
          fantasia: fantasia,
          rep: rep,
          ala: ala,
          responsavel: responsavel,
          obs: obs
        })
        setMensagem('')
        setSucesso(true)
        navigate('/conteudo/fantasia')
      }
      if (novaImagem) {
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(`fantasias/${novaImagem.name}`)
        await fileRef.put(novaImagem)
        const novaImagemUrl = await fileRef.getDownloadURL()
        // Atualize a URL da imagem no Firestore
        await db
          .collection('fantasias')
          .doc(id)
          .update({ imagemUrl: novaImagemUrl })
        setNovaImagem(null)
        navigate('/conteudo/fantasia')
      }
    } catch (error) {
      console.error('Erro ao atualizar fantasia:', error)
      setMensagem(String(error))
      setSucesso(false) // Alteração aqui
    }
  }

  return (
    <div className="centralizado">
      <div className="container-fluid titulo">
        <div className="offset-lg-2 col-lg-6">
          <h1 className="display-4 centralizado mb-4">Editar Fantasia</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="fantasia" className="form-label">
                Nome da Fantasia<span className="asterisk"> *</span>
              </label>
              <input
                onChange={(e) => setFantasia(e.target.value)}
                value={fantasia}
                type="text"
                className="form-control"
                id="fantasia"
                aria-describedby="fantasiaHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="novaImagem" className="form-label">
                Nova Imagem da Fantasia<span className="asterisk"> *</span>
              </label>
              <input
                onChange={handleNovaImagemUpload}
                type="file"
                className="form-control"
                id="novaImagem"
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
                value={ala}
                type="text"
                className="form-control"
                id="ala"
                aria-describedby="alaHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="responsavel" className="form-label">
                Responsável pela Ala<span className="asterisk"> *</span>
              </label>
              <input
                onChange={(e) => setResponsavel(e.target.value)}
                value={responsavel}
                type="text"
                className="form-control"
                id="responsavel"
                aria-describedby="responsavelHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="rep" className="form-label">
                Observações
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
                to="/conteudo/fantasia"
                className="black btn btn-dark btn-acao">
                Cancelar
              </Link>
              <button
                onClick={AlterarFantasia}
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

export default EditarFantasia
