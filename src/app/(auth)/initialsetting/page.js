import InitialNickname from "../components/InitialNickname"



const InitialSetting = () => {


  return(
    <>
      <h2 className="font-bold text-2xl text-gray-700">
        닉네임을 설정해주세요
      </h2>
      <h3 className="text-base mt-4 text-gray-80">
        닉네임은 모든 사용자에게 공개됩니다.
      </h3>

      <InitialNickname /> 
    </>
  )
}

export default InitialSetting