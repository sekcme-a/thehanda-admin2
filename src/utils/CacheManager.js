// CacheManager.js

const cache = {};

const setCachedData = (key, data, expiration = 3600) => {
  const expirationTime = Date.now() + expiration * 1000;
  cache[key] = { data, expirationTime };
};

const getCachedData = (key) => {
  const cached = cache[key];
  if (!cached) return null;

  // 만료 시간 확인
  if (Date.now() > cached.expirationTime) {
    delete cache[key];
    return null;
  }
  return cached.data;
};

const clearCacheData = (key) => {
  if (key) {
    // Clear specific cache entry
    delete cache[key];
  } else {
    // Clear all cache entries
    Object.keys(cache).forEach((cacheKey) => delete cache[cacheKey]);
  }
};

// 캐시 값만 업데이트 (만료 시간은 유지)
const updateCachedData = (key, newData) => {
  const cached = cache[key];
  if (!cached) return false; // 캐시 데이터가 없으면 false 반환

  // 데이터만 업데이트하고 만료 시간은 유지
  cache[key].data = newData;
  return true; // 업데이트 성공
};

export const CacheManager = {
  setCachedData,
  getCachedData,
  clearCacheData,
  updateCachedData, // 새로 추가된 메서드
};
