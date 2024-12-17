import SignInWithIdAndPw from "../components/SignInWithIdAndPw"





const Signin = () => {


  return(
    <>
      <h2 className="font-bold text-2xl text-gray-700">
        더한다 회원가입
      </h2>
      <h3 className="mt-1">
        회원가입을 통해 어플을 관리하세요!
      </h3>
      <h4 className="mt-3 text-sm text-blue-800">
        {`!실제 사용하고 있는 이메일을 입력해주세요.`}
      </h4>
      <h4 className="text-sm text-blue-800">
        {`(비밀번호 찾기 시 메일 발송)`}
      </h4>
      
      <SignInWithIdAndPw />
    </>
  )
}

export default Signin