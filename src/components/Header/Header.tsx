import React, { useState, useEffect } from 'react'
import firebase from '../Config/firebase'
import 'firebase/auth'
import './Header.css'

const Header = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email)
      } else {
        // Usuário não está logado, você pode limpar o email aqui se necessário
        setUserEmail('')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const [popoverVisible, setPopoverVisible] = useState(false)

  const togglePopover = () => {
    setPopoverVisible(!popoverVisible)
  }

  return (
    <header>
      <div className="relative flex flex-rol justify-between items-center bg-blue-50 h-[100px]">
        <div className="z-10 absolute w-full h-full flex">
          <div className="w-full bg-[#CF3931] after:content-[''] after:right-[40%] after:w-0 after:h-0 after:border-r-[200px] after:border-r-[#3A8347] after:border-b-[#CF3931] after:border-b-[100px] after:absolute"></div>
          <div className="w-full bg-[#3A8347]"></div>
        </div>
        <div className="absolute z-20 w-full flex justify-between">
          <a href="/conteudo/menu">
            <img
              src="/images/logo-sambook.svg"
              className="w-24 h-24"
              alt="logo Sambook"
            />
          </a>
          <div className="flex">
            <img
              src="/images/logo-granderio.svg"
              className="w-[90px] h-[90px]"
              alt="logo escola de samba Grande rio"
            />
            <div className="flex flex-col items-center">
              <h1 className="text-white text-5xl font-inter-script ml-5 mt-2">
                Grande Rio
              </h1>
              <h2 className="text-3xl font-marck-script text-white">2023</h2>
            </div>
          </div>
          <div className="flex flex-col items-end mr-4 justify-center">
            {userEmail && (
              <div className="relative">
                <img
                  src="/images/usuario.png"
                  alt="icone de logout"
                  className="w-6 h-6 ml-2 mt-2 cursor-pointer"
                  title="Usuário"
                  onClick={togglePopover}
                />
                {popoverVisible && (
                  <div className="absolute right-full bottom-0 bg-white border border-gray-300 shadow-md p-2 rounded-lg mr-2 popover">
                    {userEmail}
                    <div className="arrow"></div>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-end cursor-pointer">
              <a href="/">
                <img
                  src="/images/icon-logout.svg"
                  alt="icone de logout"
                  className="w-6 h-6 ml-2 mt-2"
                  title="Sair"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
