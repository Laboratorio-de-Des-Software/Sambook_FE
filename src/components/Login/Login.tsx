import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './Login.css'

import firebase from '../Config/firebase'
import 'firebase/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [sucesso, setSucesso] = useState('')

  function LoginUsuario() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then(function (firebaseUser) {
        setSucesso('S')
      })
      .catch(function (error) {
        setSucesso('N')
      })
  }

  function alterarEmail(event: { target: { value: any } }) {
    setEmail(event.target.value)
  }
  function alterarSenha(event: { target: { value: any } }) {
    setSenha(event.target.value)
  }

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-signin">
        <img className="mb-2" src="Images/logo-sambook.svg" alt="logo" />
        <h1 className="h3 mb-3 fw-normal">Login</h1>

        <div className="form-floating">
          <input
            onChange={alterarEmail}
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="E-mail"
          />
          <label htmlFor="floatingInput">E-mail</label>
        </div>

        <div className="form-floating">
          <input
            onChange={alterarSenha}
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Senha"
          />
          <label htmlFor="floatingPassword">Senha</label>
        </div>

        <button
          onClick={LoginUsuario}
          className="black w-100 btn btn-lg btn-dark"
          type="button">
          Acessar
        </button>

        {sucesso === 'N' ? (
          <div className="alert alert-danger mt-2" role="alert">
            E-mail ou senha inválida.
          </div>
        ) : null}
        {sucesso === 'S' ? <Navigate to="/conteudo/menu" /> : null}

        <div className="login-links mt-5">
          <Link to="/ResetSenha" className="mx-3">
            Esqueci minha senha
          </Link>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; Desenvolvido por TCC</p>
      </form>
    </div>
  )
}

export default Login
