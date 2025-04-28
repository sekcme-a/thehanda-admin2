import { supabase } from '@/lib/supabase';
import { deleteFolder, uploadFilesToSupabase } from '@/utils/supabase/supabaseStorageHandle';

/**
 * 팀 프로필 사진을 업로드하고 'teams' 테이블의 해당 팀 프로필 URL을 업데이트합니다.
 * 
 * @param {File[]} files - 업로드할 파일 (1개의 파일만 허용).
 * @param {string} teamId - 업데이트할 팀의 ID.
 * @returns {Promise<string>} - 업데이트된 프로필 사진의 공개 URL.
 */
export async function updateTeamProfile(file, teamName, teamId, userId) {
  if (!teamId) {
    throw new Error('팀 ID가 제공되지 않았습니다.');
  }
  if (!userId) {
    throw new Error('User ID가 제공되지 않았습니다.');
  }

  try {
    let uploadedUrls=""
    if(file){
      // 파일 업로드 경로 지정
      const path = `${userId}/team_profile_image/${teamId}`; // 팀 ID를 경로에 포함
      await deleteFolder(path)
      // 파일을 Supabase 스토리지에 업로드하고 공개 URL 가져오기
      uploadedUrls = await uploadFilesToSupabase([file], path);
    }

    // 'teams' 테이블에서 해당 팀의 프로필 URL 업데이트
    const { data, error } = await supabase
      .from('teams')
      .update(
        file ? 
        { image: uploadedUrls[0], name: teamName }
        :
        {name: teamName}
      )
      .eq('id', teamId);

    if (error) {
      console.error('updateTeamProfile:', error.message);
      throw new Error('팀 프로필 업데이트 실패');
    }

    return uploadedUrls[0];
  } catch (error) {
    console.error('updateTeamProfile:', error.message);
    throw error;
  }
}
