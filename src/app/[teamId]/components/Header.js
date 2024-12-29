import AvatarWithMenu from "./AvatarWithMenu"
import NavBar from "./Navbar"




const Header = ({title}) => {

  return(
    <div className="
      flex justify-between items-center
      flex-1 h-14 
      border-b border-gray-300
      bg-white
      px-2
      "
    >
      <div className="flex items-center">
        <div className="block md:hidden">
          <NavBar />
        </div>
        <h1 className="ml-6 font-bold text-lg">{title}</h1>
      </div>

      <AvatarWithMenu />
    </div>
  )
}

export default Header