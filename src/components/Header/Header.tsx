const Header = () => {
  return (
    <header>
      <div className="flex flex-rol justify-between items-center p-5 bg-blue-50 h-[100px]">
        <div>
          <h1 className="text-black text-2xl ml-5 ">Sambook</h1>
        </div>
        <h1 className="text-black text-2xl">Grande Rio</h1>
        <div className="flex flex-col ">
          <h2 className="text-black text-md ml-5 ">Gabriel Haddad</h2>
          <p className="text-black float-right"></p>
        </div>
      </div>
    </header>
  )
}

export default Header
