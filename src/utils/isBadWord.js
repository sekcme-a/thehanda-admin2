import { Filter as EngFilter } from "bad-words"
import Filter from "badwords-ko" //한국어 비속어

const filter_en = new EngFilter()
const filter_ko = new Filter()

filter_ko.addWords(
  "섹스","간나","갈보","개새끼","개간년","개눈깔","개돼지","개소리","개씹","개쓰레기","개자식","개지랄","걸레","게이","괴뢰","급식충","김치녀","남창","네다씹","니애미","니애비","느금마","느개비",
  "니미럴","닥쳐","또라이","똥꼬충","로리","전라디언","맘충","메갈리아","워마드","병신","병2신","병1신","보지","불알","부랄","보전깨","보슬아치","보빨","빠구리","빨통","빨갱이","뻐큐","시발","시1발","새끼","쇼타",
  "쇼타콘","씨팔","씨발년","씨부랄","씨방년","시벌탱","씨벌탱","씹","짭새","좆","씹창","씹쓰레기","씹지랄","시발년","애미","애비","애비충","뒤진년","애자","애새끼","왜구","왜놈","일베","오유","육변기","일베충",
  "이완용","워마드","자지","보1지","전두환","노무현","김대중","이재명","문재인","이승만","박근혜","박정희","장애인","이명박","노태우","김영삼","정박아","정신병자","정신병","젖","조센징","좆까","좆나","존나",
  "졸라","좆물","좆만이","좃물","좃만이","귀두","좆집","좆병신","좆빨러","지랄","짱깨",
  "짱개","짱꼴라","찌질이","찐따","카미카제","가미카제","창녀","창놈","최순실","칭챙총","토착왜구","토착짱깨","토착빨갱이","트롤","틀딱","피싸개","한남","한녀","허접","홍어","후빨","네다통","통구이","민주화",
  "ㅁㅈㅎ","느그","앰뒤","앰창","엠창","갈보","강간","강1간","강2간","개불알","개새","개색","개쌔끼","개자슥","개자식","대가리","대갈","대갈빡","딸딸이","매춘","발정","몸파는","보털","보짓","븅딱","븅삼",
  "븅신","븅쉰","빠구리","빠구뤼","빠큐","사까시","사까쉬","펠라","오입","야동","성감대","성관계","섹스","섹","쉬빨","스와핑","쌍년","쌍넌","쌍너엄","쌍뇬","쌍놈","아가리","자즤","조옷","조까","후장",
  "3일한","안철수","갓카","개독교","개쌍도","개쌍디언","고무현","고무통","골좁이","규재찡","근혜찡","김치남","까보전","꼬춘쿠키","꼬추","낙태","네다보","네다홍","냄져","노무","노알라","운지",
  "다카키마사오","로린이","메갈","멍청도","메갈","무현","박원숭","보라니","부랄발광","빵즈","빼액","빼애액","빼에엑","사타부언","소라넷","일간베스트","일베","자1지","자릉내","한남유충","전땅크",
  "좌빨","우빨","쪽국","챙놈","코르셋","홍어","피떡","스팽킹","조센징","더불어민주당","더듬어만진당","국민의힘","국민의짐","국짐","대깨문","지잡대","춍","가오리빵즈","가오리방쯔","스미다","개고기",
  "나치","떼놈","착짱죽짱","칭챙총","시진핑","쪽발이","좆본","성진국","황국신민","깜보","히틀러","푸틴","야스쿠니","이토히로부미","문슬람","찢재명","윤석열","페미니즘"
)
filter_en.addWords(
  "admin","administrator"
)


export const isBadWord = (text) => {
  return filter_en.isProfane(text) || filter_ko.isProfane(text)
}

//table: 연관 supabase table명, referenceId: 연관 table중 row ID
export const detectBadWordsAndLog = async (table, text, referenceId) => {

  const badWordsDetected = [];
  const words = text.split(/\s+/);  // 텍스트를 공백으로 분리

  words.forEach(word => {
    if (filter_en.isProfane(word) || filter_ko.isProfane(word)) {
      badWordsDetected.push(word);
    }
  });
}
