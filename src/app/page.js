import { Button, Grid2 } from "@mui/material"
import Image from "next/image"
import IdAndPw from "./(auth)/components/IdAndPw"
import LinkResetPwButton from "./(auth)/components/LinkResetPwButton"


const Home = () => {
  return(
    <div>
      <Grid2 container className="">
        <Grid2 size={8} className="hidden md:block">
          <div className="ml-7 flex items-center">
            <div className="relative w-32 h-32">
              <Image 
                src="/images/logo_nobg.png" 
                alt="로고"
                objectFit="contain" 
                fill
              />
            </div> 
          </div>
          <div className="relative w-full h-[80vh] overflow-hidden">
            <Image 
              src="/images/login_bg.png" 
              alt="배경화면" 
              objectFit="contain" 
              fill
            />
          </div>
        </Grid2>
        <Grid2 size={{md: 4, sm: 12, xs:12}} className="bg-white">
          <div className="
            justify-center flex items-center h-screen
          ">
            <div className="w-4/6">
              <h2 className="font-bold text-2xl text-gray-700">
                Welcome to Thehanda!
              </h2>
              <h3 className="mt-1 text-sm">
                로그인해서 어플을 관리하세요.
              </h3>
              <IdAndPw />
            </div>
          </div>
        </Grid2>
      </Grid2>
    </div>
  )
} 

export default Home