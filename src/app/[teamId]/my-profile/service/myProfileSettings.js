import { supabase } from '@/lib/supabase';
import { deleteFolder, uploadFilesToSupabase } from '@/utils/supabase/supabaseStorageHandle';


export async function updateMyProfile(file, displayName, userId) {

  if (!userId) {
    throw new Error('User ID가 제공되지 않았습니다.');
  }

  try {
    let uploadedUrls=""
    if(file){
      // 파일 업로드 경로 지정
      const path = `${userId}/profile_image`; // 팀 ID를 경로에 포함
      await deleteFolder(path)
      // 파일을 Supabase 스토리지에 업로드하고 공개 URL 가져오기
      uploadedUrls = await uploadFilesToSupabase([file], path);
    }

    // 'profiles' 테이블에서 해당 팀의 프로필 URL 업데이트
    const { data, error } = await supabase
      .from('profiles')
      .update(
        file ? 
        { image: uploadedUrls[0], display_name: displayName }
        :
        { display_name: displayName}
      )
      .eq('uid', userId);

    if (error) {
      console.error('updateMyProfile:', error.message);
      throw new Error('내 프로필 업데이트 실패');
    }

    return uploadedUrls[0];
  } catch (error) {
    console.error('updateMyProfile:', error.message);
    throw error;
  }
}
