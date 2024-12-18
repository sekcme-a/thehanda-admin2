import NavBar from "./Navbar"




const Header = ({title}) => {

  return(
    <div className="
      flex justify-between items-center
      flex-1 h-14 
      border-b border-gray-300
      bg-white
      "
    >
      <div className="flex items-center">
        <div className="block md:hidden">
          <NavBar />
        </div>
        <h1 className="ml-6 font-bold text-lg">{title}</h1>
      </div>
    </div>
  )
}

export default Header