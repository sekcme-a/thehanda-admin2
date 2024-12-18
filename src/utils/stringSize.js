//calculateSizeInBytes
export const getByte = (str) => {
  // 문자열을 UTF-8로 인코딩한 후의 바이트 수 계산
  var sizeInBytes = new Blob([str]).size;
  return sizeInBytes;
}
