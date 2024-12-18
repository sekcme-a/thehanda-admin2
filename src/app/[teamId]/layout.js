import NavBar from "./components/Navbar"

const Layout = ({children}) => {
  return(
    <div className="flex flex-col lg:flex-row">
      <div className="bg-gray-100 hidden md:block">
        <NavBar />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default Layout
