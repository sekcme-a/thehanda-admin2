import ResetPassword from "../components/ResetPassword"



const ResetPw = () => {

  return(
    <>
      <h2 className="font-bold text-2xl text-gray-700">
        비밀번호를 잊어버리셨나요? 🔒
      </h2>
      <h3 className="text-base mt-4 text-gray-80">
        이메일을 입력하시면 해당 이메일로 
        비밀번호 재설정 안내 메일을 보내드립니다.
      </h3>

      <ResetPassword />
    </>
  )
}

export default ResetPw