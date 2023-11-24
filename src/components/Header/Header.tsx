const Header = () => {
  return (
    <header>
      <div className="relative flex flex-rol justify-between items-center bg-blue-50 h-[100px]">
        <div className="z-10 absolute w-full h-full flex">
          <div className="w-full bg-[#CF3931] after:content-[''] after:right-[40%] after:w-0 after:h-0 after:border-r-[200px] after:border-r-[#3A8347] after:border-b-[#CF3931] after:border-b-[100px] after:absolute"></div>
          <div className="w-full bg-[#3A8347]"></div>
        </div>
        <div className="absolute z-20 w-full flex justify-between">
          <a href="/">
            <img
              src="images/logo-sambook.svg"
              className="w-24 h-24"
              alt="logo Sambook"
            />
          </a>
          <div className="flex">
            <img
              src="images/logo-granderio.svg"
              className="w-[90px] h-[90px]"
              alt="logo escola de samba Grande rio"
            />
            <div className="flex flex-col items-center">
              <h1 className="text-white text-5xl font-marck-script ml-5 mt-2">
                Grande Rio
              </h1>
              <h2 className="text-3xl font-marck-script text-white">2023</h2>
            </div>
          </div>
          <div className="flex flex-col items-end mr-4 justify-center">
            <h2 className="text-white text-lg ml-5 ">Gabriel Haddad</h2>
            <div className="flex items-center justify-end cursor-pointer">
              <span className="text-white">Sair</span>
              <img
                src="images/icon-logout.svg"
                alt="icone de logout"
                className="w-4 h-4 ml-2"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
