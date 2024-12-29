// utils/uploadFilesToSupabase.js
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';
/**
 * 파일들을 Supabase 스토리지의 특정 경로에 업로드하고, 업로드된 파일들의 공개 URL을 반환합니다.
 * 
 * @param {File[]} files - 업로드할 파일 배열.
 * @param {string} path - 파일이 저장될 Supabase 스토리지 경로.
 * @returns {Promise<string[]>} - 업로드된 파일들의 공개 URL 배열.
 */
export async function uploadFilesToSupabase(files, path) {
  if (!files || files.length === 0) {
    // throw new Error('업로드할 파일이 제공되지 않았습니다.');
    return []
  }

  if (!path) {
    throw new Error('파일 업로드 경로가 제공되지 않았습니다.');
  }

  const uploadedUrls = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    //이미 스토리지에 업로드되어있어, url로 표시되는 값은 제외
    if(typeof file === "string")
      uploadedUrls.push(file)
    else{

      // 고유한 파일 이름 생성 (파일명이 중복되지 않도록 인덱스 추가)
      const uniqueFileName = `${path}/${uuidv4()}_${index}`;
      
      // 파일을 Supabase 스토리지에 업로드
      const { data, error } = await supabase.storage
        .from('images') // 사용 중인 Supabase 스토리지 버킷 이름으로 교체하세요
        .upload(uniqueFileName, file);

      if (error) {
        console.error('파일 업로드 중 오류 발생:', error);
        throw new Error(`파일 업로드 실패: ${file.name}`);
      }

      // 업로드된 파일의 공개 URL 가져오기
      const { data:urlData, error: urlError } = supabase.storage
        .from('images')
        .getPublicUrl(uniqueFileName);

      if (urlError) {
        console.error('공개 URL 생성 중 오류 발생:', urlError.message);
        throw new Error(`파일의 공개 URL 생성 실패: ${file.name}`);
      }

      uploadedUrls.push(urlData.publicUrl);
    }
  }
  console.log(uploadedUrls)
  return uploadedUrls;
}

export const deleteFolder = async (folderPath) => {
  try{
    const {data, error} = await supabase.storage
      .from("images")
      .list(folderPath)
   if(error) throw error
  
   console.log(data)
   for (const file of data){
    const filePath = `${folderPath}/${file.name}`
    await supabase.storage.from("images").remove(filePath)
   }
   return true
  }catch(e) {
    console.log(e)
    return false
  }
}