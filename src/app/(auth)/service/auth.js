import { supabase } from "@/lib/supabase"




export const loginWithEmailPw = async (email, pw) => {

  try{
    const {error, data} = await supabase.auth.signInWithPassword({
      email: email,
      password: pw
    })

    if(error) throw error

    return data
  }catch(error) {
    console.log("login:", error)
    throw error
  }
}

export const signInWithEmailPw = async (email, pw) => {
  try{
    const {error} = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        emailRedirectTo: "https://monew.co.kr/auth/link-verified"
      }
    })

    if(error) throw error
    return true;
  } catch(error) {
    console.error("signInWithEmailPw: ", error)
    throw error
  }
}

export const isEmailExists = async (email) => {
  try{
    const {data, error} = await supabase
      .from("profiles")
      .select()
      .eq("email", email)
      .maybeSingle()

      if(error) throw error
    
      if(data) return true
      else return false
  } catch(error) {
    console.error("checkIfEmailExists", error)
    throw error
  }
}


export const saveDisplayName = async (uid, displayName) => {
  try{
    const {error} = await supabase
      .from("profiles")
      .update({display_name: displayName})
      .eq("uid", uid)

    if(error) throw error
  } catch(error) {
    if(error.code==="23505"){
      throw "이미 존재하는 닉네임입니다."
    }
    else {
      console.error(error)
      throw error
    }
  }
}


export const fetchTeams = async () => {
  try{
    const {data, error} = await supabase
      .from("teams")
      .select()

    if(error) throw error

    return data
  } catch(error) {
    console.error(error)
    throw error
  }
}