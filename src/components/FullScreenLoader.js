import Image from "next/image"



const FullScreenLoader = () => {

  return(
    <div className="
      fixed inset-0 top-0 left-0 w-screen h-screen
      flex items-center justify-center 
      bg-white 
      z-50"
    >
      <div>
        <Image
          src="/images/logo_nobg.png"
          width={260}
          height={260}
          alt="배경"
        />
        <p className="text-center">잠시만 기다려주세요...</p>
      </div>
    </div>
  )
}

export default FullScreenLoader